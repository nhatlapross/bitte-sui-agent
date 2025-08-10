import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipient = searchParams.get('recipient');
  const amount = searchParams.get('amount');
  const network = searchParams.get('network') || 'devnet';
  const transactionType = searchParams.get('type') || 'transfer';

  if (!recipient) {
    return NextResponse.json({ error: 'Recipient address is required' }, { status: 400 });
  }

  if (!amount) {
    return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
  }

  // Validate network
  const validNetworks = ['mainnet', 'testnet', 'devnet'];
  if (!validNetworks.includes(network)) {
    return NextResponse.json({ 
      error: `Invalid network. Must be one of: ${validNetworks.join(', ')}` 
    }, { status: 400 });
  }

  try {
    // Parse amount
    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      return NextResponse.json({ error: 'Invalid amount. Must be a positive number' }, { status: 400 });
    }

    // Convert to MIST (1 SUI = 10^9 MIST)
    const amountInMist = Math.floor(amountFloat * 1000000000);

    // Create Sui transaction request compatible with Bitte Protocol generate-sui-tx
    const suiSignRequest = {
      network: network,
      recipientAddress: recipient,
      senderAddress: recipient, // Will be overridden by actual sender
      amountInSui: amountFloat,
      type: transactionType,
      description: `${transactionType === 'transfer' ? 'Send' : 'Transfer'} ${amountFloat} SUI to ${recipient}`
    };

    return NextResponse.json({
      success: true,
      suiSignRequest,
      // Additional metadata
      recipient,
      amount: amountFloat,
      amountInMist: amountInMist.toString(),
      network,
      transactionType,
      message: `Sui ${transactionType} transaction created for ${amountFloat} SUI to ${recipient} on ${network}. Use 'generate-sui-tx' tool to execute.`,
      bitteInstruction: "After receiving this response, use the 'generate-sui-tx' tool with the suiSignRequest data to execute the transaction in the user's wallet.",
      note: "Using simplified transaction format compatible with Bitte Protocol"
    });

  } catch (error) {
    console.error('Error creating Sui transaction:', error);
    return NextResponse.json({ 
      error: 'Failed to create Sui transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}