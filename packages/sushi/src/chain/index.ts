import {
  ChainId,
  ChainKey,
  NetworkNameKey,
  NonStandardChainId,
  isChainId,
  isNetworkNameKey,
} from './constants.js'
import raw from './generated.js'

const additional = [] as const

const RAW = [...raw, ...additional] as const

const EIP3091_OVERRIDE = [
  ChainId.OPTIMISM,
  ChainId.BOBA,
  ChainId.BASE,
  ChainId.FILECOIN,
] as number[]

type Data = (typeof RAW)[number]

export interface Chain {
  name: string
  nativeCurrency: NativeCurrency
  shortName: string
  chainId: number
  explorers?: Explorer[]
  parent?: Parent
}

interface Explorer {
  name: string
  url: string
  standard: Standard
  icon?: string
}

const Standard = {
  Eip3091: 'EIP3091',
  None: 'none',
} as const

type Standard = (typeof Standard)[keyof typeof Standard]

interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}

interface Parent {
  type: Type
  chain: string
  bridges?: Bridge[]
}

interface Bridge {
  url: string
}

const Type = {
  L2: 'L2',
  Shard: 'shard',
} as const
type Type = (typeof Type)[keyof typeof Type]

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: explaination
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
    return Chain.fromChainId(chainId)?.getTxUrl(txHash) ?? ''
  }
  public static blockUrl(chainId: number, blockHashOrHeight: string): string {
    return Chain.fromChainId(chainId)?.getBlockUrl(blockHashOrHeight) ?? ''
  }
  public static tokenUrl(chainId: number, tokenAddress: string): string {
    return Chain.fromChainId(chainId)?.getTokenUrl(tokenAddress) ?? ''
  }
  public static accountUrl(chainId: number, accountAddress: string): string {
    return Chain.fromChainId(chainId)?.getAccountUrl(accountAddress) ?? ''
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
    if (data.chainId === ChainId.SCROLL) {
      this.explorers?.sort((explorer) =>
        explorer.name === 'Scrollscan' ? -1 : 1,
      )
    } else if (data.chainId === ChainId.ARBITRUM_NOVA) {
      this.explorers = [
        {
          name: 'Arbitrum Nova Explorer',
          url: 'https://nova.arbiscan.io',
          standard: 'EIP3091',
        },
        ...(this.explorers ?? []),
      ]
    } else if (data.chainId === ChainId.FILECOIN) {
      this.name = 'Filecoin'
      this.explorers?.sort((explorer) => (explorer.name === 'Filfox' ? -1 : 1))
    } else if (data.chainId === ChainId.ZETACHAIN) {
      this.name = 'ZetaChain'
      this.explorers = [
        {
          name: 'ZetaChain Mainnet Explorer',
          url: 'https://zetachain.blockscout.com',
          standard: 'EIP3091',
        },
      ]
    } else if (data.chainId === ChainId.BLAST) {
      this.explorers = [
        {
          name: 'Blast Explorer',
          url: 'https://blastscan.io',
          standard: 'EIP3091',
        },
      ]
    } else if (data.chainId === ChainId.SKALE_EUROPA) {
      this.name = 'SKALE Europa'
    } else if (data.chainId === ChainId.ROOTSTOCK) {
      this.explorers?.sort((explorer) =>
        explorer.name === 'blockscout' ? -1 : 1,
      )
    } else if (data.chainId === ChainId.MOONBEAM) {
      this.explorers = [
        {
          name: 'Moonscan',
          url: 'https://moonscan.io',
          standard: 'EIP3091',
        },
      ]
    }
  }
  getTxUrl(txHash: string): string {
    if (!this.explorers) return ''
    for (const explorer of this.explorers) {
      if (
        explorer.standard === Standard.Eip3091 ||
        EIP3091_OVERRIDE.includes(this.chainId)
      ) {
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
      if (
        explorer.standard === Standard.Eip3091 ||
        EIP3091_OVERRIDE.includes(this.chainId)
      ) {
        return `${explorer.url}/token/${tokenAddress}`
      }
    }
    return ''
  }
  getAccountUrl(accountAddress: string): string {
    if (!this.explorers) return ''
    for (const explorer of this.explorers) {
      if (
        explorer.standard === Standard.Eip3091 ||
        EIP3091_OVERRIDE.includes(this.chainId)
      ) {
        return `${explorer.url}/address/${accountAddress}`
      }
    }
    return ''
  }
}

export const natives = Object.fromEntries(
  RAW.map((data): [ChainId, NativeCurrency] => [
    data.chainId,
    data.nativeCurrency,
  ]),
)

// Chain Id => Chain mapping
export const chains = Object.fromEntries(
  RAW.map((data): [ChainId, Chain] => [data.chainId, new Chain(data)]),
)

// Chain Id => Chain mapping
export const chainsL2 = Object.fromEntries(
  RAW.filter((data) => 'parent' in data && data.parent.type === Type.L2).map(
    (data): [ChainId, Chain] => [data.chainId, new Chain(data)],
  ),
)

// ChainId array
export const chainIds = RAW.map((chain) => chain.chainId)

// Chain Short Name => Chain Id mapping
export const chainShortNameToChainId = Object.fromEntries(
  RAW.map((data): [string, number] => [data.shortName, data.chainId]),
)

// Chain Id => Short Name mapping
export const chainShortName = Object.fromEntries(
  RAW.map((data): [number, string] => [
    data.chainId,
    Chain.fromRaw(data).shortName,
  ]),
)

// Chain Id => Chain Name mapping
export const chainName = Object.fromEntries(
  RAW.map((data): [number, string] => [data.chainId, Chain.fromRaw(data).name]),
)

export const getChainInfo = (
  input: string,
):
  | { chainId: ChainId; networkName: ChainKey }
  | { chainId: undefined; networkName: undefined } => {
  const _networkName = input.toLowerCase()
  const _chainId = parseInt(input)

  if (isChainId(_chainId)) {
    const networkName = ChainKey[_chainId]
    return { chainId: _chainId, networkName }
  }

  if (isNetworkNameKey(_networkName)) {
    const chainId = NetworkNameKey[_networkName]
    return { chainId, networkName: _networkName }
  }

  return { chainId: undefined, networkName: undefined }
}

interface NonStandardChain extends Omit<Chain, 'chainId'> {
  chainId: string
}

export const NonStandardChains = {
  [NonStandardChainId.APTOS]: {
    name: 'Aptos',
    nativeCurrency: {
      name: 'Aptos',
      symbol: 'APT',
      decimals: 8,
    },

    shortName: 'aptos',
    chainId: 'aptos',
  },
} as Record<NonStandardChainId, NonStandardChain>

export * from './constants.js'

export default chains
