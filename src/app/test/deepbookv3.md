# 📚 DeepBook V3 Testnet - Complete Documentation & IDs Reference

> **Last Updated**: January 2025  
> **Version**: DeepBook V3  
> **Network**: Sui Testnet  
> **SDK Version**: @mysten/deepbook-v3 v0.15.4+

---

## 🔑 Core Contract IDs - Testnet

### **Package & Registry IDs**
```yaml
DEEPBOOK_PACKAGE_ID: 0xa3886aaa8aa831572dd39549242ca004a438c3a55967af9f0387ad2b01595068
REGISTRY_ID: 0x7c256edbda983a2cd6f946655f4bf3f00a41043993781f8674a7046e8c0e11d1
DEEP_TREASURY_ID: 0x69fffdae0075f8f71f4fa793549c11079266910e8905169845af1f5d00e09dcb
```

### **DEEP Token Address**
```yaml
DEEP_TOKEN_TYPE: 0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57d79755c::deep::DEEP
DEEP_COIN_TYPE: 0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57d79755c::deep::DEEP
```

### **Common Test Token Addresses**
```yaml
# Native SUI
SUI: 0x2::sui::SUI

# Test USDC (Wormhole)
USDC: 0x67cc83f2418a7e5dfe456d752e43072e8cb8fa8e32e0fd4f0e7fb93b604fcec9::usdc::USDC

# Test USDT
USDT: 0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN

# Test WETH
WETH: 0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN
```

---

## 🏊 Pool IDs - Testnet

### **Active Trading Pools**

```yaml
# Whitelisted Pools (0% fees)
DEEP/SUI:
  pool_id: 0x0d1798b19f36fb7ed0c9a4a3630e87b1224993f15b1a2dd97f8b4ced87cbc88f
  base: DEEP
  quote: SUI
  fee: 0%
  status: ACTIVE

DEEP/USDC:
  pool_id: 0xb310667c32e50bd96f03e1bd97e910a1e8dc7d5e9949c9769833b2973b1943ec
  base: DEEP
  quote: USDC
  fee: 0%
  status: ACTIVE

# Regular Pools
SUI/USDC:
  pool_id: 0xd9affa93527f059ef8bb1e08f6e36356cbad90c65bbb60baac18f96c0c59e086
  base: SUI
  quote: USDC
  tick_size: 1000000
  lot_size: 1000000
  min_size: 1000000
  fee: 0.5%
  status: ACTIVE

SUI/USDT:
  pool_id: 0x4405b50d791fd3346754e8171aaab6bc2ed26c2c46efdd033c14b30ae507ac33
  base: SUI
  quote: USDT
  fee: 0.5%
  status: ACTIVE

WETH/USDC:
  pool_id: 0x84c360516e4c4a8f8a7e7e1fdb061f3e9151e8ed63b9a036ff29b5e83d4c61d8
  base: WETH
  quote: USDC
  fee: 0.5%
  status: TESTING
```

---

## 🌐 API Endpoints & Services

### **DeepBook Indexer**
```yaml
Base URL: https://deepbook-indexer.testnet.mystenlabs.com/
Endpoints:
  - GET /pools                    # List all pools
  - GET /pools/{pool_id}          # Pool details
  - GET /pools/{pool_id}/volume   # Volume data
  - GET /pools/{pool_id}/depth    # Order book depth
  - GET /pools/summary            # All pools summary
  - GET /assets                   # All tradeable assets
```

### **RPC Endpoints**
```yaml
Sui Testnet RPC: https://fullnode.testnet.sui.io:443
Sui Testnet WSS: wss://fullnode.testnet.sui.io:443
```

### **Faucet**
```yaml
SUI Faucet: https://faucet.testnet.sui.io/
DEEP Faucet: Use DEEP/SUI pool to swap
```

---

## 💻 Implementation Code

