import { NextResponse } from 'next/server';
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const NFT_PACKAGE_ID = process.env.NFT_PACKAGE_ID;
const NFT_MARKETPLACE_ID = process.env.NFT_MARKETPLACE_ID;

function suiClientFor(network: string): SuiClient {
  const networkMap: Record<string, string> = {
    mainnet: getFullnodeUrl("mainnet"),
    testnet: getFullnodeUrl("testnet"),
    devnet: getFullnodeUrl("devnet"),
  };
  
  const url = networkMap[network] || getFullnodeUrl("testnet");
  return new SuiClient({ url });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get('userAddress');
  const network = searchParams.get('network') || 'testnet';
  const includePrices = searchParams.get('includePrices') === 'true';

  if (!userAddress) {
    return NextResponse.json(
      { error: "Missing required parameter: userAddress" },
      { status: 400 }
    );
  }

  return handlePortfolioTracking(userAddress, network, includePrices);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, network = "testnet", includePrices = false } = body;

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing required parameter: userAddress" },
        { status: 400 }
      );
    }

    return handlePortfolioTracking(userAddress, network, includePrices);
  } catch (error) {
    console.error('Error parsing POST body:', error);
    return NextResponse.json({ 
      error: 'Invalid request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

async function handlePortfolioTracking(userAddress: string, network: string, includePrices: boolean) {
  try {
    const validNetworks = ['mainnet', 'testnet', 'devnet'];
    if (!validNetworks.includes(network)) {
      return NextResponse.json({ 
        error: `Invalid network. Must be one of: ${validNetworks.join(', ')}` 
      }, { status: 400 });
    }

    const suiClient = suiClientFor(network);
    
    // Parallel fetch all portfolio data
    const [
      suiBalance,
      allCoins,
      ownedObjects,
      nftObjects
    ] = await Promise.all([
      // 1. Get SUI balance
      suiClient.getBalance({
        owner: userAddress,
        coinType: '0x2::sui::SUI'
      }),
      
      // 2. Get all coin types
      suiClient.getAllCoins({
        owner: userAddress
      }),
      
      // 3. Get all owned objects (including NFTs, other objects)
      suiClient.getOwnedObjects({
        owner: userAddress,
        options: {
          showContent: true,
          showDisplay: true,
          showType: true,
        }
      }),
      
      // 4. Get specific NFTs from our contract if package ID available
      NFT_PACKAGE_ID ? suiClient.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: `${NFT_PACKAGE_ID}::simple_nft::NFT`
        },
        options: {
          showContent: true,
          showDisplay: true,
          showType: true,
        }
      }) : Promise.resolve({ data: [] })
    ]);

    // Process SUI balance
    const suiBalanceInfo = {
      balance: suiBalance.totalBalance,
      balanceInSui: parseFloat(suiBalance.totalBalance) / 1_000_000_000,
      coinCount: suiBalance.coinObjectCount
    };

    // Process all coins (group by coin type)
    const coinsByType: Record<string, {
      coinType: string;
      totalBalance: string;
      balanceFormatted: number;
      coinCount: number;
      coins: Array<{
        coinObjectId: string;
        balance: string;
        balanceFormatted: number;
      }>;
    }> = {};

    for (const coin of allCoins.data) {
      if (!coinsByType[coin.coinType]) {
        coinsByType[coin.coinType] = {
          coinType: coin.coinType,
          totalBalance: '0',
          balanceFormatted: 0,
          coinCount: 0,
          coins: []
        };
      }
      
      const coinData = coinsByType[coin.coinType];
      coinData.coinCount++;
      coinData.coins.push({
        coinObjectId: coin.coinObjectId,
        balance: coin.balance,
        balanceFormatted: parseFloat(coin.balance) / 1_000_000_000 // Assuming 9 decimals for most Sui tokens
      });
      
      // Calculate total balance
      coinData.totalBalance = (BigInt(coinData.totalBalance) + BigInt(coin.balance)).toString();
      coinData.balanceFormatted = parseFloat(coinData.totalBalance) / 1_000_000_000;
    }

    // Process NFTs from our contract
    const myNfts = [];
    for (const object of nftObjects.data) {
      if (object.data?.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as Record<string, unknown>;
        
        const nftInfo = {
          id: object.data.objectId,
          name: fields.name || 'Unknown',
          description: fields.description || '',
          imageUrl: fields.image_url || '',
          creator: fields.creator || '',
          type: object.data.type,
          version: object.data.version,
          display: object.data.display || null
        };
        
        myNfts.push(nftInfo);
      }
    }

    // Process other objects (excluding coins and known NFTs)
    const otherObjects = [];
    for (const object of ownedObjects.data) {
      const objectType = object.data?.type || '';
      
      // Skip coins and our NFTs as they're already processed
      if (objectType.includes('::coin::Coin') || 
          (NFT_PACKAGE_ID && objectType.includes(`${NFT_PACKAGE_ID}::simple_nft::NFT`))) {
        continue;
      }
      
      otherObjects.push({
        id: object.data?.objectId,
        type: objectType,
        version: object.data?.version,
        hasPublicTransfer: object.data?.content ? ('hasPublicTransfer' in object.data.content ? object.data.content.hasPublicTransfer : false) : false,
        display: object.data?.display || null
      });
    }

    // Calculate portfolio summary
    const totalObjects = ownedObjects.data.length;
    const totalCoins = Object.keys(coinsByType).length;
    const totalNfts = myNfts.length;
    const totalOtherObjects = otherObjects.length;

    // Get current prices if requested (simplified version)
    let priceData = null;
    if (includePrices && network === 'mainnet') {
      try {
        // In a real implementation, you would fetch from CoinGecko or another price API
        // For now, just provide SUI price structure
        priceData = {
          sui: {
            usd: 1.85, // Placeholder - in real app, fetch from CoinGecko
            last_updated: new Date().toISOString()
          }
        };
      } catch (error) {
        console.warn('Failed to fetch price data:', error);
      }
    }

    // Calculate estimated USD value
    let estimatedUsdValue = 0;
    if (priceData && priceData.sui) {
      estimatedUsdValue = suiBalanceInfo.balanceInSui * priceData.sui.usd;
    }

    const portfolioData = {
      walletAddress: userAddress,
      network,
      summary: {
        totalObjects,
        totalCoins,
        totalNfts,
        totalOtherObjects,
        estimatedUsdValue: estimatedUsdValue > 0 ? estimatedUsdValue.toFixed(2) : null
      },
      suiBalance: suiBalanceInfo,
      coins: coinsByType,
      nfts: myNfts,
      otherObjects: otherObjects.slice(0, 10), // Limit to first 10 to avoid response being too large
      priceData,
      lastUpdated: new Date().toISOString(),
      packageIds: {
        nftPackageId: NFT_PACKAGE_ID,
        marketplaceId: NFT_MARKETPLACE_ID
      }
    };

    return NextResponse.json({
      success: true,
      data: portfolioData,
      message: `Portfolio tracking complete for ${network}. Found ${totalObjects} objects: ${totalCoins} coin types, ${totalNfts} NFTs, ${totalOtherObjects} other objects.`
    });

  } catch (error) {
    console.error('Error tracking portfolio:', error);
    return NextResponse.json({ 
      error: 'Failed to track portfolio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}