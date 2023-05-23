import raw from './generated'

export interface Chain {
  name: string
  chain: string
  icon?: string
  rpc: string[]
  faucets: string[]
  nativeCurrency: NativeCurrency
  infoURL: string
  shortName: string
  chainId: number
  networkId: number
  slip44?: number
  ens?: Ens
  explorers?: Explorer[]
  title?: string
  parent?: Parent
  network?: Network
}

export interface Ens {
  registry: string
}

export interface Explorer {
  name: string
  url: string
  standard: Standard
  icon?: string
}

export const Standard = {
  Eip3091: 'EIP3091',
  None: 'none',
} as const
export type Standard = (typeof Standard)[keyof typeof Standard]

export interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}

export const Network = {
  Iorachain: 'iorachain',
  Mainnet: 'mainnet',
  Testnet: 'testnet',
} as const
export type Network = (typeof Network)[keyof typeof Network]

export interface Parent {
  type: Type
  chain: string
  bridges?: Bridge[]
}

export interface Bridge {
  url: string
}

export const Type = {
  L2: 'L2',
  Shard: 'shard',
} as const
export type Type = (typeof Type)[keyof typeof Type]

export const ChainId = {
  ETHEREUM: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GÖRLI: 5,
  KOVAN: 42,
  POLYGON: 137,
  POLYGON_TESTNET: 80001,
  FANTOM: 250,
  FANTOM_TESTNET: 4002,
  GNOSIS: 100,
  BSC: 56,
  BSC_TESTNET: 97,
  ARBITRUM: 42161,
  ARBITRUM_NOVA: 42170,
  ARBITRUM_TESTNET: 79377087078960,
  AVALANCHE: 43114,
  AVALANCHE_TESTNET: 43113,
  HECO: 128,
  HECO_TESTNET: 256,
  HARMONY: 1666600000,
  HARMONY_TESTNET: 1666700000,
  OKEX: 66,
  OKEX_TESTNET: 65,
  CELO: 42220,
  PALM: 11297108109,
  MOONRIVER: 1285,
  FUSE: 122,
  TELOS: 40,
  MOONBEAM: 1284,
  OPTIMISM: 10,
  KAVA: 2222,
  METIS: 1088,
  BOBA: 288,
  BOBA_AVAX: 43288,
  BOBA_BNB: 56288,
  BTTC: 199,
  // SEPOLIA: 11155111,
  // CONSENSUS_ZKEVM_TESTNET: 59140,
  // SCROLL_ALPHA_TESTNET: 534353,
  // BASE_TESTNET: 84531,
  POLYGON_ZKEVM: 1101,
  THUNDERCORE: 108,
  // FILECOIN: 314,
} as const
export type ChainId = (typeof ChainId)[keyof typeof ChainId]

// export const isChainId = (chainId: number): chainId is ChainId => Object.values(ChainId).includes(chainId as ChainId)

