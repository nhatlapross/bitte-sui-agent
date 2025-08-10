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
            title: "Miko Agent",
            description: "API for the Miko Agent",
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
                name: "Miko Assistant",
                description: "An assistant that answers with blockchain information, tells the user's account id, interacts with twitter, creates transaction payloads for NEAR, EVM and Sui blockchains, and flips coins. Also supports Sui network operations including balance checking, transfers, and NFT minting/transfers.",
                instructions: "You create near, evm, and sui transactions, give blockchain information, tell the user's account id, interact with twitter and flip coins. For blockchain transactions, first generate a transaction payload using the appropriate endpoint (/api/tools/create-near-transaction, /api/tools/create-evm-transaction, or /api/tools/create-sui-transaction), then explicitly use the corresponding tool to execute: 'generate-transaction' for NEAR, 'generate-evm-tx' for EVM, or 'generate-sui-tx' for Sui to actually send the transaction on the client side. For Sui operations, use /api/tools/sui-balance to check balances and /api/tools/create-sui-transaction for SUI token transfers. NFT operations (create-nft, transfer-sui-nft) are currently not supported by the Bitte Protocol generate-sui-tx integration and will return helpful error messages. Sui supports mainnet, testnet, and devnet networks.",
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
