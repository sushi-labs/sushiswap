import { EvmChainId } from 'sushi/chain'
import {
  http,
  type Address,
  type Chain,
  type PublicClientConfig,
  type Transport,
} from 'viem'
import {
  // zkSyncTestnet,
  // curtis as _curtis,
  fuse as _fuse, // missing multicall
  haqqMainnet as _haqq,
  zkLinkNova as _zkLinkNova, // missing multicall
  arbitrum,
  // arbitrumGoerli,
  arbitrumNova,
  // arbitrumSepolia,
  // aurora,
  // auroraGoerli,
  avalanche,
  // avalancheFuji,
  //  avalancheFuji,
  base,
  boba,
  // bronos,
  // bronosTestnet,
  bsc,
  bscTestnet,
  // bscTestnet,
  // canto,
  celo,
  // ronin,
  cronos,
  // celoAlfajores,
  // crossbell,
  // evmos,
  //  evmosTestnet,
  fantom,
  // fantomTestnet,
  // fantomTestnet,
  // filecoinTestnet,
  foundry,
  gnosis,
  goerli,
  // gnosisChiado,
  hardhat,
  harmonyOne,
  // iotex,
  // iotexTestnet,
  linea,
  localhost,
  mainnet,
  manta,
  mantle,
  metis,
  // metisGoerli,
  mode,
  moonbeam,
  moonriver,
  okc,
  optimism,
  //  optimismGoerli,
  polygon,
  // polygonMumbai,
  polygonZkEvm,
  rootstock,
  scroll,
  sepolia,
  taiko,
  // polygonMumbai,
  // sepolia,
  //  taraxa,
  // taraxaTestnet,
  telos,
  zkSync,
} from 'viem/chains'

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
  manta,
  mantle,
  metis,
  // metisGoerli,
  mode,
  moonbeam,
  moonriver,
  okc,
  optimism,
  //  optimismGoerli,
  polygon,
  polygonZkEvm,
  rootstock,
  taiko,
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

const zkLinkNova = {
  ..._zkLinkNova,
  contracts: {
    multicall3: {
      address: '0x825267E0fA5CAe92F98540828a54198dcB3Eaeb5' as Address,
      blockCreated: 146055,
    },
  },
}

// Chains missing from viem entirely
export const kava = {
  id: EvmChainId.KAVA,
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

export const bobaBnb = {
  id: EvmChainId.BOBA_BNB,
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
  id: EvmChainId.BTTC,
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
  id: EvmChainId.THUNDERCORE,
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
  id: EvmChainId.CORE,
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
  id: EvmChainId.FILECOIN,
  name: 'Filecoin Mainnet',
  network: 'filecoin-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'filecoin',
    symbol: 'FIL',
  },
  rpcUrls: {
    default: { http: ['https://rpc.ankr.com/filecoin'] },
    public: { http: ['https://rpc.ankr.com/filecoin'] },
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

export const zetachain = {
  id: EvmChainId.ZETACHAIN,
  name: 'ZetaChain',
  network: 'zetachain',
  nativeCurrency: {
    decimals: 18,
    name: 'Zeta',
    symbol: 'ZETA',
  },
  rpcUrls: {
    default: {
      http: [
        'https://zetachain-evm.blockpi.network/v1/rpc/public',
        'https://zetachain-mainnet-archive.allthatnode.com:8545',
        'https://zetachain.rpc.thirdweb.com',
        'https://jsonrpc.zetachain.nodestake.org',
      ],
    },
    public: {
      http: [
        'https://zetachain-evm.blockpi.network/v1/rpc/public',
        'https://zetachain-mainnet-archive.allthatnode.com:8545',
        'https://zetachain.rpc.thirdweb.com',
        'https://jsonrpc.zetachain.nodestake.org',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'ZetaScan', url: 'https://explorer.zetachain.com/' },
    blockscout: {
      name: 'Blockscout',
      url: 'https://zetachain.blockscout.com/',
    },
  },
  contracts: {
    multicall3: {
      address: '0x039e87AB90205F9d87c5b40d4B28e2Be45dA4a20',
      blockCreated: 1565755,
    },
  },
} as const

export const blast = {
  id: EvmChainId.BLAST,
  name: 'Blast',
  network: 'blast',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [
        'https://rpc.blast.io',
        'https://rpc.ankr.com/blast',
        'https://blast.din.dev/rpc',
        'https://blastl2-mainnet.public.blastapi.io',
        'https://blast.blockpi.network/v1/rpc/public',
      ],
    },
    public: {
      http: [
        'https://rpc.blast.io',
        'https://rpc.ankr.com/blast',
        'https://blast.din.dev/rpc',
        'https://blastl2-mainnet.public.blastapi.io',
        'https://blast.blockpi.network/v1/rpc/public',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'BlastScan', url: 'https://blastscan.io/' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 88189,
    },
  },
} as const

export const skaleEuropa = {
  id: EvmChainId.SKALE_EUROPA,
  name: 'SKALE Europa',
  network: 'skale-europa',
  nativeCurrency: {
    decimals: 18,
    name: 'SKALE Fuel',
    symbol: 'sFUEL',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.skalenodes.com/v1/elated-tan-skat'],
    },
    public: {
      http: ['https://mainnet.skalenodes.com/v1/elated-tan-skat'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 3113495,
    },
  },
} as const

export const apeChain = {
  id: 33139,
  name: 'Ape Chain',
  nativeCurrency: {
    name: 'ApeCoin',
    symbol: 'APE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.apechain.com/http'],
      webSocket: ['wss://rpc.apechain.com/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Apescan',
      url: 'https://apescan.io',
      apiUrl: 'https://api.apescan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 20889,
    },
  },
  sourceId: 42_161,
} as const

export const sonic = {
  id: 146,
  name: 'Sonic',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: { http: ['https://rpc.soniclabs.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Explorer',
      url: 'https://sonicscan.org',
      apiUrl: 'https://api.sonicscan.org/api',
    },
  },
  testnet: false,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 60,
    },
  },
} as const

