import {
  LIFI_XSWAP_SUPPORTED_CHAIN_IDS,
  SUPPORTED_NETWORKS,
  getSortedChainIds,
  isSupportedChainId,
} from 'src/config'
import { isEvmChainId } from 'sushi/evm'
import { MvmChainId } from 'sushi/mvm'
import { STELLAR_USDT0, STELLAR_XLM, StellarChainId } from 'sushi/stellar'
import {
  getDefaultCurrency,
  getQuoteCurrency,
} from '~evm/[chainId]/(trade)/_ui/derivedstate-swap-helpers'
import { NEAR_INTENTS_SUPPORTED_CHAIN_IDS } from './near-intents'

export const UNIFIED_SWAP_CHAIN_IDS = getSortedChainIds([
  ...SUPPORTED_NETWORKS.filter((chainId) => chainId !== MvmChainId.APTOS),
  ...LIFI_XSWAP_SUPPORTED_CHAIN_IDS,
  ...NEAR_INTENTS_SUPPORTED_CHAIN_IDS,
])
export type UnifiedSwapChainId = (typeof UNIFIED_SWAP_CHAIN_IDS)[number]

export function isUnifiedSwapChainId(
  chainId: number,
): chainId is UnifiedSwapChainId {
  return UNIFIED_SWAP_CHAIN_IDS.some((id) => id === chainId)
}

export function getUnifiedSwapDefaultToken(
  chainId: UnifiedSwapChainId,
  side: 'INPUT' | 'OUTPUT',
): string | undefined {
  if (chainId === StellarChainId.STELLAR)
    return (side === 'INPUT' ? STELLAR_XLM[chainId] : STELLAR_USDT0[chainId])
      .address
  if (isSupportedChainId(chainId))
    return side === 'INPUT'
      ? getDefaultCurrency(chainId)
      : getQuoteCurrency(chainId)
  return undefined
}

export function getUnifiedSwapParams(
  search: string,
  defaultChainId: UnifiedSwapChainId,
): URLSearchParams {
  const params = new URLSearchParams(search)
  const source = Number(params.get('chainId0'))
  const chainId0 = isUnifiedSwapChainId(source) ? source : defaultChainId
  const destination = Number(params.get('chainId1'))
  const chainId1 = isUnifiedSwapChainId(destination) ? destination : chainId0
  params.set('chainId0', String(chainId0))
  params.set('chainId1', String(chainId1))
  for (const [side, chainId, key] of [
    ['INPUT', chainId0, 'token0'],
    ['OUTPUT', chainId1, 'token1'],
  ] as const) {
    const token = getUnifiedSwapDefaultToken(chainId, side)
    if (!params.has(key) && token) params.set(key, token)
  }
  return params
}

export function switchUnifiedSwapTokens(
  current: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(current)
  for (const [left, right] of [
    ['chainId0', 'chainId1'],
    ['token0', 'token1'],
  ]) {
    const a = current.get(left)
    const b = current.get(right)
    if (b === null) params.delete(left)
    else params.set(left, b)
    if (a === null) params.delete(right)
    else params.set(right, a)
  }
  params.delete('swapAmount')
  return params
}

export function selectUnifiedSwapToken(
  current: URLSearchParams,
  side: 'INPUT' | 'OUTPUT',
  chainId: UnifiedSwapChainId,
  tokenParam: string,
): URLSearchParams {
  const index = side === 'INPUT' ? 0 : 1
  const opposite = 1 - index
  const otherToken = current.get(`token${opposite}`)
  const sameToken = isEvmChainId(chainId)
    ? otherToken?.toLowerCase() === tokenParam.toLowerCase()
    : otherToken === tokenParam
  if (Number(current.get(`chainId${opposite}`)) === chainId && sameToken)
    return switchUnifiedSwapTokens(current)
  const params = new URLSearchParams(current)
  if (
    side === 'INPUT' &&
    (Number(current.get('chainId0')) !== chainId ||
      chainId === StellarChainId.STELLAR)
  )
    params.delete('swapAmount')
  params.set(`chainId${index}`, String(chainId))
  params.set(`token${index}`, tokenParam)
  return params
}

// A completed transaction must not restore a pair or amount edited while it was pending.
export function isCurrentUnifiedSwapInput(
  snapshot: URLSearchParams,
  current: URLSearchParams,
): boolean {
  return ['chainId0', 'chainId1', 'token0', 'token1', 'swapAmount'].every(
    (key) => snapshot.get(key) === current.get(key),
  )
}
