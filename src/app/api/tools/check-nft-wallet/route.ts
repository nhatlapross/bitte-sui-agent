import { NextResponse } from 'next/server';
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const NFT_PACKAGE_ID = process.env.NFT_PACKAGE_ID;

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

  if (!userAddress) {
    return NextResponse.json(
      { error: "Missing required parameter: userAddress" },
      { status: 400 }
    );
  }

  return handleNFTWalletCheck(userAddress, network);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, network = "testnet" } = body;

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing required parameter: userAddress" },
        { status: 400 }
      );
    }

    return handleNFTWalletCheck(userAddress, network);
  } catch (error) {
    console.error('Error parsing POST body:', error);
    return NextResponse.json({ 
      error: 'Invalid request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

async function handleNFTWalletCheck(userAddress: string, network: string) {
  try {
    const validNetworks = ['mainnet', 'testnet', 'devnet'];
    if (!validNetworks.includes(network)) {
      return NextResponse.json({ 
        error: `Invalid network. Must be one of: ${validNetworks.join(', ')}` 
      }, { status: 400 });
    }

    if (!NFT_PACKAGE_ID) {
      return NextResponse.json({
        error: 'NFT_PACKAGE_ID not configured in environment variables'
      }, { status: 500 });
    }

    const suiClient = suiClientFor(network);

    // Get all objects owned by the user
    const ownedObjects = await suiClient.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: `${NFT_PACKAGE_ID}::simple_nft::NFT`
      },
      options: {
        showContent: true,
        showDisplay: true,
        showType: true,
      }
    });

    const nfts = [];
    
    for (const object of ownedObjects.data) {
      if (object.data?.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as Record<string, unknown>;
        
        // Extract NFT information from the fields
        const nftInfo = {
          id: object.data.objectId,
          name: fields.name || 'Unknown',
          description: fields.description || '',
          imageUrl: fields.image_url || '',
          creator: fields.creator || '',
          type: object.data.type,
          version: object.data.version,
        };
        
        nfts.push(nftInfo);
      }
    }

    // Get SUI balance for additional wallet info
    const suiBalance = await suiClient.getBalance({
      owner: userAddress,
      coinType: '0x2::sui::SUI'
    });

    const balanceInSui = parseFloat(suiBalance.totalBalance) / 1_000_000_000;

    return NextResponse.json({
      success: true,
      data: {
        walletAddress: userAddress,
        network,
        nfts: nfts,
        nftCount: nfts.length,
        suiBalance: {
          totalBalance: suiBalance.totalBalance,
          balanceInSui: balanceInSui.toFixed(4),
          coinCount: suiBalance.coinObjectCount
        },
        packageId: NFT_PACKAGE_ID
      },
      message: `Found ${nfts.length} NFT(s) in wallet on ${network}`
    });

  } catch (error) {
    console.error('Error checking NFT wallet:', error);
    return NextResponse.json({ 
      error: 'Failed to check NFT wallet',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}