export const hemi = {
  id: 43111,
  name: 'Hemi Network',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://rpc.hemi.network/rpc'] },
  },
  blockExplorers: {
    default: {
      name: 'Hemi Explorer',
      url: 'https://explorer.hemi.xyz',
      apiUrl: 'https://explorer.hemi.xyz/api',
    },
  },
  testnet: false,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 0,
    },
  },
} as const

export const tatara = {
  id: 129399,
  name: 'Tatara',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.tatara.katanarpc.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tatara Explorer',
      url: 'https://explorer.tatara.katana.network',
      apiUrl: 'https://explorer.tatara.katana.network/api',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 0,
    },
  },
} as const

export const katana = {
  id: 747474,
  name: 'Katana',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.katana.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Katana Explorer',
      url: 'https://explorer.katanarpc.com',
      apiUrl: 'https://explorer.katanarpc.com/api',
    },
  },
  testnet: false,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 0,
    },
  },
} as const

export const hyperEvm = {
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: {
    decimals: 18,
    name: 'Hyperliquid',
    symbol: 'HYPE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HyperEVM Explorer',
      url: 'https://hyperevmscan.io',
      apiUrl: 'https://api.hyperevmscan.io/api',
    },
  },
  testnet: false,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 13051,
    },
  },
} as const

const drpcId = process.env['DRPC_ID'] || process.env['NEXT_PUBLIC_DRPC_ID']

