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
  const network = searchParams.get('network') || 'testnet';

  // Validate required fields
  if (!userAddress) {
    return NextResponse.json(
      { error: "User address is required" },
      { status: 400 }
    );
  }

  return handleKioskCreation(userAddress, network);
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { userAddress, network = "testnet" } = body;

    // Validate required fields
    if (!userAddress) {
      return NextResponse.json(
        { error: "User address is required" },
        { status: 400 }
      );
    }

    return handleKioskCreation(userAddress, network);
  } catch (error) {
    console.error('Error parsing POST body:', error);
    return NextResponse.json({ 
      error: 'Invalid request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

async function handleKioskCreation(userAddress: string, network: string) {
  try {
    // Validate network
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

    // Get SUI client for the specified network
    const suiClient = suiClientFor(network);

    // Create transaction
    const tx = new Transaction();

    // Add moveCall for creating kiosk
    tx.moveCall({
      target: `${NFT_PACKAGE_ID}::marketplace::create_and_share_kiosk`,
      arguments: [],
    });

    // Set sender
    tx.setSender(userAddress);

    // Build transaction bytes
    const transactionBytes = await tx.build({ client: suiClient });

    // Convert to base64 for client-side execution
    const suiTransactionBytes = Buffer.from(transactionBytes).toString('base64');

    // Create suiSignRequest for Bitte Protocol
    const suiSignRequest = {
      transactionBytes: suiTransactionBytes,
      network,
      ownerAddress: userAddress,
      amountInSui: 0.001 // Small amount for gas fee validation
    };

    return NextResponse.json({
      success: true,
      suiSignRequest,
      data: {
        suiTransactionBytes,
        ownerAddress: userAddress,
        network,
        packageId: NFT_PACKAGE_ID,
        transactionSize: transactionBytes.length,
      },
      message: `Kiosk creation transaction created successfully on ${network}`
    });

  } catch (error) {
    console.error('Error creating kiosk transaction:', error);
    return NextResponse.json({ 
      error: 'Failed to create kiosk transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}