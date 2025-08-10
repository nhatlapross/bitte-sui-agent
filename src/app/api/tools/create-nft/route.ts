import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const description = searchParams.get('description');
  const imageUrl = searchParams.get('imageUrl');
  const recipient = searchParams.get('recipient');
  const network = searchParams.get('network') || 'devnet';

  if (!name) {
    return NextResponse.json({ error: 'NFT name is required' }, { status: 400 });
  }

  if (!description) {
    return NextResponse.json({ error: 'NFT description is required' }, { status: 400 });
  }

  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
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

  try {
    // Try multiple approaches for NFT minting with generate-sui-tx

    // Approach 1: Try with moveCall format
    const suiSignRequest1 = {
      network: network,
      moveCall: {
        package: '0x2',
        module: network === 'devnet' ? 'devnet_nft' : 'nft', 
        function: 'mint',
        arguments: [name, description, imageUrl],
        typeArguments: []
      },
      recipientAddress: recipient,
      description: `Mint NFT "${name}" for ${recipient}`
    };

    // Approach 2: Try with programmable transaction format
    const suiSignRequest2 = {
      network: network,
      programmableTransaction: {
        inputs: [
          { type: 'pure', value: name },
          { type: 'pure', value: description }, 
          { type: 'pure', value: imageUrl }
        ],
        transactions: [
          {
            kind: 'MoveCall',
            target: `0x2::${network === 'devnet' ? 'devnet_nft' : 'nft'}::mint`,
            arguments: [
              { kind: 'Input', index: 0 },
              { kind: 'Input', index: 1 },
              { kind: 'Input', index: 2 }
            ]
          }
        ]
      },
      recipientAddress: recipient,
      description: `Mint NFT "${name}" for ${recipient}`
    };

    // Approach 3: Try with simple contract call format
    const suiSignRequest3 = {
      network: network,
      recipientAddress: recipient,
      contractCall: {
        packageId: '0x2',
        module: network === 'devnet' ? 'devnet_nft' : 'nft',
        function: 'mint',
        args: [name, description, imageUrl]
      },
      type: 'contract-call',
      description: `Mint NFT "${name}" for ${recipient}`
    };

    return NextResponse.json({
      success: true,
      // Try different formats - Bitte Protocol might accept one of these
      suiSignRequest: suiSignRequest1,
      alternativeFormats: {
        programmableTransaction: suiSignRequest2,
        contractCall: suiSignRequest3
      },
      nftDetails: { name, description, imageUrl, recipient },
      network,
      message: `NFT minting transaction created for "${name}" on ${network}. Trying moveCall format first.`,
      bitteInstruction: "After receiving this response, use the 'generate-sui-tx' tool with the suiSignRequest data to execute the transaction in the user's wallet.",
      debugInfo: {
        packageId: '0x2',
        module: network === 'devnet' ? 'devnet_nft' : 'nft',
        function: 'mint',
        arguments: [name, description, imageUrl],
        recipient: recipient
      }
    });

  } catch (error) {
    console.error('Error creating NFT minting transaction:', error);
    return NextResponse.json({ 
      error: 'Failed to create NFT minting transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}