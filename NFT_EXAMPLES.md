# 🎨 NFT Marketplace Examples & Usage Guide

## 📖 Overview
Hướng dẫn chi tiết cách sử dụng các NFT tools để mint, trade và quản lý NFT trên Sui marketplace.

## 🏗️ Deployment Info
```
Package ID: 0x7aa81c7d1a7b91d13657a2b57be1bd363c91a5d7eb50e989afbb2e3f4f7b24d8
Marketplace Config: 0x9e9228b439e51d155762852e3f5b49989a62dafe9b3f025ce0ffeb06c245f1f3
Publisher ID: 0x51147e169539c410a8e9feeabf67c1f018b5bd9c13027cb3c9e4b14fff782763
Network: testnet
```

---

## 🤖 Agent Commands for NFT Operations

### Mint NFT Command Examples:

**Simple Mint Command:**
```
Create an NFT called "Digital Sunset #1" with description "Beautiful sunset over mountains" using image "https://example.com/sunset.jpg" with attributes ["Nature", "Sunset", "Digital Art"] and list it for 2.5 SUI
```

**Detailed Mint Command:**
```
Please mint a new NFT with these details:
- Collection ID: 0x123...
- Kiosk ID: 0x456...
- Kiosk Owner Cap ID: 0x789...
- Name: "Cyber Dragon #001"
- Description: "Epic cyberpunk dragon with neon scales and electric powers"
- Image URL: "https://ipfs.io/ipfs/QmXxXx/dragon001.jpg"
- Attributes: ["Dragon", "Cyberpunk", "Epic", "Electric"]
- List Price: 5.0 SUI
```

**Gaming NFT Mint:**
```
Mint a gaming weapon NFT: "Lightning Sword +10" described as "Legendary sword with lightning enchantment and +100 attack power" from image "https://game-assets.com/sword-lightning.png" with traits ["Weapon", "Legendary", "Lightning", "Sword"] priced at 8.5 SUI
```

### Buy NFT Commands:

**Simple Buy Command:**
```
Buy the NFT with ID 0xabc... from kiosk 0x456... for 2.5 SUI
```

**Detailed Buy Command:**
```
Purchase NFT:
- NFT ID: 0xabc123...
- From Kiosk: 0x456def...
- Collection: 0x789ghi...
- Transfer Policy: 0xjkl012...
- Price: 3.0 SUI
```

### Collection Creation Commands:

**Art Collection:**
```
Create a new NFT collection called "Digital Masterpieces" with description "Curated collection of premium digital artworks by emerging artists" with max supply of 5000 and 3% royalty fee
```

**Gaming Collection:**
```
Create gaming NFT collection "Epic Weapons Arsenal" described as "Legendary weapons and armor for RPG adventures" limited to 10000 items with 2.5% creator royalty
```

### Kiosk & Setup Commands:

**Complete Setup:**
```
Set up my NFT marketplace: create a new kiosk, create transfer policy, then create a collection called "My Art Gallery" with 1000 max supply and 4% royalty
```

**Simple Kiosk:**
```
Create a new kiosk for selling NFTs
```

### Trading Commands:

**Update Price:**
```
Update the price of NFT 0xabc123... in my kiosk to 7.5 SUI
```

**Delist NFT:**
```
Remove NFT 0xabc123... from sale in my kiosk
```

**Transfer NFT:**
```
Transfer my NFT 0xabc123... to address 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914
```

### Complete Conversation Flow Examples:

**Example 1 - Artist Creating First NFT:**
```
User: "I want to create my first NFT collection and mint an artwork"

Agent: "I'll help you create an NFT collection and mint your first artwork! Let me start by creating a collection for you."

User: "Make it called 'Abstract Dreams' for digital abstract art, max 500 pieces, 5% royalty"

Agent: [calls create-nft-collection tool]

User: "Now create a kiosk for selling"

Agent: [calls create-kiosk tool]

User: "Mint my first NFT called 'Cosmic Flow #1' - abstract space painting with swirling galaxies, image at https://myart.com/cosmic1.jpg, attributes should be Abstract, Space, Cosmic, Digital, price 3.5 SUI"

Agent: [calls mint-nft tool with provided details]
```

