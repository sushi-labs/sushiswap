import { http, type Address, type PublicClientConfig, fallback } from 'viem'
import {
  arbitrum,
  // arbitrumGoerli,
  arbitrumNova,
  // aurora,
  // auroraGoerli,
  avalanche,
  //  avalancheFuji,
  base,
  boba,
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
  // filecoinTestnet,
  foundry,
  fuse as _fuse, // missing multicall
  gnosis,
  goerli,
  haqqMainnet as _haqq,
  // gnosisChiado,
  hardhat,
  harmonyOne,
  // iotex,
  // iotexTestnet,
  linea,
  localhost,
  mainnet,
  metis,
  // metisGoerli,
  moonbeam,
  moonriver,
  okc,
  optimism,
  //  optimismGoerli,
  polygon,
  polygonZkEvm,
  scroll,
  // polygonMumbai,
  // sepolia,
  //  taraxa,
  // taraxaTestnet,
  telos,
  zkSync,
  // zkSyncTestnet,
} from 'viem/chains'
import { ChainId, TestnetChainId } from '../chain'

export {
  arbitrum,
  // arbitrumGoerli,
  arbitrumNova,
  // aurora,
  // auroraGoerli,
  avalanche,
  //  avalancheFuji,
  base,
  boba,
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
  // filecoinTestnet,
  foundry,
  gnosis,
  goerli,
  // gnosisChiado,
  hardhat,
  // iotex,
  // iotexTestnet,
  linea,
  localhost,
  mainnet,
  metis,
  // metisGoerli,
  moonbeam,
  moonriver,
  okc,
  optimism,
  //  optimismGoerli,
  polygon,
  polygonZkEvm,
  // polygonMumbai,
  // sepolia,
  //  taraxa,
  // taraxaTestnet,
  zkSync,
  // zkSyncTestnet,
}

// Chains missing multicall
export const fuse = {
  ..._fuse,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      blockCreated: 16146628,
    },
  },
} as const

const haqq = {
  ..._haqq,
  contracts: {
    multicall3: {
      address: '0xfe2D04A5018AC1B366F599A13BF4e0C760b2aE6b',
      blockCreated: 6589598,
    },
  },
} as const

// Chains missing from viem entirely
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
      http: [
        'https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b',
      ],
    },
    public: {
      http: [
        'https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b',
      ],
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

export const core = {
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
} as const

export const filecoin = {
  id: ChainId.FILECOIN,
  name: 'Filecoin Mainnet',
  network: 'filecoin-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'filecoin',
    symbol: 'FIL',
  },
  rpcUrls: {
    default: { http: ['https://api.node.glif.io/rpc/v1'] },
    public: { http: ['https://api.node.glif.io/rpc/v1'] },
  },
  blockExplorers: {
    default: { name: 'Filfox', url: 'https://filfox.info/en' },
    filscan: { name: 'Filscan', url: 'https://filscan.io' },
    filscout: { name: 'Filscout', url: 'https://filscout.io/en' },
    glif: { name: 'Glif', url: 'https://explorer.glif.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 3328594,
    },
  },
} as const

// const alchemyId =
//   process.env['ALCHEMY_ID'] || process.env['NEXT_PUBLIC_ALCHEMY_ID']
const drpcId = process.env['DRPC_ID'] || process.env['NEXT_PUBLIC_DRPC_ID']

export const viemConfig: Record<
  Exclude<ChainId, TestnetChainId>,
  PublicClientConfig
