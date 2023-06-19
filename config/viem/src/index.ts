import { ChainId } from '@sushiswap/chain'
import { Address, fallback, http, PublicClientConfig } from 'viem'
import {
  arbitrum,
  // arbitrumGoerli,
  // aurora,
  // auroraGoerli,
  avalanche,
  //  avalancheFuji,
  // bronos,
  // bronosTestnet,
  bsc,
  // bscTestnet,
  // canto,
  celo,
  // celoAlfajores,
  // crossbell,
  // evmos,
  //  evmosTestnet,
  fantom,
  // fantomTestnet,
  // filecoin,
  // filecoinTestnet,
  // foundry,
  // goerli,
  gnosis as _gnosis,
  // gnosisChiado,
  // hardhat,
  // iotex,
  // iotexTestnet,
  // localhost,
  mainnet,
  metis as _metis,
  // metisGoerli,
  optimism,
  //  optimismGoerli,
  polygon,
  polygonZkEvm as _polygonZkEvm,
  // polygonMumbai,
  // sepolia,
  //  taraxa,
  // taraxaTestnet,
  //  zkSync,
  // zkSyncTestnet,
} from 'viem/chains'

export {
  arbitrum,
  // arbitrumGoerli,
  // aurora,
  // auroraGoerli,
  avalanche,
  //  avalancheFuji,
  // bronos,
  // bronosTestnet,
  bsc,
  // bscTestnet,
  // canto,
  celo,
  // celoAlfajores,
  // crossbell,
  // evmos,
  //  evmosTestnet,
  fantom,
  // fantomTestnet,
  // filecoin,
  // filecoinTestnet,
  // foundry,
  // goerli,
  // gnosis,
  // gnosisChiado,
  // hardhat,
  // iotex,
  // iotexTestnet,
  // localhost,
  mainnet,
  // metis,
  // metisGoerli,
  optimism,
  //  optimismGoerli,
  polygon,
  // polygonMumbai,
  // sepolia,
  //  taraxa,
  // taraxaTestnet,
  //  zkSync,
  // zkSyncTestnet,
}

export const polygonZkEvm = {
  ..._polygonZkEvm,
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11' as Address,
      blockCreated: 57746,
    },
  },
}

export const gnosis = {
  ..._gnosis,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 21022491,
    },
  },
}

export const metis = {
  ..._metis,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 2338552,
    },
  },
}

export const harmony = {
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
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 24185753,
    },
  },
} as const

export const moonbeam = {
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
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 609002,
    },
  },
} as const

export const moonriver = {
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
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 1597904,
    },
  },
} as const

export const kava = {
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
      address: '0x1578f6d2D3168acF41b506AA666A521994F6BAB6' as Address,
      blockCreated: 1176602,
    },
  },
} as const

export const fuse = {
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
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 16146628,
    },
  },
} as const

export const arbitrumNova = {
  id: ChainId.ARBITRUM_NOVA,
  name: 'Arbitrum Nova',
  network: 'arbitrumnova',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://nova.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://nova.arbitrum.io/rpc'],
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
      address: '0x4d81f45fcde2B1C9A93Bde5495dc3553bbEC8EFa' as Address,
      blockCreated: 400008,
    },
  },
} as const

export const okex = {
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
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 10364792,
    },
  },
} as const

export const heco = {
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
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 14413501,
    },
  },
} as const

export const palm = {
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
      address: '0x80C7DD17B01855a6D2347444a0FCC36136a314de' as Address,
      blockCreated: 8005532,
    },
  },
} as const

export const boba = {
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
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 446859,
    },
  },
} as const

export const bobaAvax = {
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
      address: '0x2c46217Fae90D302d1Fb5467ADA504bC2A84f448' as Address,
      blockCreated: 3652,
    },
  },
} as const

export const bobaBnb = {
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
      address: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287' as Address,
      blockCreated: 18871,
    },
  },
} as const