**Example 2 - Collector Browsing and Buying:**
```
User: "I want to buy that cool dragon NFT for 5 SUI from kiosk 0x456..."

Agent: "I'll help you purchase that NFT! I need a few more details:"

User: "The NFT ID is 0xabc123, collection is 0x789def, transfer policy 0xghi456"

Agent: [calls buy-nft tool]

User: "Great! Now I want to resell it for 8 SUI in my kiosk 0x999..."

Agent: [calls sell-nft tool with action=list]
```

**Example 3 - Batch Operations:**
```
User: "Set up everything for my gaming NFT project - collection called 'Epic Weapons', kiosk, and mint 3 weapon NFTs"

Agent: "I'll help you set up your complete gaming NFT project! Let me:"
1. Create the 'Epic Weapons' collection
2. Create your kiosk  
3. Create transfer policy
4. Mint your 3 weapon NFTs

User: "Perfect! The weapons are: Lightning Sword (legendary), Fire Axe (rare), Ice Bow (epic), all priced 5-10 SUI range"

Agent: [performs all operations step by step]
```

### Natural Language Patterns the Agent Understands:

**Mint Commands:**
- "Create NFT..." / "Mint NFT..." / "Make NFT..."
- "List for sale..." / "Price at..." / "Sell for..."
- "Add attributes..." / "Set traits..." / "Properties are..."

**Buy Commands:**  
- "Buy NFT..." / "Purchase..." / "Get that NFT..."
- "Pay X SUI for..." / "Spend X on..."

**Management Commands:**
- "Change price to..." / "Update price..." / "Relist for..."
- "Remove from sale..." / "Delist..." / "Stop selling..."
- "Send to..." / "Transfer to..." / "Give to..."

**Setup Commands:**
- "Create collection..." / "Make collection..." / "Start collection..."
- "Set up kiosk..." / "Create store..." / "Make marketplace..."
- "Set royalty..." / "Creator fee..." / "Commission..."

---

## 🎯 Complete NFT Flow Examples

### 1. 🎨 Create NFT Collection

**URL Example:**
```
GET /api/tools/create-nft-collection?name=Digital%20Art%20Collection&description=Amazing%20digital%20artworks%20by%20talented%20artists&maxSupply=10000&royaltyFeeBps=250&network=testnet
```

**Parameters:**
- `name`: "Digital Art Collection" 
- `description`: "Amazing digital artworks by talented artists"
- `maxSupply`: 10000
- `royaltyFeeBps`: 250 (2.5% royalty)
- `network`: testnet

**Expected Response:**
```json
{
  "success": true,
  "suiSignRequest": {
    "network": "testnet",
    "packageId": "0x7aa81c7d1a7b91d13657a2b57be1bd363c91a5d7eb50e989afbb2e3f4f7b24d8",
    "function": "create_and_share_collection",
    "module": "nft_marketplace::marketplace",
    "arguments": [...],
    "type": "create-collection"
  },
  "collectionDetails": {
    "name": "Digital Art Collection",
    "maxSupply": 10000,
    "royaltyPercentage": 2.5
  }
}
```

### 2. 🏪 Create Kiosk for Trading

**URL Example:**
```
GET /api/tools/create-kiosk?network=testnet
```

**Expected Response:**
```json
{
  "success": true,
  "suiSignRequest": {
    "network": "testnet",
    "packageId": "0x7aa81c7d1a7b91d13657a2b57be1bd363c91a5d7eb50e989afbb2e3f4f7b24d8",
    "function": "create_and_share_kiosk",
    "module": "nft_marketplace::marketplace",
    "type": "create-kiosk"
  },
  "note": "This will create a new Kiosk and you will receive a KioskOwnerCap"
}
```

### 3. 🛡️ Create Transfer Policy

**URL Example:**
```
GET /api/tools/create-transfer-policy?network=testnet
```

Uses default `PUBLISHER_ID` from environment.

### 4. 🎭 Mint NFT and List for Sale

