import { NextResponse } from 'next/server';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { MIST_PER_SUI } from '@mysten/sui/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const network = searchParams.get('network') || 'devnet';

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  // Validate network
  const validNetworks = ['mainnet', 'testnet', 'devnet'];
  if (!validNetworks.includes(network)) {
    return NextResponse.json({ 
      error: `Invalid network. Must be one of: ${validNetworks.join(', ')}` 
    }, { status: 400 });
  }

  try {
    // Initialize Sui client for the specified network
    const suiClient = new SuiClient({ 
      url: getFullnodeUrl(network as 'mainnet' | 'testnet' | 'devnet') 
    });

    // Get SUI balance
    const suiBalance = await suiClient.getBalance({ owner: address });
    const suiAmount = Number.parseInt(suiBalance.totalBalance) / Number(MIST_PER_SUI);

    // Get all coin types
    const allCoins = await suiClient.getAllCoins({ owner: address });
    
    // Group coins by type
    const coinBalances: Record<string, { balance: string; count: number }> = {};
    
    for (const coin of allCoins.data) {
      const coinType = coin.coinType;
      if (!coinBalances[coinType]) {
        coinBalances[coinType] = { balance: '0', count: 0 };
      }
      coinBalances[coinType].balance = (
        BigInt(coinBalances[coinType].balance) + BigInt(coin.balance)
      ).toString();
      coinBalances[coinType].count += 1;
    }

    // Format coin balances for better readability
    const formattedBalances = Object.entries(coinBalances).map(([type, data]) => {
      const displayBalance = type === '0x2::sui::SUI' 
        ? (Number(data.balance) / Number(MIST_PER_SUI)).toFixed(6)
        : data.balance;
      
      return {
        coinType: type,
        balance: displayBalance,
        rawBalance: data.balance,
        count: data.count,
        symbol: type === '0x2::sui::SUI' ? 'SUI' : type.split('::').pop() || 'Unknown'
      };
    });

    return NextResponse.json({
      address,
      network,
      suiBalance: suiAmount.toFixed(6),
      totalCoins: allCoins.data.length,
      coinTypes: formattedBalances,
      hasNextPage: allCoins.hasNextPage
    });

  } catch (error) {
    console.error('Error fetching Sui balance:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch balance',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}