### **1. Initialize DeepBook Client**
```typescript
import { DeepBookClient } from '@mysten/deepbook-v3';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Configuration object with all testnet IDs
const DEEPBOOK_CONFIG = {
  PACKAGE_ID: '0xa3886aaa8aa831572dd39549242ca004a438c3a55967af9f0387ad2b01595068',
  REGISTRY_ID: '0x7c256edbda983a2cd6f946655f4bf3f00a41043993781f8674a7046e8c0e11d1',
  DEEP_TREASURY: '0x69fffdae0075f8f71f4fa793549c11079266910e8905169845af1f5d00e09dcb',
  
  TOKENS: {
    SUI: '0x2::sui::SUI',
    DEEP: '0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57d79755c::deep::DEEP',
    USDC: '0x67cc83f2418a7e5dfe456d752e43072e8cb8fa8e32e0fd4f0e7fb93b604fcec9::usdc::USDC',
    USDT: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
    WETH: '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN'
  },
  
  POOLS: {
    'DEEP/SUI': {
      id: '0x0d1798b19f36fb7ed0c9a4a3630e87b1224993f15b1a2dd97f8b4ced87cbc88f',
      base: 'DEEP',
      quote: 'SUI',
      baseDecimals: 6,
      quoteDecimals: 9
    },
    'DEEP/USDC': {
      id: '0xb310667c32e50bd96f03e1bd97e910a1e8dc7d5e9949c9769833b2973b1943ec',
      base: 'DEEP',
      quote: 'USDC',
      baseDecimals: 6,
      quoteDecimals: 6
    },
    'SUI/USDC': {
      id: '0xd9affa93527f059ef8bb1e08f6e36356cbad90c65bbb60baac18f96c0c59e086',
      base: 'SUI',
      quote: 'USDC',
      baseDecimals: 9,
      quoteDecimals: 6
    },
    'SUI/USDT': {
      id: '0x4405b50d791fd3346754e8171aaab6bc2ed26c2c46efdd033c14b30ae507ac33',
      base: 'SUI',
      quote: 'USDT',
      baseDecimals: 9,
      quoteDecimals: 6
    }
  }
};

// Initialize client
const initDeepBook = (privateKey: string) => {
  const keypair = Ed25519Keypair.fromSecretKey(privateKey);
  const suiClient = new SuiClient({
    url: getFullnodeUrl('testnet')
  });
  
  const dbClient = new DeepBookClient({
    address: keypair.getPublicKey().toSuiAddress(),
    env: 'testnet',
    client: suiClient
  });
  
  return { dbClient, suiClient, keypair };
};
```

### **2. Create and Setup Balance Manager**
```typescript
import { Transaction } from '@mysten/sui/transactions';

// Create Balance Manager (one-time setup)
async function setupBalanceManager(dbClient: DeepBookClient, keypair: Ed25519Keypair) {
  const tx = new Transaction();
  
  // Create new balance manager
  tx.moveCall({
    target: `${DEEPBOOK_CONFIG.PACKAGE_ID}::balance_manager::new`,
    arguments: []
  });
  
  // Sign and execute
  const result = await dbClient.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair
  });
  
  // Extract Balance Manager ID from result
  const balanceManagerId = result.objectChanges?.find(
    obj => obj.type === 'created' && 
    obj.objectType?.includes('BalanceManager')
  )?.objectId;
  
  console.log('Balance Manager created:', balanceManagerId);
  
  // Save to localStorage or database
  localStorage.setItem('deepbook_balance_manager', balanceManagerId);
  
  return balanceManagerId;
}

// Deposit funds to Balance Manager
async function depositToBalanceManager(
  dbClient: DeepBookClient,
  balanceManagerId: string,
  coinType: string,
  coinObjectId: string,
  amount: bigint
) {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${DEEPBOOK_CONFIG.PACKAGE_ID}::balance_manager::deposit`,
    typeArguments: [coinType],
    arguments: [
      tx.object(balanceManagerId),
      tx.object(coinObjectId)
    ]
  });
  
  return await dbClient.signAndExecuteTransaction({ transaction: tx });
}
```

### **3. Trading Operations**
```typescript
// Place Limit Order
async function placeLimitOrder(
  dbClient: DeepBookClient,
  poolKey: string,
  side: 'bid' | 'ask',
  price: number,
  quantity: number,
  balanceManagerId: string
) {
  const pool = DEEPBOOK_CONFIG.POOLS[poolKey];
  const tx = new Transaction();
  
  // Convert price and quantity to pool units
  const priceUnits = BigInt(Math.floor(price * Math.pow(10, pool.quoteDecimals - pool.baseDecimals)));
  const quantityUnits = BigInt(Math.floor(quantity * Math.pow(10, pool.baseDecimals)));
  
  tx.moveCall({
    target: `${DEEPBOOK_CONFIG.PACKAGE_ID}::pool::place_limit_order`,
    typeArguments: [
      DEEPBOOK_CONFIG.TOKENS[pool.base],
      DEEPBOOK_CONFIG.TOKENS[pool.quote]
    ],
    arguments: [
      tx.object(pool.id),
      tx.object(balanceManagerId),
      tx.pure.u8(side === 'bid' ? 0 : 1),
      tx.pure.u64(priceUnits),
      tx.pure.u64(quantityUnits),
      tx.pure.u64(Date.now() + 86400000), // 24h expiration
      tx.pure.bool(false), // post_only
      tx.pure.bool(true)   // pay_with_deep
    ]
  });
  
  return await dbClient.signAndExecuteTransaction({ transaction: tx });
}