**URL Example:**
```
GET /api/tools/mint-nft?collectionId=COLLECTION_ID&kioskId=KIOSK_ID&kioskOwnerCapId=KIOSK_OWNER_CAP_ID&name=Awesome%20Digital%20Art%20%231&description=This%20is%20an%20amazing%20piece%20of%20digital%20art&imageUrl=https://example.com/art1.jpg&attributes=["Rare","Digital","Art"]&listPrice=5.5&network=testnet
```

**Parameters:**
- `collectionId`: "0x..." (từ step 1)
- `kioskId`: "0x..." (từ step 2)  
- `kioskOwnerCapId`: "0x..." (từ step 2)
- `name`: "Awesome Digital Art #1"
- `description`: "This is an amazing piece of digital art"
- `imageUrl`: "https://example.com/art1.jpg"
- `attributes`: `["Rare","Digital","Art"]` (JSON array)
- `listPrice`: 5.5 (SUI)

**Expected Response:**
```json
{
  "success": true,
  "suiSignRequest": {
    "network": "testnet",
    "packageId": "0x7aa81c7d1a7b91d13657a2b57be1bd363c91a5d7eb50e989afbb2e3f4f7b24d8",
    "function": "mint_and_list_entry",
    "module": "nft_marketplace::marketplace",
    "arguments": [
      "COLLECTION_ID",
      "KIOSK_ID", 
      "KIOSK_OWNER_CAP_ID",
      [65,119,101,115,111,109,101,32,68,105,103,105,116,97,108,32,65,114,116,32,35,49],
      [...],
      ["Rare","Digital","Art"],
      "5500000000"
    ]
  },
  "nftDetails": {
    "name": "Awesome Digital Art #1",
    "listPrice": 5.5,
    "listPriceInMist": "5500000000"
  }
}
```

### 5. 💰 Buy NFT from Marketplace

**URL Example:**
```
GET /api/tools/buy-nft?kioskId=SELLER_KIOSK_ID&collectionId=COLLECTION_ID&transferPolicyId=TRANSFER_POLICY_ID&nftId=NFT_ID&paymentAmount=5.5&network=testnet
```

**Parameters:**
- `kioskId`: Kiosk chứa NFT cần mua
- `collectionId`: Collection ID của NFT
- `transferPolicyId`: Transfer Policy ID  
- `nftId`: ID của NFT cần mua
- `paymentAmount`: 5.5 (SUI)

**Expected Response:**
```json
{
  "success": true,
  "suiSignRequest": {
    "function": "purchase_and_complete",
    "arguments": [
      "SELLER_KIOSK_ID",
      "0x9e9228b439e51d155762852e3f5b49989a62dafe9b3f025ce0ffeb06c245f1f3",
      "COLLECTION_ID",
      "TRANSFER_POLICY_ID", 
      "NFT_ID",
      "5500000000"
    ]
  }
}
```

### 6. 🏷️ Manage NFT Listing

#### Delist NFT:
```
GET /api/tools/sell-nft?kioskId=KIOSK_ID&kioskOwnerCapId=OWNER_CAP_ID&nftId=NFT_ID&action=delist&network=testnet
```

#### Update Price:
```
GET /api/tools/sell-nft?kioskId=KIOSK_ID&kioskOwnerCapId=OWNER_CAP_ID&nftId=NFT_ID&action=update_price&listPrice=7.5&network=testnet
```

#### List NFT:
```
GET /api/tools/sell-nft?kioskId=KIOSK_ID&kioskOwnerCapId=OWNER_CAP_ID&nftId=NFT_ID&action=list&listPrice=6.0&network=testnet
```

### 7. 📤 Transfer NFT Directly

**URL Example:**
```
GET /api/tools/transfer-nft?nftId=NFT_ID&recipient=0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914&network=testnet
```

---

## 🎯 Real-World Usage Examples

### Example 1: Digital Art NFT
```
Name: "Cyber Punk City #001"
Description: "Futuristic cityscape with neon lights and flying cars"
Image: "https://ipfs.io/ipfs/QmXxXxXx/cyberpunk001.jpg"
Attributes: ["Cyberpunk", "Digital Art", "Rare", "Animated"]
Price: 2.5 SUI
```

