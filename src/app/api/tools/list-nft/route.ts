import { NextResponse } from 'next/server';
import { Transaction } from "@mysten/sui/transactions";
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
  const nftId = searchParams.get('nftId');
  const price = searchParams.get('price');
  const network = searchParams.get('network') || 'testnet';

  if (!userAddress || !nftId || !price) {
    return NextResponse.json(
      { error: "Missing required parameters: userAddress, nftId, price" },
      { status: 400 }
    );
  }

  const priceNumber = parseInt(price);
  if (isNaN(priceNumber) || priceNumber <= 0) {
    return NextResponse.json(
      { error: "Price must be a positive number in SUI" },
      { status: 400 }
    );
  }

  return handleNFTListing(userAddress, nftId, priceNumber, network);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, nftId, price, network = "testnet" } = body;

    if (!userAddress || !nftId || !price) {
      return NextResponse.json(
        { error: "Missing required parameters: userAddress, nftId, price" },
        { status: 400 }
      );
    }

    const priceNumber = typeof price === 'string' ? parseInt(price) : price;
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number in SUI" },
        { status: 400 }
      );
    }

    return handleNFTListing(userAddress, nftId, priceNumber, network);
  } catch (error) {
    console.error('Error parsing POST body:', error);
    return NextResponse.json({ 
      error: 'Invalid request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

async function handleNFTListing(userAddress: string, nftId: string, price: number, network: string) {
  try {
    const validNetworks = ['mainnet', 'testnet', 'devnet'];
    if (!validNetworks.includes(network)) {
      return NextResponse.json({ 
        error: `Invalid network. Must be one of: ${validNetworks.join(', ')}` 
      }, { status: 400 });
    }

    if (!NFT_PACKAGE_ID || !NFT_MARKETPLACE_ID) {
      return NextResponse.json({
        error: 'NFT_PACKAGE_ID or NFT_MARKETPLACE_ID not configured in environment variables'
      }, { status: 500 });
    }

    const suiClient = suiClientFor(network);
    const tx = new Transaction();

    // Convert price to SUI MIST (1 SUI = 10^9 MIST)
    const priceInMist = BigInt(price * 1_000_000_000);

    tx.moveCall({
      target: `${NFT_PACKAGE_ID}::simple_nft::list_nft`,
      arguments: [
        tx.object(NFT_MARKETPLACE_ID),
        tx.object(nftId),
        tx.pure.u64(priceInMist.toString())
      ],
    });

    tx.setSender(userAddress);

    const transactionBytes = await tx.build({ client: suiClient });
    const suiTransactionBytes = Buffer.from(transactionBytes).toString('base64');

    const suiSignRequest = {
      transactionBytes: suiTransactionBytes,
      network,
      ownerAddress: userAddress,
      amountInSui: 0.005 // Gas fee for listing
    };

    return NextResponse.json({
      success: true,
      suiSignRequest,
      data: {
        suiTransactionBytes,
        ownerAddress: userAddress,
        network,
        packageId: NFT_PACKAGE_ID,
        marketplaceId: NFT_MARKETPLACE_ID,
        nftId,
        priceInSui: price,
        priceInMist: priceInMist.toString()
      },
      message: `NFT ${nftId} will be listed for ${price} SUI on ${network} marketplace`
    });

  } catch (error) {
    console.error('Error creating list NFT transaction:', error);
    return NextResponse.json({ 
      error: 'Failed to create list NFT transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}