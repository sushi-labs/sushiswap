import type { ChainId } from '../../chain/constants.js'
import {
  SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
} from '../features/index.js'
import type { SushiSwapV2ChainId } from './sushiswap-v2.js'
import type { SushiSwapV3ChainId } from './sushiswap-v3.js'

export const SUSHISWAP_SUPPORTED_CHAIN_IDS = Array.from(
  new Set([
    ...SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
    ...SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  ]),
) as Readonly<(SushiSwapV2ChainId | SushiSwapV3ChainId)[]>

export const SushiSwapChainIds = SUSHISWAP_SUPPORTED_CHAIN_IDS

export type SushiSwapChainId = (typeof SUSHISWAP_SUPPORTED_CHAIN_IDS)[number]

export function isSushiSwapChainId(
  chainId: ChainId,
): chainId is SushiSwapChainId {
  return SUSHISWAP_SUPPORTED_CHAIN_IDS.includes(chainId as SushiSwapChainId)
}