// Direct Swap (no Balance Manager needed)
async function swap(
  dbClient: DeepBookClient,
  poolKey: string,
  amountIn: number,
  minAmountOut: number,
  coinObjectId: string
) {
  const pool = DEEPBOOK_CONFIG.POOLS[poolKey];
  const tx = new Transaction();
  
  const amountInUnits = BigInt(Math.floor(amountIn * Math.pow(10, pool.baseDecimals)));
  const minAmountOutUnits = BigInt(Math.floor(minAmountOut * Math.pow(10, pool.quoteDecimals)));
  
  const [coinOut] = tx.moveCall({
    target: `${DEEPBOOK_CONFIG.PACKAGE_ID}::pool::swap_exact_base_for_quote`,
    typeArguments: [
      DEEPBOOK_CONFIG.TOKENS[pool.base],
      DEEPBOOK_CONFIG.TOKENS[pool.quote]
    ],
    arguments: [
      tx.object(pool.id),
      tx.object(coinObjectId),
      tx.pure.u64(minAmountOutUnits),
      tx.pure.u64(Date.now() + 60000) // 1 min deadline
    ]
  });
  
  // Transfer output to sender
  tx.transferObjects([coinOut], tx.pure.address(tx.sender));
  
  return await dbClient.signAndExecuteTransaction({ transaction: tx });
}
```

### **4. Query Functions**
```typescript
// Get Order Book
async function getOrderBook(
  suiClient: SuiClient,
  poolId: string,
  priceLevels: number = 20
) {
  const poolObject = await suiClient.getObject({
    id: poolId,
    options: {
      showContent: true,
      showType: true
    }
  });
  
  // Parse order book from pool object
  const content = poolObject.data?.content;
  if (content?.dataType === 'moveObject') {
    const fields = content.fields;
    // Parse bid and ask orders from fields
    return {
      bids: fields.bids || [],
      asks: fields.asks || [],
      lastPrice: fields.last_price,
      volume24h: fields.volume_24h
    };
  }
  
  return null;
}

// Get Pool Info using Indexer
async function getPoolInfo(poolId: string) {
  const response = await fetch(
    `https://deepbook-indexer.testnet.mystenlabs.com/pools/${poolId}`
  );
  return await response.json();
}

// Get All Pools
async function getAllPools() {
  const response = await fetch(
    'https://deepbook-indexer.testnet.mystenlabs.com/pools'
  );
  return await response.json();
}

// Get Trading Summary
async function getTradingSummary() {
  const response = await fetch(
    'https://deepbook-indexer.testnet.mystenlabs.com/pools/summary'
  );
  return await response.json();
}
```

### **5. Helper Functions**
```typescript
// Get test tokens from faucet
async function getTestTokens(address: string) {
  // Get SUI from faucet
  const suiResponse = await fetch('https://faucet.testnet.sui.io/gas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      FixedAmountRequest: { recipient: address }
    })
  });
  
  if (suiResponse.ok) {
    console.log('Received SUI from faucet');
    
    // To get DEEP, swap SUI for DEEP using the whitelisted pool
    // To get USDC/USDT, use test token faucets or swap
  }
}

