import { NextResponse } from 'next/server';
import { Transaction } from "@mysten/sui/transactions";
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
  const name = searchParams.get('name');
  const description = searchParams.get('description');
  const imageUrl = searchParams.get('imageUrl');
  const network = searchParams.get('network') || 'testnet';

  if (!userAddress || !name || !description || !imageUrl) {
    return NextResponse.json(
      { error: "Missing required parameters: userAddress, name, description, imageUrl" },
      { status: 400 }
    );
  }

  return handleNFTMinting(userAddress, name, description, imageUrl, network);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, name, description, imageUrl, network = "testnet" } = body;

    if (!userAddress || !name || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required parameters: userAddress, name, description, imageUrl" },
        { status: 400 }
      );
    }

    return handleNFTMinting(userAddress, name, description, imageUrl, network);
  } catch (error) {
    console.error('Error parsing POST body:', error);
    return NextResponse.json({ 
      error: 'Invalid request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

async function handleNFTMinting(userAddress: string, name: string, description: string, imageUrl: string, network: string) {
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
    const tx = new Transaction();

    // Convert strings to byte arrays for Move function
    const nameBytes = Array.from(new TextEncoder().encode(name));
    const descriptionBytes = Array.from(new TextEncoder().encode(description));
    const imageUrlBytes = Array.from(new TextEncoder().encode(imageUrl));

    tx.moveCall({
      target: `${NFT_PACKAGE_ID}::simple_nft::mint_and_transfer`,
      arguments: [
        tx.pure.vector('u8', nameBytes),
        tx.pure.vector('u8', descriptionBytes),
        tx.pure.vector('u8', imageUrlBytes)
      ],
    });

    tx.setSender(userAddress);

    const transactionBytes = await tx.build({ client: suiClient });
    const suiTransactionBytes = Buffer.from(transactionBytes).toString('base64');

    const suiSignRequest = {
      transactionBytes: suiTransactionBytes,
      network,
      ownerAddress: userAddress,
      amountInSui: 0.01 // Gas fee for minting
    };

    return NextResponse.json({
      success: true,
      suiSignRequest,
      data: {
        suiTransactionBytes,
        ownerAddress: userAddress,
        network,
        packageId: NFT_PACKAGE_ID,
        nftDetails: {
          name,
          description,
          imageUrl
        }
      },
      message: `NFT "${name}" will be minted and transferred to your wallet on ${network}`
    });

  } catch (error) {
    console.error('Error creating mint NFT transaction:', error);
    return NextResponse.json({ 
      error: 'Failed to create mint NFT transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}