export const ChainKey = {
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.ARBITRUM_NOVA]: 'arbitrum-nova',
  [ChainId.ARBITRUM_TESTNET]: 'arbitrum-testnet',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.AVALANCHE_TESTNET]: 'avalance-testnet',
  [ChainId.BSC]: 'bsc',
  [ChainId.BSC_TESTNET]: 'bsc-testnet',
  [ChainId.CELO]: 'celo',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.FANTOM_TESTNET]: 'fantom-testnet',
  [ChainId.FUSE]: 'fuse',
  [ChainId.GÖRLI]: 'goerli',
  [ChainId.HARMONY]: 'harmony',
  [ChainId.HARMONY_TESTNET]: 'harmony-testnet',
  [ChainId.HECO]: 'heco',
  [ChainId.HECO_TESTNET]: 'heco-testnet',
  [ChainId.KOVAN]: 'kovan',
  [ChainId.ROPSTEN]: 'ropsten',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.POLYGON_TESTNET]: 'matic-testnet',
  [ChainId.MOONBEAM]: 'moonbeam',
  // [ChainId.MOONBEAM_TESTNET]: 'moonbeam-testnet',
  [ChainId.MOONRIVER]: 'moonriver',
  [ChainId.OKEX]: 'okex',
  [ChainId.OKEX_TESTNET]: 'okex-testnet',
  [ChainId.PALM]: 'palm',
  // [ChainId.PALM_TESTNET]: 'palm-testnet',
  [ChainId.RINKEBY]: 'rinkeby',
  [ChainId.TELOS]: 'telos',
  [ChainId.GNOSIS]: 'gnosis',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.KAVA]: 'kava',
  [ChainId.METIS]: 'metis',
  [ChainId.BOBA]: 'boba',
  [ChainId.BOBA_AVAX]: 'boba-avax',
  [ChainId.BOBA_BNB]: 'boba-bnb',
  [ChainId.BTTC]: 'bttc',
  // [ChainId.CONSENSUS_ZKEVM_TESTNET]: 'consensus-zkevm-testnet',
  // [ChainId.SCROLL_ALPHA_TESTNET]: 'scroll-alpha-testnet',
  // [ChainId.BASE_TESTNET]:'base-testnet',
  [ChainId.POLYGON_ZKEVM]: 'polygon-zkevm',
  [ChainId.THUNDERCORE]: 'thundercore',
  // [ChainId.FILECOIN]: 'filecoin',
  // [ChainId.SEPOLIA]: 'sepolia',
} as const
export type ChainKey = (typeof ChainKey)[keyof typeof ChainKey]

const additional = [
  // {
  //   name: 'Scroll Alpha Testnet',
  //   chain: 'Scroll',
  //   rpc: ['https://alpha-rpc.scroll.io/l2'],
  //   faucets: [],
  //   features: [],
  //   nativeCurrency: {
  //     name: 'Ethereum',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  //   infoURL: 'https://scroll.io',
  //   shortName: 'scrollalpha',
  //   chainId: 534353,
  //   networkId: 534353,
  //   explorers: [
  //     {
  //       name: 'Scroll Alpha Explorer',
  //       url: 'https://blockscout.scroll.io',
  //       standard: Standard.None,
  //     },
  //   ],
  // },
  // {
  //   name: 'ConsenSys zkEVM Goreli',
  //   chain: 'ConsenSys zkEVM',
  //   rpc: ['https://consensys-zkevm-goerli-prealpha.infura.io/v3/53fca4c2b95a43cca82a11e8b573256b'],
  //   faucets: [],
  //   nativeCurrency: {
  //     name: 'Ethereum',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  //   infoURL: 'https://docs.zkevm.consensys.net',
  //   shortName: 'consensuszkevmgoerli',
  //   chainId: 59140,
  //   networkId: 59140,
  //   explorers: [
  //     {
  //       name: 'ConsenSys zkEVM Goreli Explorer',
  //       url: 'https://explorer.goerli.zkevm.consensys.net',
  //       standard: Standard.None,
  //     },
  //   ],
  // },
  // {
  //   name: 'Base Goreli',
  //   chain: 'Base',
  //   rpc: ['https://goerli.base.org'],
  //   faucets: [],
  //   nativeCurrency: {
  //     name: 'Ethereum',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  //   infoURL: 'https://docs.base.org',
  //   shortName: 'basegoerli',
  //   chainId: 84531,
  //   networkId: 84531,
  //   explorers: [
  //     {
  //       name: 'Base Goreli Explorer',
  //       url: 'https://goerli.basescan.org',
  //       standard: Standard.Eip3091,
  //     },
  //   ],
  // },
  // {
  //   name: 'ThunderCore',
  //   chain: 'ThunderCore',
  //   rpc: [
  //     'https://mainnet-rpc.thundercore.io',
  //     'https://mainnet-rpc.thundercore.com',
  //     'https://mainnet-rpc.thundertoken.net',
  //   ],
  //   faucets: [],
  //   nativeCurrency: {
  //     name: 'Thunder Token',
  //     symbol: 'TT',
  //     decimals: 18,
  //   },
  //   infoURL: 'https://docs.developers.thundercore.com',
  //   shortName: 'thundercore',
  //   chainId: 108,
  //   networkId: 108,
  //   explorers: [
  //     {
  //       name: 'ThunderCore Explorer',
  //       url: 'https://viewblock.io/thundercore',
  //       standard: Standard.None,
  //     },
  //   ],
  // },
] as const

