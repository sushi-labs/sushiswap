import {
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  type SushiSwapV3ChainId,
} from 'sushi/evm'
import type { SushiSwapV4Deployment } from './types'

/**
 * Temporary exports until SushiSwap V4 deployment config is generated in the
 * `sushi` package.
 */
export const SUSHISWAP_V4_SUPPORTED_CHAIN_IDS = SUSHISWAP_V3_SUPPORTED_CHAIN_IDS

export type SushiSwapV4ChainId = SushiSwapV3ChainId

/**
 * Populate this map with the deployed Infinity contracts. Keeping it empty
 * prevents the frontend from constructing transactions with guessed addresses.
 */
export const SUSHISWAP_V4_DEPLOYMENTS: Partial<
  Record<SushiSwapV4ChainId, SushiSwapV4Deployment>
> = {}

export function isSushiSwapV4ChainId(
  chainId: number,
): chainId is SushiSwapV4ChainId {
  return SUSHISWAP_V4_SUPPORTED_CHAIN_IDS.includes(
    chainId as SushiSwapV4ChainId,
  )
}

export function getSushiSwapV4Deployment(
  chainId: number,
): SushiSwapV4Deployment | undefined {
  return isSushiSwapV4ChainId(chainId)
    ? SUSHISWAP_V4_DEPLOYMENTS[chainId]
    : undefined
}
