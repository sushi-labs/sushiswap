import { EvmChainId } from 'sushi/evm'

/**
 * Initial EVM-only chain matrix for the agentic swap bug hunt.
 *
 * Keep this list deliberately small enough to run every chain on every change.
 * Additional Sushi-supported chains belong in an opt-in discovery shard first.
 */
export const TESTED_CHAIN_IDS = [
  EvmChainId.ETHEREUM,
  EvmChainId.BASE,
  EvmChainId.ARBITRUM,
  EvmChainId.POLYGON,
  EvmChainId.OPTIMISM,
  EvmChainId.BSC,
  EvmChainId.ROBINHOOD,
] as const

export type TestedChainId = (typeof TESTED_CHAIN_IDS)[number]

export interface TestedChain {
  readonly chainId: TestedChainId
  readonly name: string
  readonly slug: string
  readonly nativeSymbol: string
  readonly priority: 'core' | 'extended'
}

export const TESTED_CHAINS = [
  {
    chainId: EvmChainId.ETHEREUM,
    name: 'Ethereum',
    slug: 'ethereum',
    nativeSymbol: 'ETH',
    priority: 'core',
  },
  {
    chainId: EvmChainId.BASE,
    name: 'Base',
    slug: 'base',
    nativeSymbol: 'ETH',
    priority: 'core',
  },
  {
    chainId: EvmChainId.ARBITRUM,
    name: 'Arbitrum',
    slug: 'arbitrum',
    nativeSymbol: 'ETH',
    priority: 'core',
  },
  {
    chainId: EvmChainId.POLYGON,
    name: 'Polygon',
    slug: 'polygon',
    nativeSymbol: 'POL',
    priority: 'core',
  },
  {
    chainId: EvmChainId.OPTIMISM,
    name: 'Optimism',
    slug: 'optimism',
    nativeSymbol: 'ETH',
    priority: 'core',
  },
  {
    chainId: EvmChainId.BSC,
    name: 'BNB Smart Chain',
    slug: 'bsc',
    nativeSymbol: 'BNB',
    priority: 'core',
  },
  {
    chainId: EvmChainId.ROBINHOOD,
    name: 'Robinhood Chain',
    slug: 'robinhood',
    nativeSymbol: 'ETH',
    priority: 'extended',
  },
] as const satisfies readonly TestedChain[]
