import { NextResponse } from 'next/server';

interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  total_volume: number;
  circulating_supply: number;
}

const POPULAR_COINS = [
  'bitcoin', 'ethereum', 'near', 'binancecoin', 'cardano', 
  'solana', 'polygon-ecosystem-token', 'chainlink', 'avalanche-2', 'uniswap'
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coins = searchParams.get('coins') || POPULAR_COINS.join(',');
  const currency = searchParams.get('currency') || 'usd';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const coinIds = coins.split(',').slice(0, Math.min(limit, 50));
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h,7d`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinGeckoPrice[] = await response.json();

    const formattedData = data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      marketCap: coin.market_cap,
      rank: coin.market_cap_rank,
      change24h: coin.price_change_percentage_24h,
      change7d: coin.price_change_percentage_7d || null,
      volume24h: coin.total_volume,
      supply: coin.circulating_supply,
      currency: currency.toUpperCase()
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      timestamp: new Date().toISOString(),
      currency: currency.toUpperCase(),
      count: formattedData.length
    });

  } catch (error) {
    console.error('Crypto price fetch error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch cryptocurrency prices',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}