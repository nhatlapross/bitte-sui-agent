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
  const paymentAmount = searchParams.get('paymentAmount');
  const network = searchParams.get('network') || 'testnet';

  if (!userAddress || !nftId || !paymentAmount) {
    return NextResponse.json(
      { error: "Missing required parameters: userAddress, nftId, paymentAmount" },
      { status: 400 }
    );
  }

  const amount = parseFloat(paymentAmount);
  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Payment amount must be a positive number in SUI" },
      { status: 400 }
    );
  }

  return handleNFTPurchase(userAddress, nftId, amount, network);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, nftId, paymentAmount, network = "testnet" } = body;

    if (!userAddress || !nftId || !paymentAmount) {
      return NextResponse.json(
        { error: "Missing required parameters: userAddress, nftId, paymentAmount" },
        { status: 400 }
      );
    }

    const amount = typeof paymentAmount === 'string' ? parseFloat(paymentAmount) : paymentAmount;
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Payment amount must be a positive number in SUI" },
        { status: 400 }
      );
    }

    return handleNFTPurchase(userAddress, nftId, amount, network);
  } catch (error) {
    console.error('Error parsing POST body:', error);
    return NextResponse.json({ 
      error: 'Invalid request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

async function handleNFTPurchase(userAddress: string, nftId: string, paymentAmount: number, network: string) {
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

    // Convert payment amount to MIST (1 SUI = 10^9 MIST)
    const paymentInMist = BigInt(Math.ceil(paymentAmount * 1_000_000_000));

    // Create a coin for payment - Bitte will handle the actual coin selection
    const [paymentCoin] = tx.splitCoins(tx.gas, [paymentInMist]);

    tx.moveCall({
      target: `${NFT_PACKAGE_ID}::simple_nft::buy_nft`,
      arguments: [
        tx.object(NFT_MARKETPLACE_ID),
        tx.pure.id(nftId),
        paymentCoin
      ],
    });

    tx.setSender(userAddress);

    const transactionBytes = await tx.build({ client: suiClient });
    const suiTransactionBytes = Buffer.from(transactionBytes).toString('base64');

    const suiSignRequest = {
      transactionBytes: suiTransactionBytes,
      network,
      ownerAddress: userAddress,
      amountInSui: paymentAmount + 0.01 // Payment amount plus gas fee
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
        paymentAmountInSui: paymentAmount,
        paymentAmountInMist: paymentInMist.toString(),
        totalAmountRequired: paymentAmount + 0.01
      },
      message: `NFT ${nftId} will be purchased for ${paymentAmount} SUI on ${network}`
    });

  } catch (error) {
    console.error('Error creating buy NFT transaction:', error);
    return NextResponse.json({ 
      error: 'Failed to create buy NFT transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}