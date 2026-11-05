import { BUY_ETH_ADDRESS } from '@cowprotocol/cow-sdk'
import { type EvmAddress, EvmChainId } from 'sushi/evm'

// Ink also supports CoW, but needs Sushi token-list, pricing and chain support.
export const COW_LIMIT_CHAIN_IDS = [
  EvmChainId.ETHEREUM,
  EvmChainId.ARBITRUM,
  EvmChainId.BASE,
  EvmChainId.GNOSIS,
  EvmChainId.POLYGON,
  EvmChainId.AVALANCHE,
  EvmChainId.BSC,
  EvmChainId.LINEA,
  EvmChainId.PLASMA,
] as const

export type CowLimitChainId = (typeof COW_LIMIT_CHAIN_IDS)[number]

export function isCowLimitChainId(chainId: number): chainId is CowLimitChainId {
  return COW_LIMIT_CHAIN_IDS.some((id) => id === chainId)
}

export const COW_APP_CODE = 'Sushi'
// CoW's marker for receiving the chain's native token.
export const COW_NATIVE_BUY_ADDRESS = BUY_ETH_ADDRESS as EvmAddress
export const COW_EXPIRATIONS = [
  { label: '1 day', seconds: 86_400 },
  { label: '1 week', seconds: 604_800 },
  { label: '30 days', seconds: 2_592_000 },
  { label: '1 year', seconds: 31_536_000 },
] as const
export const COW_DEFAULT_EXPIRATION = 604_800

const EXPLORER_NETWORKS: Record<CowLimitChainId, string> = {
  [EvmChainId.ETHEREUM]: 'mainnet',
  [EvmChainId.ARBITRUM]: 'arb1',
  [EvmChainId.BASE]: 'base',
  [EvmChainId.GNOSIS]: 'gc',
  [EvmChainId.POLYGON]: 'polygon',
  [EvmChainId.AVALANCHE]: 'avalanche',
  [EvmChainId.BSC]: 'bnb',
  [EvmChainId.LINEA]: 'linea',
  [EvmChainId.PLASMA]: 'plasma',
}

export function getCowOrderLink(chainId: CowLimitChainId, uid: string): string {
  return `https://explorer.cow.fi/${EXPLORER_NETWORKS[chainId]}/orders/${encodeURIComponent(uid)}`
}
