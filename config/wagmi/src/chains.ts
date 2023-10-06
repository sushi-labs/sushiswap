import { ChainId } from 'sushi/chain'
import type { Chain } from '@wagmi/core'
import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  foundry,
  goerli,
  hardhat,
  localhost,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
  telos,
  zkSync,
} from '@wagmi/core/chains'

export const defaultChains: Chain[] = [
  arbitrum,
  // arbitrumGoerli,
  avalanche,
  // avalancheFuji,
  bsc,
  // bscTestnet,
  fantom,
  // fantomTestnet,
  foundry,
  goerli,
  hardhat,
  localhost,
  mainnet,
  optimism,
  // optimismGoerli,
  polygon,
  zkSync,
  // polygonMumbai,
  // sepolia,
]

export const otherChains: Chain[] = [
  {
    id: ChainId.AVALANCHE,
    name: 'Avalanche',
    network: 'avalanche',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://api.avax.network/ext/bc/C/rpc'],
      },
      public: {
        http: ['https://api.avax.network/ext/bc/C/rpc'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 11907934,
      },
    },
  },
  {
    id: ChainId.BSC,
    name: 'Binance Smart Chain',
    network: 'bsc',
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://bsc-dataseed1.binance.org'],
      },
      public: {
        http: ['https://bsc-dataseed1.binance.org'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 15921452,
      },
    },
  },
  {
    id: ChainId.FANTOM,
    name: 'Fantom',
    network: 'fantom',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpcapi.fantom.network'],
      },
      public: {
        http: ['https://rpcapi.fantom.network'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 33001987,
      },
    },
  },
  {
    id: ChainId.GNOSIS,
    name: 'Gnosis Chain',
    network: 'gnosis',
    nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://xdai-rpc.gateway.pokt.network', 'https://rpc.gnosischain.com'],
      },
      public: {
        http: ['https://xdai-rpc.gateway.pokt.network', 'https://rpc.gnosischain.com'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 21022491,
      },
    },
  },
  {
    id: ChainId.HARMONY,
    name: 'Harmony',
    network: 'harmony',
    nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://api.harmony.one'],
      },
      public: {
        http: ['https://api.harmony.one'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 24185753,
      },
    },
  },
  {
    id: ChainId.MOONBEAM,
    name: 'Moonbeam',
    network: 'moonbeam',
    nativeCurrency: { name: 'Glimmer', symbol: 'GLMR', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.api.moonbeam.network'],
      },
      public: {
        http: ['https://rpc.api.moonbeam.network'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 609002,
      },
    },
  },
  {
    id: ChainId.MOONRIVER,
    name: 'Moonriver',
    network: 'moonriver',
    nativeCurrency: { name: 'Moonriver', symbol: 'MOVR', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.api.moonriver.moonbeam.network'],
      },
      public: {
        http: ['https://rpc.api.moonriver.moonbeam.network'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 1597904,
      },
    },
  },
  {
    id: ChainId.KAVA,
    name: 'Kava',
    network: 'kava',
    nativeCurrency: { name: 'Kava', symbol: 'KAVA', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://evm.kava.io', 'https://evm2.kava.io'],
      },
      public: {
        http: ['https://evm.kava.io', 'https://evm2.kava.io'],
      },
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
    contracts: {
      multicall3: {
        address: '0x1578f6d2D3168acF41b506AA666A521994F6BAB6',
        blockCreated: 1176602,
      },
    },
  },
  {
    id: ChainId.METIS,
    name: 'Metis',
    network: 'metis',
    nativeCurrency: { name: 'Metis', symbol: 'METIS', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://andromeda.metis.io/?owner=1088'],
      },
      public: {
        http: ['https://andromeda.metis.io/?owner=1088'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 2338552,
      },
    },
  },
  {
    id: ChainId.CELO,
    name: 'Celo',
    network: 'celo',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.ankr.com/celo'],
      },
      public: {
        http: ['https://rpc.ankr.com/celo'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 13112599,
      },
    },
  },
  {
    id: ChainId.FUSE,
    name: 'Fuse',
    network: 'fuse',
    nativeCurrency: { name: 'Fuse', symbol: 'FUSE', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.fuse.io'],
      },
      public: {
        http: ['https://rpc.fuse.io'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 16146628,
      },
    },
  },
  {
    id: ChainId.ARBITRUM_NOVA,
    name: 'Arbitrum Nova',
    network: 'arbitrumnova',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://nova.arbitrum.io/rpc', 'https://arbitrum-nova.drpc.org'],
      },
      public: {
        http: ['https://nova.arbitrum.io/rpc', 'https://arbitrum-nova.drpc.org'],
      },
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
    contracts: {
      multicall3: {
        address: '0x4d81f45fcde2B1C9A93Bde5495dc3553bbEC8EFa',
        blockCreated: 400008,
      },
    },
  },
  {
    id: ChainId.OKEX,
    name: 'OKXChain',
    network: 'okxchain',
    nativeCurrency: { name: 'OKC Token', symbol: 'OKT', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://exchainrpc.okex.org'],
      },
      public: {
        http: ['https://exchainrpc.okex.org'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 10364792,
      },
    },
  },
  {
    id: ChainId.HECO,
    name: 'Huobi ECO Chain',
    network: 'huobieco',
    nativeCurrency: { name: 'Huobi Token', symbol: 'HT', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://http-mainnet.hecochain.com'],
      },
      public: {
        http: ['https://http-mainnet.hecochain.com'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 14413501,
      },
    },
  },
  {
    id: ChainId.PALM,
    name: 'Palm',
    network: 'palm',
    nativeCurrency: { name: 'Palm', symbol: 'PALM', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b'],
      },
      public: {
        http: ['https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b'],
      },
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
    contracts: {
      multicall3: {
        address: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
        blockCreated: 8005532,
      },
    },
  },
  {
    id: ChainId.BOBA,
    name: 'Boba',
    network: 'boba',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://mainnet.boba.network'],
      },
      public: {
        http: ['https://mainnet.boba.network'],
      },
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
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 446859,
      },
    },
  },
  {
    id: ChainId.BOBA_AVAX,
    name: 'Boba Avax',
    network: 'boba-avax',
    nativeCurrency: { name: 'Boba', symbol: 'BOBA', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://avax.boba.network'],
      },
      public: {
        http: ['https://avax.boba.network'],
      },
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
    contracts: {
      multicall3: {
        address: '0x2c46217Fae90D302d1Fb5467ADA504bC2A84f448',
        blockCreated: 3652,
      },
    },
  },
  {
    id: ChainId.BOBA_BNB,
    name: 'Boba BNB',
    network: 'boba-bnb',
    nativeCurrency: { name: 'Boba', symbol: 'BOBA', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://bnb.boba.network'],
      },
      public: {
        http: ['https://bnb.boba.network'],
      },
    },
    blockExplorers: {
      etherscan: {
        name: 'Boba BNB Mainnet Explorer',
        url: 'https://blockexplorer.bnb.boba.network/',
      },
      default: {
        name: 'Boba BNB Mainnet Explorer',
        url: 'https://blockexplorer.bnb.boba.network/',
      },
    },
    contracts: {
      multicall3: {
        address: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
        blockCreated: 18871,
      },
    },
  },
  {
    id: ChainId.BTTC,
    name: 'BitTorrent Chain',
    network: 'btt',
    nativeCurrency: { name: 'BitTorrent', symbol: 'BTT', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.bittorrentchain.io'],
      },
      public: {
        http: ['https://rpc.bittorrentchain.io'],
      },
    },
    blockExplorers: {
      etherscan: {
        name: 'BitTorrent Chain Explorer',
        url: 'https://bttcscan.com/',
      },
      default: {
        name: 'BitTorrent Chain Explorer',
        url: 'https://bttcscan.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
        blockCreated: 13014184,
      },
    },
  },
  {
    ...polygonZkEvm,
    id: ChainId.POLYGON_ZKEVM,
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 57746,
      },
    },
  },
  {
    id: ChainId.THUNDERCORE,
    name: 'ThunderCore',
    network: 'thundercore',
    nativeCurrency: { name: 'Thunder Token', symbol: 'TT', decimals: 18 },
    rpcUrls: {
      default: {
        http: [
          'https://mainnet-rpc.thundercore.com',
          // 'https://mainnet-rpc.thundercore.io',
          // 'https://mainnet-rpc.thundertoken.net',
        ],
      },
      public: {
        http: [
          'https://mainnet-rpc.thundercore.com',
          'https://mainnet-rpc.thundercore.io',
          'https://mainnet-rpc.thundertoken.net',
        ],
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 100671921,
      },
    },
  },
  {
    id: ChainId.HAQQ,
    name: 'Haqq',
    network: 'haqq',
    nativeCurrency: { name: 'Islam', symbol: 'ISLM', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.eth.haqq.network'],
      },
      public: {
        http: ['https://rpc.eth.haqq.network'],
      },
    },
    contracts: {
      multicall3: {
        address: '0xfe2D04A5018AC1B366F599A13BF4e0C760b2aE6b',
        blockCreated: 6589598,
      },
    },
  },
  {
    id: ChainId.CORE,
    name: 'Core',
    network: 'core',
    nativeCurrency: { name: 'Core', symbol: 'CORE', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.coredao.org', 'https://rpc-core.icecreamswap.com'],
      },
      public: {
        http: ['https://rpc.coredao.org', 'https://rpc-core.icecreamswap.com'],
      },
    },
    contracts: {
      multicall3: {
        address: '0xC4b2e1718E850535A0f3e79F7fC522d966821688',
        blockCreated: 5087121,
      },
    },
  },
  {
    ...telos,
    id: ChainId.TELOS,
  },
  {
    id: ChainId.LINEA,
    name: 'Linea',
    network: 'linea',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.linea.build'],
      },
      public: {
        http: ['https://rpc.linea.build'],
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 42,
      },
    },
  },
  {
    id: ChainId.BASE,
    name: 'Base',
    network: 'base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://developer-access-mainnet.base.org'],
      },
      public: {
        http: ['https://developer-access-mainnet.base.org'],
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 5022,
      },
    },
  },
]

export const allChains = [...defaultChains, ...otherChains]
