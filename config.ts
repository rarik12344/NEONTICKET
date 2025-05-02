export const CONFIG = {
  // Основные настройки приложения
  hostUrl: process.env.NEXT_PUBLIC_HOST_URL || 'https://lotteryneon.vercel.app',
  baseExplorerUrl: 'https://basescan.org',
  currencySymbol: 'ETH',
  
  // Настройки сети Base
  network: {
    chainId: '0x2105',
    rpcUrl: 'https://mainnet.base.org',
    currency: {
      symbol: 'ETH',
      decimals: 18
    }
  },

  // Настройки контракта
  contract: {
    address: "0x6927648b3114B8B54FA5476Ec3BC3A52f1ab513B" as const,
    abi: [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_initialTicketPriceETH",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_feeWallet",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "roundIndex",
            "type": "uint256"
          }
        ],
        "name": "RoundCanceled",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "roundIndex",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "winner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "prize",
            "type": "uint256"
          }
        ],
        "name": "RoundEnded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "roundIndex",
            "type": "uint256"
          }
        ],
        "name": "RoundStarted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "roundIndex",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint32",
            "name": "tickets",
            "type": "uint32"
          }
        ],
        "name": "TicketsPurchased",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint32",
            "name": "_tickets",
            "type": "uint32"
          }
        ],
        "name": "buyTickets",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "cancelRound",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "currentRoundIndex",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "endRound",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "feePercent",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "feeWallet",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getCurrentRoundInfo",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "prizePool",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "participantsCount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "canceled",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "winner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "prizeAmount",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "roundIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "participantIndex",
            "type": "uint256"
          }
        ],
        "name": "getParticipantInfo",
        "outputs": [
          {
            "internalType": "address",
            "name": "wallet",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "tickets",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "ticketFrom",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "ticketTo",
            "type": "uint64"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "prizePoolPercent",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "rounds",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isCanceled",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "totalTickets",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "prizePool",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "winner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "prizeAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "participantsCount",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "randomnessSeed",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_prizePercent",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_feePercent",
            "type": "uint256"
          }
        ],
        "name": "setDistributionPercents",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_newWallet",
            "type": "address"
          }
        ],
        "name": "setFeeWallet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_newPrice",
            "type": "uint256"
          }
        ],
        "name": "setTicketPrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "startRound",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "ticketPriceETH",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      }
    ] as const,
    functions: {
      buyTickets: "buyTickets(uint32)",
      getCurrentRoundInfo: "getCurrentRoundInfo()",
      currentRoundIndex: "currentRoundIndex()",
      ticketPriceETH: "ticketPriceETH()"
    }
  },

  // Настройки газа
  gas: {
    defaultPrice: 0.2, // в gwei
    limitBuffer: 1.2,
    defaultLimit: 200000
  },

  // Настройки Frame
  frame: {
    version: 'vNext' as const,
    imageUrl: "https://i.ibb.co/HfcPqDfC/ogneon.jpg",
    postUrl: "/api/frame",
    buttons: {
      buyTicket: {
        label: "🎫 Buy Ticket",
        action: "post"
      },
      viewExplorer: {
        label: "🔍 View on BaseScan",
        action: "link"
      }
    }
  },

  // Настройки MiniApp
  miniapp: {
    name: "Neon Lottery",
    iconUrl: "https://i.ibb.co/rGGxZ9LL/neonlotteryicon.png",
    splash: {
      imageUrl: "https://i.ibb.co/hJdsnrjV/splashscreen.jpg",
      backgroundColor: "#0f0f1a"
    },
    webhookUrl: "/api/webhook"
  },

  // Константы
  constants: {
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000" as const,
    ETH_PRICE_FALLBACK: 3000 // USD
  }
} as const;

// Экспорт типов для TypeScript
export type Config = typeof CONFIG;
export type ContractABI = Config["contract"]["abi"];
export type FrameButton = Config["frame"]["buttons"][keyof Config["frame"]["buttons"]];
