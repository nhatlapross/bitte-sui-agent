import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const objectId = searchParams.get('objectId');
  const recipient = searchParams.get('recipient');
  const network = searchParams.get('network') || 'devnet';

  if (!objectId) {
    return NextResponse.json({ error: 'NFT object ID is required' }, { status: 400 });
  }

  if (!recipient) {
    return NextResponse.json({ error: 'Recipient address is required' }, { status: 400 });
  }

  // Validate network
  const validNetworks = ['mainnet', 'testnet', 'devnet'];
  if (!validNetworks.includes(network)) {
    return NextResponse.json({ 
      error: `Invalid network. Must be one of: ${validNetworks.join(', ')}` 
    }, { status: 400 });
  }

  // Validate object ID format (basic check)
  if (!objectId.startsWith('0x') || objectId.length < 10) {
    return NextResponse.json({ 
      error: 'Invalid object ID format. Must be a valid Sui object ID starting with 0x' 
    }, { status: 400 });
  }

  // Validate recipient address format (basic check)
  if (!recipient.startsWith('0x') || recipient.length < 10) {
    return NextResponse.json({ 
      error: 'Invalid recipient address format. Must be a valid Sui address starting with 0x' 
    }, { status: 400 });
  }

  try {
    // Return error with guidance since NFT operations may not be supported
    return NextResponse.json({
      success: false,
      error: 'NFT transfer not supported by current Bitte Protocol integration',
      message: 'The generate-sui-tx tool currently only supports simple SUI transfers with (recipientAddress, senderAddress, amountInSui) format.',
      recommendation: 'Use create-sui-transaction for SUI transfers. NFT operations may require direct wallet integration.',
      supportedOperations: [
        'SUI token transfers via create-sui-transaction',
        'Balance checking via sui-balance'
      ],
      nftGuidance: 'For NFT operations, you may need to use a direct Sui wallet or wait for expanded Bitte Protocol support.',
      requestedOperation: {
        type: 'nft-transfer',
        objectId,
        recipient,
        network
      }
    }, { status: 501 }); // 501 Not Implemented

  } catch (error) {
    console.error('Error creating NFT transfer transaction:', error);
    return NextResponse.json({ 
      error: 'Failed to create NFT transfer transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}