export const bttc = {
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
      address: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287' as Address,
      blockCreated: 13014184,
    },
  },
} as const

const thundercore = {
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
} as const

const alchemyId = process.env['ALCHEMY_ID'] || process.env['NEXT_PUBLIC_ALCHEMY_ID']

export const config: Record<number, PublicClientConfig> = {
  [ChainId.ARBITRUM_NOVA]: {
    chain: arbitrumNova,
    transport: http(arbitrumNova.rpcUrls.default.http[0]),
  },
  [ChainId.ARBITRUM]: {
    chain: arbitrum,
    transport: fallback(
      [
        http(`${arbitrum.rpcUrls.alchemy.http}/${alchemyId}`),
        http('https://lb.drpc.org/ogrpc?network=arbitrum&dkey=Ak765fp4zUm6uVwKu4annC8M80dnCZkR7pAEsm6XXi_w'),
        http('https://rpc.ankr.com/arbitrum'),
        http('https://arbitrum-one.public.blastapi.io'),
        http('https://endpoints.omniatech.io/v1/arbitrum/one/public'),
        http('https://arb1.croswap.com/rpc'),
        http('https://1rpc.io/arb'),
        http('https://arbitrum.blockpi.network/v1/rpc/public'),
        http('https://arb-mainnet-public.unifra.io'),
      ],
      { rank: true }
    ),
  },
  [ChainId.AVALANCHE]: {
    chain: avalanche,
    transport: fallback([http(avalanche.rpcUrls.default.http[0]), http('https://rpc.ankr.com/avalanche')]),
  },
  [ChainId.BOBA]: {
    chain: boba,
    transport: fallback([http(boba.rpcUrls.default.http[0]), http('https://lightning-replica.boba.network')]),
  },
  [ChainId.BOBA_AVAX]: {
    chain: bobaAvax,
    transport: fallback([http(bobaAvax.rpcUrls.default.http[0]), http('https://replica.avax.boba.network')]),
  },
  [ChainId.BOBA_BNB]: {
    chain: bobaBnb,
    transport: fallback([http(bobaBnb.rpcUrls.default.http[0]), http('https://replica.bnb.boba.network')]),
  },
  [ChainId.BSC]: {
    chain: bsc,
    transport: fallback([
      http(bsc.rpcUrls.default.http[0]),
      http('https://lb.drpc.org/ogrpc?network=bsc&dkey=Ak765fp4zUm6uVwKu4annC8M80dnCZkR7pAEsm6XXi_w'),
      http('https://bsc-dataseed.binance.org'),
      http('https://bsc-dataseed1.binance.org'),
      http('https://bsc-dataseed2.binance.org'),
    ]),
  },
  [ChainId.BTTC]: {
    chain: bttc,
    transport: http(bttc.rpcUrls.default.http[0]),
  },
  [ChainId.CELO]: {
    chain: celo,
    transport: http(celo.rpcUrls.default.http[0]),
  },
  [ChainId.ETHEREUM]: {
    chain: mainnet,
    transport: fallback(
      [
        http(`${mainnet.rpcUrls.alchemy.http}/${alchemyId}`),
        http('https://lb.drpc.org/ogrpc?network=ethereum&dkey=Ak765fp4zUm6uVwKu4annC8M80dnCZkR7pAEsm6XXi_w'),
        http('https://eth.llamarpc.com'),
        // http('https://eth.rpc.blxrbdn.com'),
        // http('https://virginia.rpc.blxrbdn.com'),
        // http('https://singapore.rpc.blxrbdn.com'),
        // http('https://uk.rpc.blxrbdn.com'),
        http('https://1rpc.io/eth'),
        http('https://ethereum.publicnode.com'),
        http('https://cloudflare-eth.com'),
      ],
      { rank: true }
    ),
  },
  [ChainId.FANTOM]: {
    chain: fantom,
    transport: fallback([
      http(fantom.rpcUrls.default.http[0]),
      http('https://rpc.fantom.network'),
      http('https://rpc2.fantom.network'),
    ]),
  },
  [ChainId.FUSE]: {
    chain: fuse,
    transport: http(fuse.rpcUrls.default.http[0]),
  },
  [ChainId.GNOSIS]: {
    chain: gnosis,
    transport: fallback([http(gnosis.rpcUrls.default.http[0]), http('https://rpc.ankr.com/gnosis')]),
  },
  [ChainId.HARMONY]: {
    chain: harmony,
    transport: fallback([http(harmony.rpcUrls.default.http[0]), http('https://rpc.ankr.com/harmony')]),
  },
  [ChainId.KAVA]: {
    chain: kava,
    transport: fallback([http(kava.rpcUrls.default.http[0]), http(kava.rpcUrls.default.http[1])]),
  },
  [ChainId.METIS]: {
    chain: metis,
    transport: http(metis.rpcUrls.default.http[0]),
  },
  [ChainId.MOONBEAM]: {
    chain: moonbeam,
    transport: fallback([http(moonbeam.rpcUrls.default.http[0]), http('https://rpc.ankr.com/moonbeam')]),
  },
  [ChainId.MOONRIVER]: {
    chain: moonriver,
    transport: http(moonriver.rpcUrls.default.http[0]),
  },
  [ChainId.OPTIMISM]: {
    chain: optimism,
    transport: fallback(
      [
        http(`${optimism.rpcUrls.alchemy.http}/${alchemyId}`),
        http('https://lb.drpc.org/ogrpc?network=optimism&dkey=Ak765fp4zUm6uVwKu4annC8M80dnCZkR7pAEsm6XXi_w'),
        http('https://rpc.ankr.com/optimism'),
        http('https://optimism-mainnet.public.blastapi.io'),
        http('https://1rpc.io/op'),
        http('https://optimism.blockpi.network/v1/rpc/public'),
        http('https://mainnet.optimism.io'),
      ],
      { rank: true }
    ),
  },
  [ChainId.POLYGON]: {
    chain: polygon,
    transport: fallback(
      [
        http(`${polygon.rpcUrls.alchemy.http}/${alchemyId}`),
        http('https://polygon.llamarpc.com'),
        // http('https://polygon.rpc.blxrbdn.com'),
        http('https://polygon-mainnet.public.blastapi.io'),
        http('https://polygon.blockpi.network/v1/rpc/public'),
        http('https://polygon-rpc.com'),
        http('https://rpc.ankr.com/polygon'),
        http('https://matic-mainnet.chainstacklabs.com'),
        http('https://polygon-bor.publicnode.com'),
        http('https://rpc-mainnet.matic.quiknode.pro'),
        http('https://rpc-mainnet.maticvigil.com'),
        // ...polygon.rpcUrls.default.http.map((url) => http(url)),
      ],
      { rank: true }
    ),
    // transport: fallback([http(`${polygon.rpcUrls.alchemy.http}/${alchemyId}`), http('https://polygon.llamarpc.com')]),
  },
  [ChainId.POLYGON_ZKEVM]: {
    chain: polygonZkEvm,
    transport: fallback(
      [
        // http(`https://polygonzkevm-mainnet.g.alchemy.com/v2/${alchemyId}`),
        http('https://zkevm-rpc.com'),
        http('https://rpc.ankr.com/polygon_zkevm'),
        http('https://rpc.polygon-zkevm.gateway.fm'),
      ],
      { rank: true }
    ),
    // transport: fallback([http(`${polygon.rpcUrls.alchemy.http}/${alchemyId}`), http('https://polygon.llamarpc.com')]),
  },
  [ChainId.THUNDERCORE]: {
    chain: thundercore,
    transport: fallback(
      thundercore.rpcUrls.default.http.map((url) => http(url)),
      {
        rank: true,
      }
    ),
  },
} as const