const RAW = [...raw, ...additional] as const

const EIP3091_OVERRIDE = [ChainId.OPTIMISM, ChainId.BOBA] as number[]

type Data = (typeof RAW)[number]

export class Chain implements Chain {
  public static fromRaw(data: Data) {
    return new Chain(data)
  }
  public static from(chainId: number) {
    return chains[chainId]
  }
  public static fromShortName(shortName: string) {
    const chainId = chainShortNameToChainId[shortName]
    if (!chainId) throw new Error(`Unknown chain short name: ${shortName}`)
    return Chain.from(chainId)
  }
  public static fromChainId(chainId: number) {
    return Chain.from(chainId)
  }
  public static txUrl(chainId: number, txHash: string): string {
    return Chain.fromChainId(chainId).getTxUrl(txHash)
  }
  public static blockUrl(chainId: number, blockHashOrHeight: string): string {
    return Chain.fromChainId(chainId).getBlockUrl(blockHashOrHeight)
  }
  public static tokenUrl(chainId: number, tokenAddress: string): string {
    return Chain.fromChainId(chainId).getTokenUrl(tokenAddress)
  }
  public static accountUrl(chainId: number, accountAddress: string): string {
    return Chain.fromChainId(chainId).getAccountUrl(accountAddress)
  }
  constructor(data: Data) {
    Object.assign(this, data)

    // process name overrides
    const targets = ['Mainnet', 'Opera', 'Mainnet Shard 0']
    for (const target of targets) {
      if (data.name.includes(target)) {
        this.name = data.name.replace(target, '').trim()
      }
    }

    if (data.name === 'Boba Network') {
      this.name = 'Boba Eth'
    }

    // process explorer overrides etc...
  }
  getTxUrl(txHash: string): string {
    if (!this.explorers) return ''
    for (const explorer of this.explorers) {
      if (explorer.standard === Standard.Eip3091 || EIP3091_OVERRIDE.includes(this.chainId)) {
        return `${explorer.url}/tx/${txHash}`
      }
    }
    return ''
  }
  getBlockUrl(blockHashOrHeight: string): string {
    if (!this.explorers) return ''
    for (const explorer of this.explorers) {
      if (explorer.standard === Standard.Eip3091) {
        return `${explorer.url}/block/${blockHashOrHeight}`
      }
    }
    return ''
  }
  getTokenUrl(tokenAddress: string): string {
    if (!this.explorers) return ''
    for (const explorer of this.explorers) {
      if (explorer.standard === Standard.Eip3091 || EIP3091_OVERRIDE.includes(this.chainId)) {
        return `${explorer.url}/token/${tokenAddress}`
      }
    }
    return ''
  }
  getAccountUrl(accountAddress: string): string {
    if (!this.explorers) return ''
    for (const explorer of this.explorers) {
      if (explorer.standard === Standard.Eip3091 || EIP3091_OVERRIDE.includes(this.chainId)) {
        return `${explorer.url}/address/${accountAddress}`
      }
    }
    return ''
  }
}

// Chain Id => Chain mapping
export const chains = Object.fromEntries(RAW.map((data): [ChainId, Chain] => [data.chainId, new Chain(data)]))

// Chain Id => Chain mapping
export const chainsL2 = Object.fromEntries(
  RAW.filter((data) => 'parent' in data && data.parent.type === Type.L2).map((data): [ChainId, Chain] => [
    data.chainId,
    new Chain(data),
  ])
)

// ChainId array
export const chainIds = RAW.map((chain) => chain.chainId)

// Chain Short Name => Chain Id mapping
export const chainShortNameToChainId = Object.fromEntries(
  RAW.map((data): [string, number] => [data.shortName, data.chainId])
)

// Chain Id => Short Name mapping
export const chainShortName = Object.fromEntries(
  RAW.map((data): [number, string] => [data.chainId, Chain.fromRaw(data).shortName])
)

// Chain Id => Chain Name mapping
export const chainName = Object.fromEntries(
  RAW.map((data): [number, string] => [data.chainId, Chain.fromRaw(data).name])
)

export default chains
