import { ACCOUNT_ID } from "@/app/config";
import { NextResponse } from "next/server";
import {
  chainIdParam,
  addressParam,
  SignRequestResponse200,
  AddressSchema,
  MetaTransactionSchema,
  SignRequestSchema,
} from "@bitte-ai/agent-sdk";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Sui Blockchain Agent",
            description: "Comprehensive Sui blockchain agent supporting NFTs, DeFi, transactions and utilities",
            version: "1.0.0"
        },
        servers: [
            {
                // Enter the base and open url of your agent here, make sure it is reachable
                url: "https://bitte-sui-agent-lime.vercel.app/"
            }
        ],
        "x-mb": {
            // The account id of the user who created the agent found in .env file
            "account-id": ACCOUNT_ID,
            // The email of the user who created the agent
            email: "nhatlapross@gmail.com",
            assistant: {
                name: "Sui Blockchain Assistant",
                description: "Comprehensive assistant for Sui blockchain operations including NFT marketplace, DeFi token swaps, kiosk management, transaction creation, balance checking, and general blockchain utilities. Supports NEAR and EVM chains as well.",
                instructions: "You handle comprehensive Sui blockchain operations. NFT TOOLS: mint-nft (create NFT), list-nft (list for sale), buy-nft (purchase), check-nft-wallet (view owned NFTs), create-kiosk (trading setup). PORTFOLIO TOOLS: sui-portfolio (complete wallet analysis with NFTs, coins, objects, USD value estimates). DeFi TOOLS: sui-swap (simple token swaps), swap-token (advanced Cetus DEX), sui-balance (check balances), crypto-prices (market data). TRANSACTION TOOLS: create-sui-transaction, create-near-transaction, create-evm-transaction then execute with generate-sui-tx, generate-transaction, generate-evm-tx respectively. UTILITIES: get-user, get-blockchains, twitter, coinflip, test-sui-call. Always use generate-sui-tx for Sui transactions after creating them.",
                tools: [{ type: "generate-transaction" }, { type: "generate-evm-tx" }, { type: "generate-sui-tx" }, { type: "sign-message" }],
                // Thumbnail image for your agent
                image: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/avatar.png`,
                // The repo url for your agent https://github.com/your-username/your-agent-repo
                repo: 'https://github.com/BitteProtocol/agent-next-boilerplate',
                // The categories your agent supports ["DeFi", "DAO", "NFT", "Social"]
                categories: ["DeFi", "DAO", "NFT", "Social"],
                // The chains your agent supports 1 = mainnet, 8453 = base
                chainIds: [1, 8453]
            },
        },
        paths: {
            "/api/tools/mint-nft": {
                get: {
                    operationId: "mintNft",
                    summary: "Mint NFT",
                    description: "Mint a new NFT using the simple_nft contract and transfer to user's wallet",
                    parameters: [
                        {
                            name: "userAddress",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The user's Sui address"
                        },
                        {
                            name: "name",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "NFT name"
                        },
                        {
                            name: "description",
                            in: "query", 
                            required: true,
                            schema: { type: "string" },
                            description: "NFT description"
                        },
                        {
                            name: "imageUrl",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "NFT image URL"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: { type: "string", enum: ["mainnet", "testnet", "devnet"] },
                            description: "The Sui network to use (default: testnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            suiSignRequest: { type: "object" },
                                            data: { type: "object" },
                                            message: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/buy-nft": {
                get: {
                    operationId: "buyNftMarketplace", 
                    summary: "Buy NFT from marketplace",
                    description: "Purchase an NFT from the marketplace using SUI coins",
                    parameters: [
                        {
                            name: "userAddress",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The buyer's Sui address"
                        },
                        {
                            name: "nftId",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The NFT ID to purchase"
                        },
                        {
                            name: "paymentAmount",
                            in: "query",
                            required: true,
                            schema: { type: "number", minimum: 0.001 },
                            description: "Payment amount in SUI"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: { type: "string", enum: ["mainnet", "testnet", "devnet"] },
                            description: "The Sui network to use (default: testnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            suiSignRequest: { type: "object" },
                                            data: { type: "object" },
                                            message: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/list-nft": {
                get: {
                    operationId: "listNft",
                    summary: "List NFT for sale",
                    description: "List an NFT for sale on the marketplace with specified price",
                    parameters: [
                        {
                            name: "userAddress",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The user's Sui address"
                        },
                        {
                            name: "nftId",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The NFT ID to list for sale"
                        },
                        {
                            name: "price",
                            in: "query",
                            required: true,
                            schema: { type: "number", minimum: 0.001 },
                            description: "The sale price in SUI"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: { type: "string", enum: ["mainnet", "testnet", "devnet"] },
                            description: "The Sui network to use (default: testnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            suiSignRequest: { type: "object" },
                                            data: { type: "object" },
                                            message: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/check-nft-wallet": {
                get: {
                    operationId: "checkNftWallet",
                    summary: "Check NFTs in wallet",
                    description: "Check all NFTs owned by a user's wallet address",
                    parameters: [
                        {
                            name: "userAddress",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The user's Sui address to check"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: { type: "string", enum: ["mainnet", "testnet", "devnet"] },
                            description: "The Sui network to use (default: testnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    walletAddress: { type: "string" },
                                                    network: { type: "string" },
                                                    nfts: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                id: { type: "string" },
                                                                name: { type: "string" },
                                                                description: { type: "string" },
                                                                imageUrl: { type: "string" },
                                                                creator: { type: "string" }
                                                            }
                                                        }
                                                    },
                                                    nftCount: { type: "number" },
                                                    suiBalance: { type: "object" }
                                                }
                                            },
                                            message: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/sui-swap": {
                get: {
                    operationId: "suiSwapTokens",
                    summary: "Swap tokens on Sui",
                    description: "Simple token swap on Sui blockchain with slippage protection. Supports SUI, USDC, USDT, WETH and custom tokens.",
                    parameters: [
                        {
                            name: "userAddress",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The user's Sui address"
                        },
                        {
                            name: "tokenFrom",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "Token to swap from (SUI, USDC, USDT, WETH or full address)"
                        },
                        {
                            name: "tokenTo",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "Token to swap to (SUI, USDC, USDT, WETH or full address)"
                        },
                        {
                            name: "amountIn",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "Amount to swap (in decimal format, e.g. '1.5')"
                        },
                        {
                            name: "slippageTolerance",
                            in: "query",
                            required: false,
                            schema: { type: "string" },
                            description: "Slippage tolerance percentage (default: 0.5)"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: { type: "string", enum: ["mainnet", "testnet", "devnet"] },
                            description: "The Sui network to use (default: testnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            suiSignRequest: { type: "object" },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    swap: {
                                                        type: "object",
                                                        properties: {
                                                            tokenFrom: { type: "string" },
                                                            tokenTo: { type: "string" },
                                                            amountIn: { type: "string" },
                                                            estimatedOutput: { type: "string" },
                                                            minOutput: { type: "string" },
                                                            slippageTolerance: { type: "string" }
                                                        }
                                                    }
                                                }
                                            },
                                            message: { type: "string" },
                                            note: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/sui-portfolio": {
                get: {
                    operationId: "getSuiPortfolio",
                    summary: "Track Sui wallet portfolio",
                    description: "Comprehensive portfolio tracking for Sui wallet including NFTs, all coin types, objects, and estimated USD values",
                    parameters: [
                        {
                            name: "userAddress",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The user's Sui address to track"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: { type: "string", enum: ["mainnet", "testnet", "devnet"] },
                            description: "The Sui network to use (default: testnet)"
                        },
                        {
                            name: "includePrices",
                            in: "query",
                            required: false,
                            schema: { type: "boolean" },
                            description: "Include USD price estimates (only works on mainnet, default: false)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    walletAddress: { type: "string" },
                                                    network: { type: "string" },
                                                    summary: {
                                                        type: "object",
                                                        properties: {
                                                            totalObjects: { type: "number" },
                                                            totalCoins: { type: "number" },
                                                            totalNfts: { type: "number" },
                                                            totalOtherObjects: { type: "number" },
                                                            estimatedUsdValue: { type: "string" }
                                                        }
                                                    },
                                                    suiBalance: {
                                                        type: "object",
                                                        properties: {
                                                            balance: { type: "string" },
                                                            balanceInSui: { type: "number" },
                                                            coinCount: { type: "number" }
                                                        }
                                                    },
                                                    coins: { type: "object" },
                                                    nfts: { type: "array" },
                                                    otherObjects: { type: "array" },
                                                    lastUpdated: { type: "string" }
                                                }
                                            },
                                            message: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-kiosk": {
                get: {
                    operationId: "createKiosk",
                    summary: "Create trading kiosk",
                    description: "Create a new Kiosk for storing and trading NFTs",
                    parameters: [
                        {
                            name: "userAddress",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The user's Sui address who will own the kiosk"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: { type: "string", enum: ["mainnet", "testnet", "devnet"] },
                            description: "The Sui network to use (default: testnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            suiSignRequest: { type: "object" },
                                            data: { type: "object" },
                                            message: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/get-blockchains": {
                get: {
                    summary: "get blockchain information",
                    description: "Respond with a list of blockchains",
                    operationId: "get-blockchains",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                                description: "The list of blockchains",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/get-user": {
                get: {
                    summary: "get user information",
                    description: "Returns user account ID and EVM address",
                    operationId: "get-user",
                    parameters: [
                        {
                            name: "accountId",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The user's account ID"
                        },
                        {
                            name: "evmAddress",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The user's EVM address"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            accountId: {
                                                type: "string",
                                                description: "The user's account ID, if you dont have it, return an empty string"
                                            },
                                            evmAddress: {
                                                type: "string",
                                                description: "The user's EVM address, if you dont have it, return an empty string"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/twitter": {
                get: {
                    operationId: "getTwitterShareIntent",
                    summary: "Generate a Twitter share intent URL",
                    description: "Creates a Twitter share intent URL based on provided parameters",
                    parameters: [
                        {
                            name: "text",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The text content of the tweet"
                        },
                        {
                            name: "url",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The URL to be shared in the tweet"
                        },
                        {
                            name: "hashtags",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Comma-separated hashtags for the tweet"
                        },
                        {
                            name: "via",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The Twitter username to attribute the tweet to"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            twitterIntentUrl: {
                                                type: "string",
                                                description: "The generated Twitter share intent URL"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-near-transaction": {
                get: {
                    operationId: "createNearTransaction",
                    summary: "Create a NEAR transaction payload",
                    description: "Generates a NEAR transaction payload for transferring tokens to be used directly in the generate-tx tool",
                    parameters: [
                        {
                            name: "receiverId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The NEAR account ID of the receiver"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of NEAR tokens to transfer"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action (e.g., 'Transfer')"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description: "The amount to transfer in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-evm-transaction": {
                get: {
                    operationId: "createEvmTransaction",
                    summary: "Create EVM transaction",
                    description: "Generate an EVM transaction payload with specified recipient and amount to be used directly in the generate-evm-tx tool",
                    parameters: [
                        {
                            name: "to",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The EVM address of the recipient"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of ETH to transfer"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            evmSignRequest: {
                                                type: "object",
                                                properties: {
                                                    to: {
                                                        type: "string",
                                                        description: "Receiver address"
                                                    },
                                                    value: {
                                                        type: "string",
                                                        description: "Transaction value"
                                                    },
                                                    data: {
                                                        type: "string",
                                                        description: "Transaction data"
                                                    },
                                                    from: {
                                                        type: "string",
                                                        description: "Sender address"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/coinflip": {
                get: {
                    summary: "Coin flip",
                    description: "Flip a coin and return the result (heads or tails)",
                    operationId: "coinFlip",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            result: {
                                                type: "string",
                                                description: "The result of the coin flip (heads or tails)",
                                                enum: ["heads", "tails"]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/eth-sign-request": {
              get: {
                summary: "returns ethereum signature requests",
                description:
                    "Constructs requested signature requests (eth_sign, personal_sign, eth_signTypedData, eth_signTypedData_v4)",
                operationId: "eth-sign",
                parameters: [
                    { $ref: "#/components/parameters/chainId" },
                    { $ref: "#/components/parameters/evmAddress" },
                    { $ref: "#/components/parameters/method" },
                    { $ref: "#/components/parameters/message" },
                ],
                responses: {
                    "200": { $ref: "#/components/responses/SignRequestResponse200" },
                },
              },
            },
            "/api/tools/create-sui-transaction": {
                get: {
                    operationId: "createSuiTransaction",
                    summary: "Create Sui transaction payload",
                    description: "Creates a Sui transaction payload for transfers to be used with generate-sui-tx tool",
                    parameters: [
                        {
                            name: "recipient",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The recipient Sui address"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of SUI to send"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["mainnet", "testnet", "devnet"]
                            },
                            description: "The Sui network to use (default: devnet)"
                        },
                        {
                            name: "type",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Transaction type (default: transfer)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            suiSignRequest: { type: "object" },
                                            recipient: { type: "string" },
                                            amount: { type: "number" },
                                            network: { type: "string" },
                                            message: { type: "string" },
                                            bitteInstruction: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/sui-balance": {
                get: {
                    operationId: "getSuiBalance",
                    summary: "Get Sui balance",
                    description: "Check SUI balance and all coin types for an address on mainnet, testnet, or devnet",
                    parameters: [
                        {
                            name: "address",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The Sui address to check balance for"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["mainnet", "testnet", "devnet"]
                            },
                            description: "The Sui network to use (default: devnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            address: { type: "string" },
                                            network: { type: "string" },
                                            suiBalance: { type: "string" },
                                            totalCoins: { type: "number" },
                                            coinTypes: { type: "array" },
                                            hasNextPage: { type: "boolean" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-nft": {
                get: {
                    operationId: "createNft",
                    summary: "Create NFT minting transaction",
                    description: "Create a transaction to mint an NFT with specified metadata to be used with generate-sui-tx tool",
                    parameters: [
                        {
                            name: "name",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The name of the NFT"
                        },
                        {
                            name: "description",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The description of the NFT"
                        },
                        {
                            name: "imageUrl",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The URL of the NFT image"
                        },
                        {
                            name: "recipient",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The recipient Sui address for the NFT"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["mainnet", "testnet", "devnet"]
                            },
                            description: "The Sui network to use (default: devnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            suiSignRequest: { type: "object" },
                                            nftDetails: { type: "object" },
                                            network: { type: "string" },
                                            message: { type: "string" },
                                            bitteInstruction: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/transfer-sui-nft": {
                get: {
                    operationId: "transferSuiNft",
                    summary: "Create NFT transfer transaction",
                    description: "Create a transaction to transfer an NFT to another address to be used with generate-sui-tx tool",
                    parameters: [
                        {
                            name: "objectId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The object ID of the NFT to transfer"
                        },
                        {
                            name: "recipient",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The recipient Sui address"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["mainnet", "testnet", "devnet"]
                            },
                            description: "The Sui network to use (default: devnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            suiSignRequest: { type: "object" },
                                            transfer: { type: "object" },
                                            message: { type: "string" },
                                            bitteInstruction: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/crypto-prices": {
                get: {
                    operationId: "getCryptoPrices",
                    summary: "Get cryptocurrency prices",
                    description: "Fetch real-time cryptocurrency prices and market data from CoinGecko API",
                    parameters: [
                        {
                            name: "coins",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Comma-separated list of coin IDs (e.g., 'bitcoin,ethereum,near'). Defaults to popular coins."
                        },
                        {
                            name: "currency",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["usd", "eur", "gbp", "jpy", "cny"]
                            },
                            description: "The currency to display prices in (default: usd)"
                        },
                        {
                            name: "limit",
                            in: "query",
                            required: false,
                            schema: {
                                type: "integer",
                                minimum: 1,
                                maximum: 50
                            },
                            description: "Number of coins to return (default: 10, max: 50)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Whether the request was successful"
                                            },
                                            data: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "string" },
                                                        symbol: { type: "string" },
                                                        name: { type: "string" },
                                                        price: { type: "number" },
                                                        marketCap: { type: "number" },
                                                        rank: { type: "number" },
                                                        change24h: { type: "number" },
                                                        change7d: { type: "number" },
                                                        volume24h: { type: "number" },
                                                        supply: { type: "number" },
                                                        currency: { type: "string" }
                                                    }
                                                }
                                            },
                                            timestamp: { type: "string" },
                                            currency: { type: "string" },
                                            count: { type: "number" }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            error: { type: "string" },
                                            message: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-nft-collection": {
                get: {
                    operationId: "createNftCollection",
                    summary: "Create NFT collection",
                    description: "Create a new NFT collection with royalty settings for the marketplace, compatible with generate-sui-tx tool",
                    parameters: [
                        {
                            name: "userAddress",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The user's Sui address"
                        },
                        {
                            name: "name",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The name of the NFT collection"
                        },
                        {
                            name: "description",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "The description of the NFT collection"
                        },
                        {
                            name: "maxSupply",
                            in: "query",
                            required: true,
                            schema: { type: "integer" },
                            description: "Maximum number of NFTs in this collection"
                        },
                        {
                            name: "royaltyFeeBps",
                            in: "query",
                            required: true,
                            schema: { type: "integer" },
                            description: "Royalty fee in basis points (100 = 1%, max 1000 = 10%)"
                        },
                        {
                            name: "network",
                            in: "query",
                            required: false,
                            schema: { type: "string", enum: ["mainnet", "testnet", "devnet"] },
                            description: "The Sui network to use (default: devnet)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            data: { 
                                                type: "object",
                                                properties: {
                                                    suiTransactionBytes: { type: "string" },
                                                    ownerAddress: { type: "string" },
                                                    network: { type: "string" },
                                                    packageId: { type: "string" },
                                                    transactionSize: { type: "number" }
                                                }
                                            },
                                            message: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
      parameters: {
        evmAddress: { ...addressParam, name: "evmAddress" },
        method: {
          name: "method",
          description: 'The signing method to be used.',
          in: "query",
          required: true,
          schema: {
            type: "string",
            enum: [
              'eth_sign',
              'personal_sign',
              'eth_signTypedData',
              'eth_signTypedData_v4',
            ],
          },
          example: "eth_sign",
        },
        chainId: {...chainIdParam, example: 8453, required: false},
        message: {
          name: "message",
          in: "query",
          required: false,
          description: "any text message",
          schema: { type: "string" },
          example: "Hello Bitte",
        },
      },
      responses: {
        SignRequestResponse200,
      },
      schemas: {
        Address: AddressSchema,
        MetaTransaction: MetaTransactionSchema,
        SignRequest: SignRequestSchema,
      },
    },
    };

    return NextResponse.json(pluginData);
}
                 