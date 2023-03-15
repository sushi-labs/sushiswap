import raw from './chains'

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

export enum Standard {
  Eip3091 = 'EIP3091',
  None = 'none',
}

export interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}

export enum Network {
  Iorachain = 'iorachain',
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export interface Parent {
  type: Type
  chain: string
  bridges?: Bridge[]
}

export interface Bridge {
  url: string
}

export enum Type {
  L2 = 'L2',
  Shard = 'shard',
}

// ????
// export const ChainId = {
//   ETHEREUM: 1,
//   ROPSTEN: 3,
//   RINKEBY: 4,
//   GÖRLI: 5,
//   KOVAN: 42,
//   POLYGON: 137,
//   POLYGON_TESTNET: 80001,
//   FANTOM: 250,
//   FANTOM_TESTNET: 4002,
//   GNOSIS: 100,
//   BSC: 56,
//   BSC_TESTNET: 97,
//   ARBITRUM: 42161,
//   ARBITRUM_NOVA: 42170,
//   ARBITRUM_TESTNET: 79377087078960,
//   AVALANCHE: 43114,
//   AVALANCHE_TESTNET: 43113,
//   HECO: 128,
//   HECO_TESTNET: 256,
//   HARMONY: 1666600000,
//   HARMONY_TESTNET: 1666700000,
//   OKEX: 66,
//   OKEX_TESTNET: 65,
//   CELO: 42220,
//   PALM: 11297108109,
//   MOONRIVER: 1285,
//   FUSE: 122,
//   TELOS: 40,
//   MOONBEAM: 1284,
//   OPTIMISM: 10,
//   KAVA: 2222,
//   METIS: 1088,
//   BOBA: 288,
//   BOBA_AVAX: 43288,
//   BOBA_BNB: 56288,
//   BTTC: 199,
// } as const

// export type ChainId = (typeof ChainId)[keyof typeof ChainId]

// export const isChainId = (chainId: number): chainId is ChainId => Object.values(ChainId).includes(chainId as ChainId)

export enum ChainId {
  ETHEREUM = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  POLYGON = 137,
  POLYGON_TESTNET = 80001,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  GNOSIS = 100,
  BSC = 56,
  BSC_TESTNET = 97,
  ARBITRUM = 42161,
  ARBITRUM_NOVA = 42170,
  ARBITRUM_TESTNET = 79377087078960,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  HECO = 128,
  HECO_TESTNET = 256,
  HARMONY = 1666600000,
  HARMONY_TESTNET = 1666700000,
  OKEX = 66,
  OKEX_TESTNET = 65,
  CELO = 42220,
  PALM = 11297108109,
  MOONRIVER = 1285,
  FUSE = 122,
  TELOS = 40,
  MOONBEAM = 1284,
  OPTIMISM = 10,
  KAVA = 2222,
  METIS = 1088,
  BOBA = 288,
  BOBA_AVAX = 43288,
  BOBA_BNB = 56288,
  BTTC = 199,
  // SEPOLIA = 11155111,
  CONSENSUS_ZKEVM_TESTNET = 59140,
  SCROLL_ALPHA_TESTNET = 534353,
}

export enum ChainKey {
  ARBITRUM = 'arbitrum',
  ARBITRUM_NOVA = 'arbitrum-nova',
  ARBITRUM_TESTNET = 'arbitrum-testnet',
  AVALANCHE = 'avalanche',
  AVALANCHE_TESTNET = 'avalance-testnet',
  BSC = 'bsc',
  BSC_TESTNET = 'bsc-testnet',
  CELO = 'celo',
  ETHEREUM = 'ethereum',
  FANTOM = 'fantom',
  FANTOM_TESTNET = 'fantom-testnet',
  FUSE = 'fuse',
  GÖRLI = 'goerli',
  HARMONY = 'harmony',
  HARMONY_TESTNET = 'harmony-testnet',
  HECO = 'heco',
  HECO_TESTNET = 'heco-testnet',
  KOVAN = 'kovan',
  ROPSTEN = 'ropsten',
  POLYGON = 'polygon',
  POLYGON_TESTNET = 'matic-testnet',
  MOONBEAM = 'moonbeam',
  MOONBEAM_TESTNET = 'moonbeam-testnet',
  MOONRIVER = 'moonriver',
  OKEX = 'okex',
  OKEX_TESTNET = 'okex-testnet',
  PALM = 'palm',
  PALM_TESTNET = 'palm-testnet',
  RINKEBY = 'rinkeby',
  TELOS = 'telos',
  GNOSIS = 'gnosis',
  OPTIMISM = 'optimism',
  KAVA = 'kava',
  METIS = 'metis',
  BOBA = 'boba',
  BOBA_AVAX = 'boba-avax',
  BOBA_BNB = 'boba-bnb',
  BTTC = 'bttc',
  // SEPOLIA = 'sepolia',
}

// const CHAINS = [
//   ...raw,
//   {
//     name: 'Boba Avax',
//     chain: 'Boba Avax',
//     rpc: ['https://avax.boba.network', 'wss://wss.avax.boba.network', 'https://replica.avax.boba.network'],
//     faucets: [],
//     nativeCurrency: {
//       name: 'Boba Token',
//       symbol: 'BOBA',
//       decimals: 18,
//     },
//     infoURL: 'https://boba.network',
//     shortName: 'bobaavax',
//     chainId: 43288,
//     networkId: 43288,
//     explorers: [
//       {
//         name: 'Boba Avax Explorer',
//         url: 'https://blockexplorer.avax.boba.network',
//         standard: Standard.None,
//       },
//     ],
//   },
//   {
//     name: 'Boba BNB',
//     chain: 'Boba BNB',
//     rpc: ['https://bnb.boba.network', 'wss://wss.bnb.boba.network', 'https://replica.bnb.boba.network'],
//     faucets: [],
//     nativeCurrency: {
//       name: 'Boba Token',
//       symbol: 'BOBA',
//       decimals: 18,
//     },
//     infoURL: 'https://boba.network',
//     shortName: 'bobabnb',
//     chainId: 56288,
//     networkId: 56288,
//     explorers: [
//       {
//         name: 'Boba BNB Explorer',
//         url: 'https://blockexplorer.bnb.boba.network',
//         standard: Standard.None,
//       },
//     ],
//   },
// ] as const

const additional = [
  {
    name: 'Scroll Alpha Testnet',
    chain: 'Scroll',
    rpc: ['https://alpha-rpc.scroll.io/l2'],
    faucets: [],
    features: [],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://scroll.io',
    shortName: 'scrollalpha',
    chainId: 534353,
    networkId: 534353,
    explorers: [
      {
        name: 'Scroll Alpha Explorer',
        url: 'https://blockscout.scroll.io',
        standard: Standard.None,
      },
    ],
  },
  {
    name: 'ConsenSys zkEVM Goreli',
    chain: 'ConsenSys zkEVM',
    rpc: ['https://consensys-zkevm-goerli-prealpha.infura.io/v3'],
    faucets: [],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://docs.zkevm.consensys.net',
    shortName: 'consensuszkevmgoerli',
    chainId: 59140,
    networkId: 59140,
    explorers: [
      {
        name: 'ConsenSys zkEVM Goreli Explorer',
        url: 'https://explorer.goerli.zkevm.consensys.net',
        standard: Standard.None,
      },
    ],
  },
] as const

const RAW = [...raw, ...additional] as const

const EIP3091_OVERRIDE = [ChainId.OPTIMISM, ChainId.BOBA]

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
export const chainIds = raw.map((chain) => chain.chainId)

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