export const publicTransports = {
  [EvmChainId.ARBITRUM_NOVA]: http(
    `https://lb.drpc.org/ogrpc?network=arbitrum-nova&dkey=${drpcId}`,
  ),
  [EvmChainId.ARBITRUM]: http(
    `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${drpcId}`,
  ),
  [EvmChainId.AVALANCHE]: http(
    `https://lb.drpc.org/ogrpc?network=avalanche&dkey=${drpcId}`,
  ),
  [EvmChainId.BOBA]: http(
    `https://lb.drpc.org/ogrpc?network=boba-eth&dkey=${drpcId}`,
  ),
  [EvmChainId.BOBA_BNB]: http(
    `https://lb.drpc.org/ogrpc?network=boba-bnb&dkey=${drpcId}`,
  ),
  [EvmChainId.BSC]: http(
    `https://lb.drpc.org/ogrpc?network=bsc&dkey=${drpcId}`,
  ),
  [EvmChainId.BTTC]: http('https://rpc.bittorrentchain.io'),
  [EvmChainId.CELO]: http(
    `https://lb.drpc.org/ogrpc?network=celo&dkey=${drpcId}`,
  ),
  [EvmChainId.ETHEREUM]: http(
    `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${drpcId}`,
  ),
  [EvmChainId.FANTOM]: http(
    `https://lb.drpc.org/ogrpc?network=fantom&dkey=${drpcId}`,
  ),
  [EvmChainId.FUSE]: http(
    `https://lb.drpc.org/ogrpc?network=fuse&dkey=${drpcId}`,
  ),
  [EvmChainId.GNOSIS]: http(
    `https://lb.drpc.org/ogrpc?network=gnosis&dkey=${drpcId}`,
  ),
  [EvmChainId.HARMONY]: http(
    `https://lb.drpc.org/ogrpc?network=harmony-0&dkey=${drpcId}`,
  ),
  [EvmChainId.KAVA]: http(
    `https://lb.drpc.org/ogrpc?network=kava&dkey=${drpcId}`,
  ),
  [EvmChainId.METIS]: http(
    `https://lb.drpc.org/ogrpc?network=metis&dkey=${drpcId}`,
  ),
  [EvmChainId.MOONBEAM]: http(
    `https://lb.drpc.org/ogrpc?network=moonbeam&dkey=${drpcId}`,
  ),
  [EvmChainId.MOONRIVER]: http(
    `https://lb.drpc.org/ogrpc?network=moonriver&dkey=${drpcId}`,
  ),
  [EvmChainId.OPTIMISM]: http(
    `https://lb.drpc.org/ogrpc?network=optimism&dkey=${drpcId}`,
  ),
  [EvmChainId.POLYGON]: http(
    `https://lb.drpc.org/ogrpc?network=polygon&dkey=${drpcId}`,
  ),
  [EvmChainId.POLYGON_ZKEVM]: http(
    `https://lb.drpc.org/ogrpc?network=polygon-zkevm&dkey=${drpcId}`,
  ),
  [EvmChainId.THUNDERCORE]: http(
    `https://lb.drpc.org/ogrpc?network=thundercore&dkey=${drpcId}`,
  ),
  [EvmChainId.HAQQ]: http(
    `https://lb.drpc.org/ogrpc?network=haqq&dkey=${drpcId}`,
  ),
  [EvmChainId.CORE]: http(
    `https://lb.drpc.org/ogrpc?network=core&dkey=${drpcId}`,
  ),
  [EvmChainId.TELOS]: http(
    `https://lb.drpc.org/ogrpc?network=telos&dkey=${drpcId}`,
  ),
  [EvmChainId.ZKSYNC_ERA]: http(
    `https://lb.drpc.org/ogrpc?network=zksync&dkey=${drpcId}`,
  ),
  [EvmChainId.LINEA]: http(
    `https://lb.drpc.org/ogrpc?network=linea&dkey=${drpcId}`,
  ),
  [EvmChainId.BASE]: http(
    `https://lb.drpc.org/ogrpc?network=base&dkey=${drpcId}`,
  ),
  [EvmChainId.SCROLL]: http(
    `https://lb.drpc.org/ogrpc?network=scroll&dkey=${drpcId}`,
  ),
  [EvmChainId.FILECOIN]: http(
    `https://lb.drpc.org/ogrpc?network=filecoin&dkey=${drpcId}`,
    // 'https://fil-mainnet-1.rpc.laconic.com/rpc/v1'
  ),
  [EvmChainId.ZETACHAIN]: http(
    `https://lb.drpc.org/ogrpc?network=zeta-chain&dkey=${drpcId}`,
  ),
  [EvmChainId.CRONOS]: http(
    `https://lb.drpc.org/ogrpc?network=cronos&dkey=${drpcId}`,
  ),
  [EvmChainId.BLAST]: http(
    `https://lb.drpc.org/ogrpc?network=blast&dkey=${drpcId}`,
  ),
  [EvmChainId.SKALE_EUROPA]: http(
    'https://elated-tan-skat-indexer.skalenodes.com:10072',
  ),
  [EvmChainId.ROOTSTOCK]: http(
    `https://lb.drpc.org/ogrpc?network=rootstock&dkey=${drpcId}`,
  ),
  [EvmChainId.MANTLE]: http(
    `https://lb.drpc.org/ogrpc?network=mantle&dkey=${drpcId}`,
  ),
  [EvmChainId.MANTA]: http(
    `https://lb.drpc.org/ogrpc?network=manta-pacific&dkey=${drpcId}`,
  ),
  [EvmChainId.MODE]: http(
    `https://lb.drpc.org/ogrpc?network=mode&dkey=${drpcId}`,
  ),
  [EvmChainId.TAIKO]: http(
    `https://lb.drpc.org/ogrpc?network=taiko&dkey=${drpcId}`,
  ),
  [EvmChainId.ZKLINK]: http('https://rpc.zklink.io'),
  [EvmChainId.APE]: http(
    `https://lb.drpc.org/ogrpc?network=apechain&dkey=${drpcId}`,
  ),
  [EvmChainId.SONIC]: http(
    `https://lb.drpc.org/ogrpc?network=sonic&dkey=${drpcId}`,
  ),
  [EvmChainId.HEMI]: http('https://rpc.hemi.network/rpc'),
  [EvmChainId.KATANA]: http('https://rpc.katana.network'),
  [EvmChainId.HYPEREVM]: http(
    `https://lb.drpc.org/ogrpc?network=hyperliquid&dkey=${drpcId}`,
  ),
  /* Testnets */ // TODO: add testnet transports
  [EvmChainId.SEPOLIA]: http('https://sepolia.drpc.org'),
  [EvmChainId.TATARA]: http('https://rpc.tatara.katanarpc.com'),
} as const satisfies Record<EvmChainId, Transport>

