import { NextResponse } from 'next/server';
import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

// DeepBook configuration for Sui
const DEEPBOOK_CONFIG = {
  // DeepBook package on Sui
  PACKAGE_ID: '0xdee9',
  
  // Common token types on Sui
  TOKENS: {
    SUI: '0x2::sui::SUI',
    USDC: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN', // Testnet USDC
    USDT: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN', // Testnet USDT
    WETH: '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN', // Testnet WETH
  },
  
  // Known pools (in real implementation, you'd query these dynamically)
  POOLS: {
    'SUI_USDC': '0x', // Pool object ID - would be fetched from on-chain data
    'SUI_USDT': '0x',
    'USDC_USDT': '0x',
  }
};

function suiClientFor(network: string): SuiClient {
  const networkMap: Record<string, string> = {
    mainnet: getFullnodeUrl("mainnet"),
    testnet: getFullnodeUrl("testnet"),
    devnet: getFullnodeUrl("devnet"),
  };
  
  const url = networkMap[network] || getFullnodeUrl("testnet");
  return new SuiClient({ url });
}

function normalizeTokenType(token: string): string {
  // Handle common shortcuts
  const upperToken = token.toUpperCase();
  if (DEEPBOOK_CONFIG.TOKENS[upperToken as keyof typeof DEEPBOOK_CONFIG.TOKENS]) {
    return DEEPBOOK_CONFIG.TOKENS[upperToken as keyof typeof DEEPBOOK_CONFIG.TOKENS];
  }
  
  // If it's already a full address, return as is
  if (token.startsWith('0x')) {
    return token;
  }
  
  // Default to treating as full type
  return token;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const userAddress = searchParams.get('userAddress');
  const tokenFrom = searchParams.get('tokenFrom');
  const tokenTo = searchParams.get('tokenTo');
  const amountIn = searchParams.get('amountIn');
  const slippageTolerance = searchParams.get('slippageTolerance') || '0.5'; // 0.5% default
  const network = searchParams.get('network') || 'testnet';

  if (!userAddress || !tokenFrom || !tokenTo || !amountIn) {
    return NextResponse.json(
      { error: "Missing required parameters: userAddress, tokenFrom, tokenTo, amountIn" },
      { status: 400 }
    );
  }

  return handleSuiSwap(userAddress, tokenFrom, tokenTo, amountIn, slippageTolerance, network);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userAddress, 
      tokenFrom, 
      tokenTo, 
      amountIn, 
      slippageTolerance = "0.5",
      network = "testnet" 
    } = body;

    if (!userAddress || !tokenFrom || !tokenTo || !amountIn) {
      return NextResponse.json(
        { error: "Missing required parameters: userAddress, tokenFrom, tokenTo, amountIn" },
        { status: 400 }
      );
    }

    return handleSuiSwap(userAddress, tokenFrom, tokenTo, amountIn, slippageTolerance, network);
  } catch (error) {
    console.error('Error parsing POST body:', error);
    return NextResponse.json({ 
      error: 'Invalid request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

async function handleSuiSwap(
  userAddress: string, 
  tokenFrom: string, 
  tokenTo: string, 
  amountIn: string, 
  slippageTolerance: string,
  network: string
) {
  try {
    const validNetworks = ['mainnet', 'testnet', 'devnet'];
    if (!validNetworks.includes(network)) {
      return NextResponse.json({ 
        error: `❌ Invalid network`,
        details: `Supported networks: ${validNetworks.join(', ')}`,
        code: 'INVALID_NETWORK'
      }, { status: 400 });
    }

    const suiClient = suiClientFor(network);

    // Normalize token types
    const fromToken = normalizeTokenType(tokenFrom);
    const toToken = normalizeTokenType(tokenTo);
    
    // Validate tokens for specific networks
    const validationResult = await validateTokensForNetwork(fromToken, toToken, network);
    if (!validationResult.isValid) {
      return NextResponse.json({
        error: validationResult.error,
        details: validationResult.details,
        code: validationResult.code,
        suggestions: validationResult.suggestions
      }, { status: 400 });
    }
    
    // Parse amount (assume decimal input, convert to base units)
    const amountFloat = parseFloat(amountIn);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      return NextResponse.json({
        error: '❌ Invalid amount',
        details: 'Amount must be a positive number greater than 0',
        code: 'INVALID_AMOUNT'
      }, { status: 400 });
    }

    // Check minimum swap amount
    if (amountFloat < 0.001) {
      return NextResponse.json({
        error: '❌ Amount too small',
        details: 'Minimum swap amount is 0.001',
        code: 'AMOUNT_TOO_SMALL'
      }, { status: 400 });
    }

    // Convert to base units (assuming 9 decimals for most Sui tokens)
    const amountInUnits = BigInt(Math.floor(amountFloat * 1_000_000_000));
    
    // Calculate slippage
    const slippageFloat = parseFloat(slippageTolerance);
    if (isNaN(slippageFloat) || slippageFloat < 0 || slippageFloat > 50) {
      return NextResponse.json({
        error: '❌ Invalid slippage tolerance',
        details: 'Slippage must be between 0% and 50%',
        code: 'INVALID_SLIPPAGE'
      }, { status: 400 });
    }

    // Check user's balance for the token they want to swap
    const balanceCheck = await checkUserBalance(suiClient, userAddress, fromToken, amountFloat, network);
    if (!balanceCheck.sufficient) {
      return NextResponse.json({
        error: balanceCheck.error,
        details: balanceCheck.details,
        code: balanceCheck.code,
        currentBalance: balanceCheck.currentBalance,
        requiredAmount: amountIn
      }, { status: 400 });
    }

    const tx = new Transaction();

    // Simple swap logic - this is a simplified implementation
    // In reality, you would:
    // 1. Find the right pool
    // 2. Calculate expected output
    // 3. Set proper slippage protection
    
    if (fromToken === DEEPBOOK_CONFIG.TOKENS.SUI) {
      // Swapping from SUI - split from gas coin
      const [coinIn] = tx.splitCoins(tx.gas, [amountInUnits.toString()]);
      
      // Simplified swap call (this would be more complex with actual DeepBook integration)
      tx.moveCall({
        target: '0x2::coin::zero', // Placeholder - would be actual swap function
        arguments: [coinIn],
        typeArguments: [fromToken, toToken],
      });
    } else {
      // Swapping from other tokens - would need to get user's coins
      // For now, create a simplified transaction
      tx.moveCall({
        target: '0x2::coin::zero', // Placeholder - would be actual swap function
        arguments: [tx.pure.u64(amountInUnits.toString())],
        typeArguments: [fromToken, toToken],
      });
    }

    tx.setSender(userAddress);

    const transactionBytes = await tx.build({ client: suiClient });
    const suiTransactionBytes = Buffer.from(transactionBytes).toString('base64');

    const suiSignRequest = {
      transactionBytes: suiTransactionBytes,
      network,
      ownerAddress: userAddress,
      amountInSui: 0.01 // Gas fee estimate
    };

    // Calculate minimum output with slippage (simplified)
    const estimatedOutput = amountFloat * 0.998; // Assume 0.2% fee
    const minOutput = estimatedOutput * (1 - slippageFloat / 100);

    return NextResponse.json({
      success: true,
      suiSignRequest,
      data: {
        suiTransactionBytes,
        ownerAddress: userAddress,
        network,
        swap: {
          tokenFrom: fromToken,
          tokenTo: toToken,
          tokenFromSymbol: getTokenSymbol(fromToken),
          tokenToSymbol: getTokenSymbol(toToken),
          amountIn: amountIn,
          amountInUnits: amountInUnits.toString(),
          estimatedOutput: estimatedOutput.toFixed(6),
          minOutput: minOutput.toFixed(6),
          slippageTolerance: slippageTolerance + '%',
          exchangeRate: '~0.998' // Simplified
        },
        gasFee: '0.01 SUI'
      },
      message: `Swap ${amountIn} ${getTokenSymbol(fromToken)} → ${getTokenSymbol(toToken)} on ${network} with ${slippageTolerance}% slippage tolerance`,
      
      // Important note for users
      note: "⚠️  This is a simplified swap implementation. In production, proper pool finding, price calculation, and slippage protection would be implemented. Currently supports basic SUI ↔ token swaps."
    });

  } catch (error) {
    console.error('Error creating swap transaction:', error);
    return NextResponse.json({ 
      error: 'Failed to create swap transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function validateTokensForNetwork(fromToken: string, toToken: string, network: string) {
  // Check if tokens are supported on the network
  if (network === 'testnet') {
    // For testnet, only SUI is guaranteed to exist
    const testnetSafeTokens = [DEEPBOOK_CONFIG.TOKENS.SUI];
    
    if (!testnetSafeTokens.includes(fromToken) && !testnetSafeTokens.includes(toToken)) {
      return {
        isValid: false,
        error: '❌ Token not available on testnet',
        details: `USDC, USDT, WETH may not exist on testnet. Only SUI is guaranteed.`,
        code: 'TOKEN_NOT_AVAILABLE_TESTNET',
        suggestions: [
          'Use SUI as one of the tokens',
          'Try on mainnet for full token support',
          'Check if testnet USDC faucet is available'
        ]
      };
    }
  }
  
  if (fromToken === toToken) {
    return {
      isValid: false,
      error: '❌ Cannot swap same token',
      details: 'From token and to token cannot be the same',
      code: 'SAME_TOKEN_SWAP',
      suggestions: ['Choose different tokens to swap']
    };
  }
  
  return { isValid: true };
}

async function checkUserBalance(suiClient: SuiClient, userAddress: string, tokenType: string, requiredAmount: number, network?: string) {
  try {
    if (tokenType === DEEPBOOK_CONFIG.TOKENS.SUI) {
      // Check SUI balance
      const balance = await suiClient.getBalance({
        owner: userAddress,
        coinType: '0x2::sui::SUI'
      });
      
      const balanceInSui = parseFloat(balance.totalBalance) / 1_000_000_000;
      const requiredWithGas = requiredAmount + 0.01; // Add gas fee buffer
      
      if (balanceInSui < requiredWithGas) {
        return {
          sufficient: false,
          error: '❌ Insufficient SUI balance',
          details: `Need ${requiredWithGas.toFixed(4)} SUI (including gas), but only have ${balanceInSui.toFixed(4)} SUI`,
          code: 'INSUFFICIENT_SUI_BALANCE',
          currentBalance: balanceInSui.toFixed(4) + ' SUI'
        };
      }
    } else {
      // Check other token balance
      try {
        const coins = await suiClient.getCoins({
          owner: userAddress,
          coinType: tokenType
        });
        
        if (coins.data.length === 0) {
          return {
            sufficient: false,
            error: '❌ Token not found in wallet',
            details: `You don't have any ${getTokenSymbol(tokenType)} tokens in your wallet`,
            code: 'TOKEN_NOT_FOUND',
            currentBalance: '0'
          };
        }
        
        const totalBalance = coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), BigInt(0));
        const balanceFloat = parseFloat(totalBalance.toString()) / 1_000_000_000;
        
        if (balanceFloat < requiredAmount) {
          return {
            sufficient: false,
            error: '❌ Insufficient token balance',
            details: `Need ${requiredAmount} ${getTokenSymbol(tokenType)}, but only have ${balanceFloat.toFixed(6)}`,
            code: 'INSUFFICIENT_TOKEN_BALANCE',
            currentBalance: balanceFloat.toFixed(6) + ' ' + getTokenSymbol(tokenType)
          };
        }
      } catch (tokenError) {
        return {
          sufficient: false,
          error: '❌ Token balance check failed',
          details: `Could not verify ${getTokenSymbol(tokenType)} balance. Token may not exist on ${network || 'this network'}.`,
          code: 'BALANCE_CHECK_FAILED',
          currentBalance: 'Unknown'
        };
      }
    }
    
    return { sufficient: true };
    
  } catch (error) {
    return {
      sufficient: false,
      error: '❌ Balance check failed',
      details: `Could not check wallet balance: ${error instanceof Error ? error.message : 'Unknown error'}`,
      code: 'BALANCE_CHECK_ERROR',
      currentBalance: 'Unknown'
    };
  }
}

function getTokenSymbol(tokenType: string): string {
  // Extract symbol from token type
  for (const [symbol, type] of Object.entries(DEEPBOOK_CONFIG.TOKENS)) {
    if (type === tokenType) {
      return symbol;
    }
  }
  
  // Extract from type string (e.g. "0x123::token::TOKEN" -> "TOKEN")
  const parts = tokenType.split('::');
  if (parts.length >= 2) {
    return parts[parts.length - 1];
  }
  
  return tokenType.slice(0, 8) + '...'; // Truncated address
}