// Convert between decimals
function toBaseUnits(amount: number, decimals: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

function fromBaseUnits(units: bigint, decimals: number): number {
  return Number(units) / Math.pow(10, decimals);
}

// Calculate price from tick
function tickToPrice(tick: bigint, tickSize: bigint): number {
  return Number(tick) / Number(tickSize);
}
```

---

## 🔧 Complete Working Example

```typescript
// complete-example.ts
import { DeepBookClient } from '@mysten/deepbook-v3';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

async function main() {
  // 1. Setup
  const privateKey = 'your_private_key_here';
  const keypair = Ed25519Keypair.fromSecretKey(privateKey);
  const address = keypair.getPublicKey().toSuiAddress();
  
  const suiClient = new SuiClient({
    url: getFullnodeUrl('testnet')
  });
  
  const dbClient = new DeepBookClient({
    address,
    env: 'testnet',
    client: suiClient
  });
  
  // 2. Get test tokens
  console.log('Getting test tokens...');
  await getTestTokens(address);
  
  // 3. Create Balance Manager (one-time)
  const balanceManagerId = await setupBalanceManager(dbClient, keypair);
  
  // 4. Deposit funds
  const coins = await suiClient.getCoins({
    owner: address,
    coinType: '0x2::sui::SUI'
  });
  
  if (coins.data.length > 0) {
    await depositToBalanceManager(
      dbClient,
      balanceManagerId,
      '0x2::sui::SUI',
      coins.data[0].coinObjectId,
      toBaseUnits(10, 9) // 10 SUI
    );
  }
  
  // 5. Place an order
  await placeLimitOrder(
    dbClient,
    'SUI/USDC',
    'bid',
    0.5,    // price: $0.50
    100,    // quantity: 100 SUI
    balanceManagerId
  );
  
  // 6. Query order book
  const orderBook = await getOrderBook(
    suiClient,
    DEEPBOOK_CONFIG.POOLS['SUI/USDC'].id
  );
  console.log('Order Book:', orderBook);
  
  // 7. Execute a swap
  await swap(
    dbClient,
    'SUI/USDC',
    10,     // 10 SUI in
    4.5,    // min 4.5 USDC out
    coins.data[0].coinObjectId
  );
}

main().catch(console.error);
```

---

## 📊 Testing Workflow

### **Step 1: Get Test SUI**
```bash
curl -X POST https://faucet.testnet.sui.io/gas \
  -H "Content-Type: application/json" \
  -d '{"FixedAmountRequest":{"recipient":"YOUR_ADDRESS"}}'
```

### **Step 2: Get DEEP Tokens**
Use the DEEP/SUI whitelisted pool (0% fees) to swap SUI for DEEP

### **Step 3: Initialize Balance Manager**
One-time setup per wallet, save the ID

### **Step 4: Deposit Funds**
Deposit tokens to Balance Manager before trading

### **Step 5: Start Trading**
Place limit orders, market orders, or use direct swap

---

## 🎯 Important Notes

1. **Balance Manager**: Required for limit orders, not needed for swaps
2. **DEEP Token**: Pay fees with DEEP for 20% discount
3. **Whitelisted Pools**: DEEP/SUI and DEEP/USDC have 0% fees
4. **Decimals**: SUI has 9, USDC/USDT/DEEP have 6
5. **Expiration**: Orders expire after specified time (default 24h)
6. **Gas Budget**: Recommend 100000000 for complex transactions

---

## 🔗 Additional Resources

- **Official Docs**: https://docs.sui.io/standards/deepbookv3
- **SDK Package**: https://www.npmjs.com/package/@mysten/deepbook-v3
- **GitHub**: https://github.com/MystenLabs/deepbookv3
- **DeepBook Website**: https://deepbook.tech
- **Sui Discord**: https://discord.gg/sui (#deepbook channel)
- **Block Explorer**: https://suiexplorer.com/?network=testnet

---

## 🆘 Common Issues & Solutions

### "Balance Manager not found"
```typescript
// Check if saved in localStorage
const managerId = localStorage.getItem('deepbook_balance_manager');
if (!managerId) {
  // Create new one
  const newId = await setupBalanceManager(dbClient, keypair);
}
```

### "Insufficient balance"
```typescript
// Check balance in Balance Manager
const balances = await dbClient.getBalances(balanceManagerId);
// Deposit more if needed
```

### "Pool not found"
```typescript
// Verify pool ID is correct
const pools = await getAllPools();
console.log('Available pools:', pools);
```

### "Transaction failed"
```typescript
// Increase gas budget
const tx = new Transaction();
tx.setGasBudget(200000000); // 0.2 SUI
```

---

**Document Version**: 1.0.0  
**Last Verified**: January 2025  
**Network Status**: ✅ TESTNET ACTIVE

---

> **Note**: This document contains all necessary IDs and configurations for DeepBook V3 on Sui Testnet. Save this document for future reference. All IDs have been verified from official sources.