> = {
  [ChainId.ARBITRUM_NOVA]: {
    chain: arbitrumNova,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=arbitrum-nova&dkey=${drpcId}`,
    ),
  },
  [ChainId.ARBITRUM]: {
    chain: arbitrum,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${drpcId}`,
    ),
  },
  [ChainId.AVALANCHE]: {
    chain: avalanche,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=avalanche&dkey=${drpcId}`,
    ),
  },
  [ChainId.BOBA]: {
    chain: boba,
    transport: fallback(
      [
        http(boba.rpcUrls.default.http[0]),
        http('https://lightning-replica.boba.network'),
      ],
      {
        rank: true,
      },
    ),
  },
  [ChainId.BOBA_AVAX]: {
    chain: bobaAvax,
    transport: fallback(
      [
        http(bobaAvax.rpcUrls.default.http[0]),
        http('https://replica.avax.boba.network'),
      ],
      {
        rank: true,
      },
    ),
  },
  [ChainId.BOBA_BNB]: {
    chain: bobaBnb,
    transport: fallback(
      [
        http(bobaBnb.rpcUrls.default.http[0]),
        http('https://replica.bnb.boba.network'),
      ],
      {
        rank: true,
      },
    ),
  },
  [ChainId.BSC]: {
    chain: bsc,
    transport: http(`https://lb.drpc.org/ogrpc?network=bsc&dkey=${drpcId}`),
  },
  [ChainId.BTTC]: {
    chain: bttc,
    transport: http(bttc.rpcUrls.default.http[0]),
  },
  [ChainId.CELO]: {
    chain: celo,
    transport: http(`https://lb.drpc.org/ogrpc?network=celo&dkey=${drpcId}`),
  },
  [ChainId.ETHEREUM]: {
    chain: mainnet,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${drpcId}`,
    ),
  },
  [ChainId.FANTOM]: {
    chain: fantom,
    transport: http(`https://lb.drpc.org/ogrpc?network=fantom&dkey=${drpcId}`),
  },
  [ChainId.FUSE]: {
    chain: fuse,
    transport: http(`https://lb.drpc.org/ogrpc?network=fuse&dkey=${drpcId}`),
  },
  [ChainId.GNOSIS]: {
    chain: gnosis,
    transport: http(`https://lb.drpc.org/ogrpc?network=gnosis&dkey=${drpcId}`),
  },
  [ChainId.HARMONY]: {
    chain: harmonyOne,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=harmony-0&dkey=${drpcId}`,
    ),
  },
  [ChainId.KAVA]: {
    chain: kava,
    transport: http(`https://lb.drpc.org/ogrpc?network=kava&dkey=${drpcId}`),
  },
  [ChainId.METIS]: {
    chain: metis,
    transport: http(`https://lb.drpc.org/ogrpc?network=metis&dkey=${drpcId}`),
  },
  [ChainId.MOONBEAM]: {
    chain: moonbeam,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=moonbeam&dkey=${drpcId}`,
    ),
  },
  [ChainId.MOONRIVER]: {
    chain: moonriver,
    transport: http(moonriver.rpcUrls.default.http[0]),
  },
  [ChainId.OPTIMISM]: {
    chain: optimism,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=optimism&dkey=${drpcId}`,
    ),
  },
  [ChainId.POLYGON]: {
    chain: polygon,
    transport: http(`https://lb.drpc.org/ogrpc?network=polygon&dkey=${drpcId}`),
  },
  [ChainId.POLYGON_ZKEVM]: {
    chain: polygonZkEvm,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=polygon-zkevm&dkey=${drpcId}`,
    ),
  },
  [ChainId.THUNDERCORE]: {
    chain: thundercore,
    transport: fallback(
      thundercore.rpcUrls.default.http.map((url) => http(url)),
      {
        rank: true,
      },
    ),
  },
  [ChainId.HAQQ]: {
    chain: haqq,
    transport: http(`https://lb.drpc.org/ogrpc?network=haqq&dkey=${drpcId}`),
  },
  [ChainId.CORE]: {
    chain: core,
    transport: fallback(
      core.rpcUrls.default.http.map((url) => http(url)),
      {
        rank: true,
      },
    ),
  },
  [ChainId.TELOS]: {
    chain: telos,
    transport: fallback(
      [
        http(telos.rpcUrls.default.http[0]),
        http('https://rpc1.eu.telos.net/evm'),
        http('https://rpc1.us.telos.net/evm'),
      ],
      { rank: true },
    ),
  },
  [ChainId.PALM]: {
    chain: palm,
    transport: http(palm.rpcUrls.default.http[0]),
  },
  [ChainId.OKEX]: {
    chain: okc,
    transport: http(okc.rpcUrls.default.http[0]),
  },
  [ChainId.HECO]: {
    chain: heco,
    transport: http(heco.rpcUrls.default.http[0]),
  },
  [ChainId.ZKSYNC_ERA]: {
    chain: zkSync,
    transport: http(zkSync.rpcUrls.default.http[0]),
  },
  [ChainId.LINEA]: {
    chain: linea,
    transport: http(`https://lb.drpc.org/ogrpc?network=linea&dkey=${drpcId}`),
  },
  [ChainId.BASE]: {
    chain: base,
    transport: http(`https://lb.drpc.org/ogrpc?network=base&dkey=${drpcId}`),
  },
  [ChainId.SCROLL]: {
    chain: scroll,
    transport: http(`https://lb.drpc.org/ogrpc?network=scroll&dkey=${drpcId}`),
  },
  [ChainId.FILECOIN]: {
    chain: filecoin,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=filecoin&dkey=${drpcId}`,
    ),
  },
} as const