export const publicChains = [
  mainnet,
  arbitrumNova,
  arbitrum,
  avalanche,
  boba,
  bobaBnb,
  bsc,
  bttc,
  blast,
  celo as unknown as Omit<typeof mainnet, 'id'> & { id: 42220 },
  cronos,
  fantom,
  fuse,
  gnosis,
  harmonyOne,
  kava,
  metis,
  optimism,
  moonbeam,
  moonriver,
  polygon,
  polygonZkEvm,
  rootstock,
  thundercore,
  haqq,
  core,
  telos,
  zkSync as unknown as Omit<typeof mainnet, 'id'> & { id: 324 },
  linea,
  base,
  scroll,
  skaleEuropa,
  filecoin,
  zetachain,
  mantle,
  manta,
  mode,
  taiko,
  zkLinkNova,
  apeChain as unknown as Omit<typeof mainnet, 'id'> & { id: 33139 },
  sonic,
  hemi,
  katana,
  hyperEvm,
  /* Testnets */
  sepolia,
  tatara,
] as const satisfies Readonly<Chain[]>

export const publicClientConfig = {
  [EvmChainId.ARBITRUM_NOVA]: {
    chain: arbitrumNova,
    transport: publicTransports[EvmChainId.ARBITRUM_NOVA],
  },
  [EvmChainId.ARBITRUM]: {
    chain: arbitrum,
    transport: publicTransports[EvmChainId.ARBITRUM],
  },
  [EvmChainId.AVALANCHE]: {
    chain: avalanche,
    transport: publicTransports[EvmChainId.AVALANCHE],
  },
  [EvmChainId.BOBA]: {
    chain: boba,
    transport: publicTransports[EvmChainId.BOBA],
  },
  [EvmChainId.BOBA_BNB]: {
    chain: bobaBnb,
    transport: publicTransports[EvmChainId.BOBA_BNB],
  },
  [EvmChainId.BSC]: {
    chain: bsc,
    transport: publicTransports[EvmChainId.BSC],
  },
  [EvmChainId.BTTC]: {
    chain: bttc,
    transport: publicTransports[EvmChainId.BTTC],
  },
  [EvmChainId.CELO]: {
    chain: celo as unknown as typeof mainnet & { id: 42220 },
    transport: publicTransports[EvmChainId.CELO],
  },
  [EvmChainId.ETHEREUM]: {
    chain: mainnet,
    transport: publicTransports[EvmChainId.ETHEREUM],
  },
  [EvmChainId.FANTOM]: {
    chain: fantom,
    transport: publicTransports[EvmChainId.FANTOM],
  },
  [EvmChainId.FUSE]: {
    chain: fuse,
    transport: publicTransports[EvmChainId.FUSE],
  },
  [EvmChainId.GNOSIS]: {
    chain: gnosis,
    transport: publicTransports[EvmChainId.GNOSIS],
  },
  [EvmChainId.HARMONY]: {
    chain: harmonyOne,
    transport: publicTransports[EvmChainId.HARMONY],
  },
  [EvmChainId.KAVA]: {
    chain: kava,
    transport: publicTransports[EvmChainId.KAVA],
  },
  [EvmChainId.METIS]: {
    chain: metis,
    transport: publicTransports[EvmChainId.METIS],
  },
  [EvmChainId.MOONBEAM]: {
    chain: moonbeam,
    transport: publicTransports[EvmChainId.MOONBEAM],
  },
  [EvmChainId.MOONRIVER]: {
    chain: moonriver,
    transport: publicTransports[EvmChainId.MOONRIVER],
  },
  [EvmChainId.OPTIMISM]: {
    chain: optimism,
    transport: publicTransports[EvmChainId.OPTIMISM],
  },
  [EvmChainId.POLYGON]: {
    chain: polygon,
    transport: publicTransports[EvmChainId.POLYGON],
  },
  [EvmChainId.POLYGON_ZKEVM]: {
    chain: polygonZkEvm,
    transport: publicTransports[EvmChainId.POLYGON_ZKEVM],
  },
  [EvmChainId.THUNDERCORE]: {
    chain: thundercore,
    transport: publicTransports[EvmChainId.THUNDERCORE],
  },
  [EvmChainId.HAQQ]: {
    chain: haqq,
    transport: publicTransports[EvmChainId.HAQQ],
  },
  [EvmChainId.CORE]: {
    chain: core,
    transport: publicTransports[EvmChainId.CORE],
  },
  [EvmChainId.TELOS]: {
    chain: telos,
    transport: publicTransports[EvmChainId.TELOS],
  },
  [EvmChainId.ZKSYNC_ERA]: {
    chain: zkSync as unknown as typeof mainnet & { id: 324 },
    transport: publicTransports[EvmChainId.ZKSYNC_ERA],
  },
  [EvmChainId.LINEA]: {
    chain: linea,
    transport: publicTransports[EvmChainId.LINEA],
  },
  [EvmChainId.BASE]: {
    chain: base,
    transport: publicTransports[EvmChainId.BASE],
  },
  [EvmChainId.SCROLL]: {
    chain: scroll,
    transport: publicTransports[EvmChainId.SCROLL],
  },
  [EvmChainId.FILECOIN]: {
    chain: filecoin,
    transport: publicTransports[EvmChainId.FILECOIN],
  },
  [EvmChainId.ZETACHAIN]: {
    chain: zetachain,
    transport: publicTransports[EvmChainId.ZETACHAIN],
  },
  [EvmChainId.CRONOS]: {
    chain: cronos,
    transport: publicTransports[EvmChainId.CRONOS],
  },
  [EvmChainId.BLAST]: {
    chain: blast,
    transport: publicTransports[EvmChainId.BLAST],
  },
  [EvmChainId.SKALE_EUROPA]: {
    chain: skaleEuropa,
    transport: publicTransports[EvmChainId.SKALE_EUROPA],
  },
  [EvmChainId.ROOTSTOCK]: {
    chain: rootstock,
    transport: publicTransports[EvmChainId.ROOTSTOCK],
  },
  [EvmChainId.MANTLE]: {
    chain: mantle,
    transport: publicTransports[EvmChainId.MANTLE],
  },
  [EvmChainId.MANTA]: {
    chain: manta,
    transport: publicTransports[EvmChainId.MANTA],
  },
  [EvmChainId.MODE]: {
    chain: mode,
    transport: publicTransports[EvmChainId.MODE],
  },
  [EvmChainId.TAIKO]: {
    chain: taiko,
    transport: publicTransports[EvmChainId.TAIKO],
  },
  [EvmChainId.ZKLINK]: {
    chain: zkLinkNova,
    transport: publicTransports[EvmChainId.ZKLINK],
  },
  [EvmChainId.APE]: {
    chain: apeChain as unknown as typeof mainnet & { id: 33139 },
    transport: publicTransports[EvmChainId.APE],
  },
  [EvmChainId.SONIC]: {
    chain: sonic,
    transport: publicTransports[EvmChainId.SONIC],
  },
  [EvmChainId.HEMI]: {
    chain: hemi,
    transport: publicTransports[EvmChainId.HEMI],
  },
  [EvmChainId.KATANA]: {
    chain: katana,
    transport: publicTransports[EvmChainId.KATANA],
  },
  [EvmChainId.HYPEREVM]: {
    chain: hyperEvm,
    transport: publicTransports[EvmChainId.HYPEREVM],
  },
  /* Testnets */
  [EvmChainId.SEPOLIA]: {
    chain: sepolia,
    transport: publicTransports[EvmChainId.SEPOLIA],
  },
  [EvmChainId.TATARA]: {
    chain: tatara,
    transport: publicTransports[EvmChainId.TATARA],
  },
} as const satisfies Record<
  EvmChainId,
  PublicClientConfig & { chain: (typeof publicChains)[number] }
>
