import { ChainId } from './constants'
import raw from './generated'

const additional = [] as const

const RAW = [...raw, ...additional] as const

const EIP3091_OVERRIDE = [ChainId.OPTIMISM, ChainId.BOBA, ChainId.BASE] as number[]

type Data = (typeof RAW)[number]

export interface Chain {
  name: string
  nativeCurrency: NativeCurrency
  shortName: string
  chainId: number
  explorers?: Explorer[]
  parent?: Parent
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

export * from './constants'

export default chains
