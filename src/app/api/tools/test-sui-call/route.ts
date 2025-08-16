import { NextResponse } from 'next/server';

const NFT_PACKAGE_ID = process.env.NFT_PACKAGE_ID;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const network = searchParams.get('network') || 'testnet';

  if (!NFT_PACKAGE_ID) {
    return NextResponse.json({ error: 'NFT_PACKAGE_ID not set in environment' }, { status: 500 });
  }

  try {
    // Test with the simplest possible function call first
    const suiSignRequest = {
      network: network,
      moveCall: {
        package: NFT_PACKAGE_ID,
        module: 'marketplace',
        function: 'get_collection_info', // This is a view function, should be simpler
        arguments: [],
        typeArguments: []
      },
      description: 'Test function call to verify package and format'
    };

    return NextResponse.json({
      success: true,
      suiSignRequest,
      debug: {
        packageId: NFT_PACKAGE_ID,
        network: network,
        module: 'marketplace'
      },
      message: `Test transaction created on ${network}. Use 'generate-sui-tx' tool to execute.`,
      bitteInstruction: "Test call to verify our package and format work correctly"
    });

  } catch (error) {
    console.error('Error creating test transaction:', error);
    return NextResponse.json({ 
      error: 'Failed to create test transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}