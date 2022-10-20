import { ChainId } from '@sushiswap/chain'

export const otherChains = [
  {
    id: ChainId.AVALANCHE,
    name: 'Avalanche',
    network: 'avalanche',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrls: {
      default: 'https://api.avax.network/ext/bc/C/rpc',
    },
    blockExplorers: {
      etherscan: {
        name: 'Snowtrace',
        url: 'https://snowtrace.io/',
      },
      default: {
        name: 'Snowtrace',
        url: 'https://snowtrace.io/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 11907934,
    },
  },
  {
    id: ChainId.BSC,
    name: 'Binance Smart Chain',
    network: 'bsc',
    nativeCurrency: { name: 'Binance Chain Native Token', symbol: 'BNB', decimals: 18 },
    rpcUrls: {
      default: 'https://bsc-dataseed1.binance.org',
    },
    blockExplorers: {
      etherscan: {
        name: 'Bscscan',
        url: 'https://bscscan.com',
      },
      default: {
        name: 'Bscscan',
        url: 'https://bscscan.com',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 15921452,
    },
  },
  {
    id: ChainId.FANTOM,
    name: 'Fantom',
    network: 'fantom',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    rpcUrls: {
      default: 'https://rpcapi.fantom.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Fantomscan',
        url: 'https://ftmscan.com',
      },
      default: {
        name: 'Fantomscan',
        url: 'https://ftmscan.com',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 33001987,
    },
  },
  {
    id: ChainId.GNOSIS,
    name: 'Gnosis Chain',
    network: 'gnosis',
    nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.gnosischain.com',
    },
    blockExplorers: {
      etherscan: {
        name: 'Gnosis Blockchain Explorer',
        url: 'https://blockscout.com/xdai/mainnet',
      },
      default: {
        name: 'Gnosis Blockchain Explorer',
        url: 'https://blockscout.com/xdai/mainnet',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 21022491,
    },
  },
  {
    id: ChainId.HARMONY,
    name: 'Gnosis Chain',
    network: 'gnosis',
    nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
    rpcUrls: {
      default: 'https://api.harmony.one',
    },
    blockExplorers: {
      etherscan: {
        name: 'Harmony Blockchain Explorer',
        url: 'https://explorer.harmony.one',
      },
      default: {
        name: 'Harmony Blockchain Explorer',
        url: 'https://explorer.harmony.one',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 24185753,
    },
  },
  {
    id: ChainId.MOONBEAM,
    name: 'Moonbeam',
    network: 'moonbeam',
    nativeCurrency: { name: 'Glimmer', symbol: 'GLMR', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.api.moonbeam.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Moonscan',
        url: 'https://moonbeam.moonscan.io',
      },
      default: {
        name: 'Moonscan',
        url: 'https://moonbeam.moonscan.io',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 609002,
    },
  },
  {
    id: ChainId.MOONRIVER,
    name: 'Moonriver',
    network: 'moonriver',
    nativeCurrency: { name: 'Moonriver', symbol: 'MOVR', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.api.moonriver.moonbeam.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Moonscan',
        url: 'https://moonriver.moonscan.io',
      },
      default: {
        name: 'Moonscan',
        url: 'https://moonriver.moonscan.io',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1597904,
    },
  },
  {
    id: ChainId.KAVA,
    name: 'Kava',
    network: 'kava',
    nativeCurrency: { name: 'Kava', symbol: 'KAVA', decimals: 18 },
    rpcUrls: {
      default: 'https://evm.kava.io',
    },
    blockExplorers: {
      etherscan: {
        name: 'Kavascan',
        url: 'https://explorer.kava.io/',
      },
      default: {
        name: 'Kavascan',
        url: 'https://explorer.kava.io/',
      },
    },
    multicall: {
      address: '0x1578f6d2D3168acF41b506AA666A521994F6BAB6',
      blockCreated: 1176602,
    },
  },
  {
    id: ChainId.METIS,
    name: 'Metis',
    network: 'metis',
    nativeCurrency: { name: 'Metis', symbol: 'METIS', decimals: 18 },
    rpcUrls: {
      default: 'https://andromeda.metis.io/?owner=1088',
    },
    blockExplorers: {
      etherscan: {
        name: 'Andromeda',
        url: 'https://andromeda-explorer.metis.io/',
      },
      default: {
        name: 'Andromeda',
        url: 'https://andromeda-explorer.metis.io/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 2338552,
    },
  },
  {
    id: ChainId.CELO,
    name: 'Celo',
    network: 'celo',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.ankr.com/celo',
    },
    blockExplorers: {
      etherscan: {
        name: 'Celoscan',
        url: 'https://celoscan.io/',
      },
      default: {
        name: 'Celoscan',
        url: 'https://celoscan.io/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 13112599,
    },
  },
  {
    id: ChainId.FUSE,
    name: 'Fuse',
    network: 'fuse',
    nativeCurrency: { name: 'Fuse', symbol: 'FUSE', decimals: 18 },
    rpcUrls: {
      default: 'https://rpc.fuse.io',
    },
    blockExplorers: {
      etherscan: {
        name: 'Fusescan',
        url: 'https://explorer.fuse.io/',
      },
      default: {
        name: 'Fuse Explorer',
        url: 'https://explorer.fuse.io/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 16146628,
    },
  },
  {
    id: ChainId.ARBITRUM_NOVA,
    name: 'Arbitrum Nova',
    network: 'arbitrumnova',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: 'https://nova.arbitrum.io/rpc',
    },
    blockExplorers: {
      etherscan: {
        name: 'Arbitrum Nova Chain Explorer',
        url: 'https://nova-explorer.arbitrum.io/',
      },
      default: {
        name: 'Arbitrum Nova Chain Explorer',
        url: 'https://nova-explorer.arbitrum.io/',
      },
    },
    multicall: {
      address: '0x4d81f45fcde2B1C9A93Bde5495dc3553bbEC8EFa',
      blockCreated: 400008,
    },
  },
  {
    id: ChainId.OKEX,
    name: 'OKXChain',
    network: 'okxchain',
    nativeCurrency: { name: 'OKC Token', symbol: 'OKT', decimals: 18 },
    rpcUrls: {
      default: 'https://exchainrpc.okex.org',
    },
    blockExplorers: {
      etherscan: {
        name: 'OKC Explorer',
        url: 'https://www.oklink.com/en/okc/',
      },
      default: {
        name: 'OKC Explorer',
        url: 'https://www.oklink.com/en/okc/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 10364792,
    },
  },
  {
    id: ChainId.HECO,
    name: 'Huobi ECO Chain',
    network: 'huobieco',
    nativeCurrency: { name: 'Huobi Token', symbol: 'HT', decimals: 18 },
    rpcUrls: {
      default: 'https://http-mainnet.hecochain.com',
    },
    blockExplorers: {
      etherscan: {
        name: 'HecoInfo',
        url: 'https://www.hecoinfo.com/',
      },
      default: {
        name: 'Heco Explorer',
        url: 'https://www.hecoinfo.com/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 14413501,
    },
  },
  {
    id: ChainId.PALM,
    name: 'Palm',
    network: 'palm',
    nativeCurrency: { name: 'Palm', symbol: 'PALM', decimals: 18 },
    rpcUrls: {
      default: 'https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b',
    },
    blockExplorers: {
      etherscan: {
        name: 'Palm Explorer',
        url: 'https://explorer.palm.io/',
      },
      default: {
        name: 'Palm Explorer',
        url: 'https://explorer.palm.io/',
      },
    },
    multicall: {
      address: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
      blockCreated: 8005532,
    },
  },
  {
    id: ChainId.BOBA,
    name: 'Boba',
    network: 'boba',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: 'https://mainnet.boba.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Bobascan',
        url: 'https://bobascan.com/',
      },
      default: {
        name: 'Bobascan',
        url: 'https://bobascan.com/',
      },
    },
    multicall: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 446859,
    },
  },
  {
    id: ChainId.BOBA_AVAX,
    name: 'Boba Avalanche Mainnet',
    network: 'boba-avax',
    nativeCurrency: { name: 'Boba', symbol: 'BOBA', decimals: 18 },
    rpcUrls: {
      default: 'https://avax.boba.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Boba Avalanche Mainnet Explorer',
        url: 'https://blockexplorer.avax.boba.network/',
      },
      default: {
        name: 'Boba Avalanche Mainnet Explorer',
        url: 'https://blockexplorer.avax.boba.network/',
      },
    },
    multicall: {
      address: '0x2c46217Fae90D302d1Fb5467ADA504bC2A84f448',
      blockCreated: 3652,
    },
  },
]