### Example 2: Gaming NFT
```
Name: "Epic Sword of Dragons"
Description: "Legendary weapon with +100 damage and fire enchantment"
Image: "https://game-assets.com/weapons/epic-sword.png"  
Attributes: ["Weapon", "Epic", "Fire", "Legendary"]
Price: 15.0 SUI
```

### Example 3: Music NFT
```
Name: "Chill Beats Vol. 1"
Description: "Lo-fi hip hop beats perfect for studying and relaxation"
Image: "https://music-nfts.com/covers/chill-beats-v1.jpg"
Attributes: ["Music", "Lo-fi", "Chill", "Hip-hop"]
Price: 1.0 SUI
```

---

## 🔄 Complete Workflow Example

### Artist Creates and Sells NFT:

1. **Create Collection:**
```
GET /api/tools/create-nft-collection?name=My%20Art%20Collection&description=Digital%20paintings&maxSupply=1000&royaltyFeeBps=500
```

2. **Create Kiosk:**
```
GET /api/tools/create-kiosk?network=testnet
```

3. **Create Transfer Policy:**
```
GET /api/tools/create-transfer-policy?network=testnet
```

4. **Mint & List NFT:**
```
GET /api/tools/mint-nft?collectionId=0x...&kioskId=0x...&kioskOwnerCapId=0x...&name=Beautiful%20Sunset&description=A%20stunning%20sunset%20over%20the%20mountains&imageUrl=https://example.com/sunset.jpg&attributes=["Nature","Sunset","Landscape"]&listPrice=3.0
```

### Collector Buys NFT:

5. **Purchase NFT:**
```
GET /api/tools/buy-nft?kioskId=0x...&collectionId=0x...&transferPolicyId=0x...&nftId=0x...&paymentAmount=3.0
```

### Later Operations:

6. **Update Price:**
```
GET /api/tools/sell-nft?kioskId=0x...&kioskOwnerCapId=0x...&nftId=0x...&action=update_price&listPrice=5.0
```

7. **Transfer to Friend:**
```
GET /api/tools/transfer-nft?nftId=0x...&recipient=0x...
```

---

## 💡 Best Practices

### Pricing Strategy:
- **Entry Level:** 0.1 - 1.0 SUI
- **Mid Tier:** 1.0 - 10.0 SUI  
- **Premium:** 10.0+ SUI

### Attributes Examples:
- **Art:** `["Digital", "Abstract", "Rare", "Limited"]`
- **Gaming:** `["Weapon", "Epic", "PvP", "Legendary"]`
- **Music:** `["Electronic", "Ambient", "Instrumental"]`
- **Photography:** `["Nature", "Portrait", "Street", "BW"]`

### Image Hosting:
- **IPFS:** `https://ipfs.io/ipfs/QmXxXx`
- **Arweave:** `https://arweave.net/TxXxXx`
- **CDN:** `https://cdn.example.com/images/`

---

## 🚨 Common Issues & Solutions

### Issue 1: Invalid Attributes Format
**Error:** "Invalid attributes format. Must be JSON array"
**Solution:** Ensure attributes is valid JSON: `["Rare","Digital","Art"]`

### Issue 2: Insufficient Balance
**Error:** "Insufficient balance for transaction"
**Solution:** Add testnet SUI từ faucet: `https://faucet.testnet.sui.io/`

### Issue 3: Object Not Found  
**Error:** "Object not found"
**Solution:** Kiểm tra object IDs đã được tạo và exist trên blockchain

---

## 🔍 Testing Commands

Test các tools với curl:

```bash
# Test create collection
curl "http://localhost:3000/api/tools/create-nft-collection?name=Test%20Collection&description=Test&maxSupply=100&royaltyFeeBps=250"

# Test mint NFT
curl "http://localhost:3000/api/tools/mint-nft?collectionId=0x123&kioskId=0x456&kioskOwnerCapId=0x789&name=Test%20NFT&description=Test&imageUrl=https://example.com/test.jpg&attributes=[\"Test\"]&listPrice=1.0"

# Test buy NFT  
curl "http://localhost:3000/api/tools/buy-nft?kioskId=0x456&collectionId=0x123&transferPolicyId=0xabc&nftId=0xdef&paymentAmount=1.0"
```

Happy minting! 🎨✨