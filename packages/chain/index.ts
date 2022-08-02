import json from './chains.json'

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
  ARBITRUM_RINKEBY_TESTNET = 421611,
  ARBITRUM_GNOSIS_TESTNET = 200,
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
  PALM_TESTNET = 11297108099,
  MOONRIVER = 1285,
  FUSE = 122,
  TELOS = 40,
  HARDHAT = 31337,
  MOONBEAM = 1284,
  OPTIMISM = 10,
  OPTIMISM_KOVAN_TESTNET = 69,
  KAVA = 2222,
  METIS = 1088,
}

export enum ChainKey {
  ARBITRUM = 'arbitrum',
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
}

export class Chain implements Chain {
  public static from(chainId: number) {
    return chains[chainId]
  }
  public static fromShortName(shortName: string) {
    return chains[chainShortName[shortName]]
  }
  public static fromChainId(chainId: number) {
    return chains[chainId]
  }

  constructor(data: Chain) {
    Object.assign(this, data)
  }
  getTxUrl(txHash: string): string {
    if (!this.explorers) return ''
    for (const explorer of this.explorers) {
      if (explorer.standard === Standard.Eip3091) {
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
      if (explorer.standard === Standard.Eip3091) {
        return `${explorer.url}/token/${tokenAddress}`
      }
    }
    return ''
  }
  getAccountUrl(accountAddress: string): string {
    if (!this.explorers) return ''
    for (const explorer of this.explorers) {
      if (explorer.standard === Standard.Eip3091) {
        return `${explorer.url}/address/${accountAddress}`
      }
    }
    return ''
  }
}

// ChainId array
export const chainIds = json.map((chain) => chain.chainId)

// Chain Short Name => Chain Id mapping
export const chainShortNameToChainId = Object.fromEntries(
  (json as Chain[]).map((data): [string, number] => [data.shortName, data.chainId])
)

// Chain Id => Short Name mapping
export const chainShortName = Object.fromEntries(
  (json as Chain[]).map((data): [number, string] => [data.chainId, data.shortName])
)

// Chain Id => Chain Name mapping
export const chainName = Object.fromEntries(
  (json as Chain[]).map((data): [number, string] => [data.chainId, data.name])
)

// Chain Id => Chain mapping
export const chains = Object.fromEntries(
  (json as Chain[]).map((data): [number, Chain] => [data.chainId, new Chain(data) as Chain])
)

export const chainsL2 = Object.fromEntries(
  (json as Chain[])
    .filter((data) => data.parent?.type === Type.L2)
    .map((data): [number, Chain] => [data.chainId, new Chain(data) as Chain])
)

export default chains
