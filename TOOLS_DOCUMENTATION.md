# 🛠️ Miko Agent Tools Documentation

Comprehensive documentation and chat examples for all available tools in Miko Agent.

## 📋 Tools List

1. [Blockchain Information](#1-blockchain-information)
2. [User Information](#2-user-information) 
3. [Twitter Integration](#3-twitter-integration)
4. [NEAR Transaction](#4-near-transaction)
5. [EVM Transaction](#5-evm-transaction)
6. [Ethereum Message Signing](#6-ethereum-message-signing)
7. [Sui Balance Check](#7-sui-balance-check)
8. [Sui Transaction](#8-sui-transaction)
9. [Sui NFT Creation](#9-sui-nft-creation)
10. [Sui NFT Transfer](#10-sui-nft-transfer)
11. [Cryptocurrency Prices](#11-cryptocurrency-prices)
12. [Coin Flip](#12-coin-flip)

---

## 1. Blockchain Information

**Endpoint:** `/api/tools/get-blockchains`  
**Purpose:** Returns a randomized list of 3 blockchain networks

### 💬 Chat Examples:

**User:** "Tell me about some blockchain networks"

**Agent Response:**
```
Here are 3 popular blockchain networks:

🔗 **Ethereum** - The leading smart contract platform with extensive DeFi ecosystem
🔗 **Polygon** - Layer 2 scaling solution for Ethereum with low fees
🔗 **Binance Smart Chain** - High-performance blockchain for DeFi and gaming
```

**User:** "What blockchains do you know about?"

**Agent Response:**
```
I can share information about various blockchain networks. Here are 3 randomly selected ones:

• **Solana** - High-speed blockchain known for fast transactions
• **Cardano** - Research-driven blockchain with proof-of-stake consensus  
• **Avalanche** - Scalable blockchain platform for DeFi applications
```

---

## 2. User Information

**Endpoint:** `/api/tools/get-user`  
**Purpose:** Returns user account information (NEAR account ID and EVM address)

### 💬 Chat Examples:

**User:** "What's my account information?"

**Agent Response:**
```
👤 **Your Account Information:**

🆔 **NEAR Account:** your-account.near
🔐 **EVM Address:** 0x1234...5678

You can use these addresses for blockchain transactions and interactions.
```

**User:** "Show me my wallet addresses"

**Agent Response:**
```
📱 **Your Wallet Addresses:**

**NEAR Protocol:** your-account.near
**Ethereum/EVM:** 0xabcd...ef12

These are your authenticated addresses for this session.
```

---

## 3. Twitter Integration

**Endpoint:** `/api/tools/twitter`  
**Purpose:** Generate Twitter share intent URLs

### 💬 Chat Examples:

**User:** "Help me share 'Just used Bitte AI!' on Twitter"

**Agent Response:**
```
🐦 **Twitter Share Ready!**

Click here to share: https://twitter.com/intent/tweet?text=Just%20used%20Bitte%20AI%21

This will open Twitter with your message pre-filled.
```

**User:** "Create a tweet about DeFi with hashtags"

**Agent Response:**
```
🚀 **Tweet Created!**

Share this: https://twitter.com/intent/tweet?text=Exploring%20DeFi%20opportunities&hashtags=DeFi,Crypto,Blockchain

Your tweet includes #DeFi #Crypto #Blockchain hashtags.
```

**User:** "Tweet this with a link: 'Check out this awesome dApp' and include bitte.ai"

**Agent Response:**
```
📱 **Tweet Link Ready!**

https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20dApp&url=https%3A//bitte.ai

This will share your message with the bitte.ai link included.
```

---

## 4. NEAR Transaction

**Endpoint:** `/api/tools/create-near-transaction`  
**Purpose:** Create payload for NEAR token transfers

### 💬 Chat Examples:

**User:** "Send 5 NEAR to alice.near"

**Agent Response:**
```
💸 **NEAR Transaction Created**

**Transaction Details:**
• **To:** alice.near  
• **Amount:** 5 NEAR
• **In yoctoNEAR:** 5000000000000000000000000

🔄 Processing transaction through your wallet...

✅ **Transaction submitted!** Please check your wallet to confirm the transfer.
```

**User:** "Transfer 0.1 NEAR to bob.testnet"

**Agent Response:**
```
📤 **NEAR Transfer Initiated**

**Sending:** 0.1 NEAR → bob.testnet
**Amount in yoctoNEAR:** 100000000000000000000000

⚡ Transaction payload generated and sent to your wallet for signing.
```

---

## 5. EVM Transaction

**Endpoint:** `/api/tools/create-evm-transaction`  
**Purpose:** Create payload for ETH transfers on EVM chains

### 💬 Chat Examples:

**User:** "Send 0.01 ETH to 0x1234567890123456789012345678901234567890"

**Agent Response:**
```
🔷 **ETH Transaction Created**

**Transaction Details:**
• **To:** 0x1234...7890
• **Amount:** 0.01 ETH  
• **Value:** 10000000000000000 wei

🔄 Sending to your wallet for confirmation...

✅ **Transaction ready for signing!** Please approve in your wallet.
```

**User:** "Transfer 0.5 ETH to my friend's address 0xabcd...ef12"

**Agent Response:**
```
💎 **ETH Transfer Initiated**

**Transferring:** 0.5 ETH → 0xabcd...ef12
**Gas will be estimated automatically**

⚡ Transaction sent to your connected wallet. Please confirm to complete the transfer.
```

---

## 6. Ethereum Message Signing

**Endpoint:** `/api/tools/eth-sign-request`  
**Purpose:** Create message signing requests on Ethereum

### 💬 Chat Examples:

**User:** "Sign this message: 'Hello Bitte AI' using personal_sign"

**Agent Response:**
```
✍️ **Message Signing Request**

**Message:** "Hello Bitte AI"
**Method:** personal_sign
**Chain:** Ethereum (1)

🔐 Please check your wallet to sign this message.

✅ **Signature request sent to wallet!**
```

**User:** "I need to sign a typed data message for a dApp"

**Agent Response:**
```
📝 **Typed Data Signing**

**Method:** eth_signTypedData_v4
**Chain ID:** 1 (Ethereum Mainnet)

⚠️ Please provide the typed data structure for signing.

🔒 This will create a structured signature request for your wallet.
```

---

## 7. Sui Balance Check

**Endpoint:** `/api/tools/sui-balance`  
**Purpose:** Check SUI balance and other coin types

### 💬 Chat Examples:

**User:** "Check my SUI balance for address 0x123...456"

**Agent Response:**
```
💰 **SUI Balance Information**

**Address:** 0x123...456
**Network:** devnet

**💎 SUI Balance:** 10.5 SUI
**🪙 Total Coin Types:** 3
**📊 Total Coins:** 25

**Other Tokens:**
• 0x2::sui::SUI: 10.5 SUI
• Custom Token A: 100.0 tokens  
• Custom Token B: 50.0 tokens
```

**User:** "What's my Sui mainnet balance?"

**Agent Response:**
```
🔍 **Sui Mainnet Balance**

**Address:** 0xabc...def
**Network:** mainnet

**💎 SUI:** 25.75 SUI
**🏦 Portfolio Value:** ~$32.19 USD
**📈 Total Assets:** 4 different tokens

Your account is active with multiple token holdings.
```

---

## 8. Sui Transaction

**Endpoint:** `/api/tools/create-sui-transaction`  
**Purpose:** Create transaction payload for SUI transfers

### 💬 Chat Examples:

**User:** "Send 5 SUI to 0x789...012"

**Agent Response:**
```
🌊 **SUI Transaction Created**

**Transfer Details:**
• **To:** 0x789...012
• **Amount:** 5 SUI  
• **Network:** devnet

🔄 Transaction payload generated successfully!

✅ **Ready for wallet signing!** Please approve the transaction in your Sui wallet.
```

**User:** "Transfer 0.1 SUI on testnet to my friend"

**Agent Response:**
```
💫 **SUI Testnet Transfer**

**Sending:** 0.1 SUI → [friend's address]
**Network:** testnet
**Gas:** Will be estimated automatically

⚡ Transaction created and sent to your wallet for approval.
```

---

## 9. Sui NFT Creation

**Endpoint:** `/api/tools/create-nft`  
**Purpose:** Create transaction for minting NFTs on Sui

### 💬 Chat Examples:

**User:** "Create an NFT called 'My Art' with description 'Digital artwork' and image 'https://example.com/art.jpg'"

**Agent Response:**
```
🎨 **NFT Creation Request**

**NFT Details:**
• **Name:** My Art
• **Description:** Digital artwork  
• **Image:** https://example.com/art.jpg
• **Network:** devnet

⚠️ **Note:** NFT minting operations are currently not supported by the Bitte Protocol generate-sui-tx integration.

💡 **Alternative:** You can mint NFTs directly through Sui wallet or other NFT platforms that support Sui blockchain.
```

**User:** "Mint an NFT for my collection"

**Agent Response:**
```
🏆 **NFT Minting Information**

NFT creation tools are available but currently have limitations with the Bitte Protocol integration.

**Recommended Approach:**
1. Use Sui Wallet's NFT minting feature
2. Connect to Sui-compatible NFT marketplaces
3. Use direct Sui SDK for custom NFT contracts

Would you like help with SUI token transfers instead?
```

---

## 10. Sui NFT Transfer

**Endpoint:** `/api/tools/transfer-sui-nft`  
**Purpose:** Transfer NFTs between Sui addresses

### 💬 Chat Examples:

**User:** "Transfer NFT with object ID 0xabc123...def456 to 0x789...012"

**Agent Response:**
```
🔄 **NFT Transfer Request**

**Transfer Details:**
• **NFT Object ID:** 0xabc123...def456
• **To:** 0x789...012
• **Network:** devnet

⚠️ **Note:** NFT transfer operations are currently not supported by the Bitte Protocol generate-sui-tx integration.

💡 **Alternative Solutions:**
- Transfer via Sui Wallet interface
- Use Sui Explorer's transfer function  
- Connect to Sui NFT marketplaces for transfers
```

---

## 11. Cryptocurrency Prices

**Endpoint:** `/api/tools/crypto-prices`  
**Purpose:** Fetch real-time cryptocurrency price data from CoinGecko

### 💬 Chat Examples:

**User:** "What's the current price of Bitcoin?"

**Agent Response:**
```
₿ **Bitcoin (BTC) Price**

💰 **Current Price:** $43,250.67 USD
📈 **24h Change:** +2.34% (+$987.23)
📊 **7d Change:** -1.2% (-$521.45)
🏆 **Market Cap Rank:** #1
💎 **Market Cap:** $847.2B
📈 **24h Volume:** $28.5B

*Data updated: 2024-01-15 10:30:00 UTC*
```

**User:** "Show me prices for BTC, ETH, and NEAR"

**Agent Response:**
```
💰 **Crypto Prices - Top 3 Requested**

🥇 **Bitcoin (BTC)**
Price: $43,250.67 | 24h: +2.34% | Rank: #1

🥈 **Ethereum (ETH)** 
Price: $2,587.42 | 24h: +1.87% | Rank: #2

🔺 **NEAR Protocol (NEAR)**
Price: $3.45 | 24h: +5.21% | Rank: #23

📊 All prices in USD • Updated: 2024-01-15 10:30 UTC
```

**User:** "What are the top 5 cryptocurrencies by market cap?"

**Agent Response:**
```
🏆 **Top 5 Cryptocurrencies by Market Cap**

1️⃣ **Bitcoin (BTC)** - $43,250.67 (+2.34%)
   Market Cap: $847.2B | Volume: $28.5B

2️⃣ **Ethereum (ETH)** - $2,587.42 (+1.87%)  
   Market Cap: $311.4B | Volume: $15.2B

3️⃣ **Binance Coin (BNB)** - $315.78 (+0.92%)
   Market Cap: $47.3B | Volume: $1.8B

4️⃣ **Solana (SOL)** - $98.45 (+3.15%)
   Market Cap: $42.1B | Volume: $2.1B

5️⃣ **Cardano (ADA)** - $0.52 (+1.45%)
   Market Cap: $18.2B | Volume: $890M

💡 *Real-time data from CoinGecko*
```

**User:** "Convert Bitcoin price to EUR"

**Agent Response:**
```
🌍 **Bitcoin Price in EUR**

₿ **Bitcoin (BTC)**
💶 **Price:** €39,847.23 EUR
📈 **24h Change:** +2.34% (+€912.34)
📊 **Market Cap:** €781.5B EUR
📈 **24h Volume:** €26.3B EUR

🔄 **Exchange Rate:** 1 USD = 0.9213 EUR
⏰ **Updated:** 2024-01-15 10:30:00 UTC
```

**User:** "Show me DeFi token prices"

**Agent Response:**
```
🏦 **DeFi Token Prices**

🦄 **Uniswap (UNI)** - $6.78 (+1.23%)
   Market Cap: $4.1B | 24h Vol: $187M

🔗 **Chainlink (LINK)** - $14.56 (-0.87%)
   Market Cap: $8.2B | 24h Vol: $423M  

🥞 **PancakeSwap (CAKE)** - $2.34 (+2.45%)
   Market Cap: $567M | 24h Vol: $89M

⚡ **Avalanche (AVAX)** - $36.78 (+1.67%)
   Market Cap: $13.5B | 24h Vol: $672M

📊 *DeFi sector showing mixed performance*
```

---

## 12. Coin Flip

**Endpoint:** `/api/tools/coinflip`  
**Purpose:** Flip a coin randomly

### 💬 Chat Examples:

**User:** "Flip a coin"

**Agent Response:**
```
🪙 **Coin Flip Result**

🎯 **Result:** HEADS

*Fair and random coin flip using cryptographic randomization*
```

**User:** "Heads or tails?"

**Agent Response:**
```
🎲 **Coin Toss**

🎪 *flipping coin...*

🎊 **TAILS!**

Better luck next time! 🍀
```

**User:** "Help me make a decision with a coin flip"

**Agent Response:**
```
🤔 **Decision Maker Coin Flip**

🪙 *Spinning the coin...*

✨ **Result: HEADS**

There you have it! Sometimes letting chance decide can help clarify what we really want. 🎯
```

---

## 🎯 Quick Usage Tips

### For Transactions:
1. **NEAR**: Only need account ID and NEAR amount
2. **EVM**: Need hex address and ETH amount  
3. **Sui**: Need Sui address and SUI amount

### For Price Queries:
- Use accurate coin IDs (bitcoin, ethereum, near)
- Can choose currency (usd, eur, gbp, jpy, cny)
- Maximum limit of 50 coins per request

### For Social Sharing:
- Text is a required parameter
- URL, hashtags, via are optional
- Automatically encodes URLs

### For Message Signing:
- Supports 4 methods: eth_sign, personal_sign, eth_signTypedData, eth_signTypedData_v4
- Default chain ID is Ethereum mainnet (1)

---

## 🔧 Development Notes

- All transaction tools create payloads, do not execute directly
- Bitte Protocol tools (generate-transaction, generate-evm-tx, generate-sui-tx) will execute transactions
- Price data from CoinGecko API with rate limiting
- Sui NFT operations are currently not fully supported by Bitte Protocol

---

*This documentation provides complete examples for interacting with Miko Agent through chat interface.*