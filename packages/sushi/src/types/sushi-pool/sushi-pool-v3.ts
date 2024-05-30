import {
  type SushiPoolBase,
  SushiSwapProtocol,
  type SushiSwapV3Protocol,
} from 'sushi/types'
import type { SushiSwapV3ChainId } from '../../config/sushiswap-v3'

type Extension = {
  sqrtPrice: bigint
  tick: bigint
  observationIndex: bigint
  feeGrowthGlobal0X128: bigint
  feeGrowthGlobal1X128: bigint
}

export type SushiPoolV3 = Omit<SushiPoolBase, 'chainId' | 'protocol'> & {
  chainId: SushiSwapV3ChainId
  protocol: SushiSwapV3Protocol
} & Extension

export function isSushiPoolV3<T extends SushiPoolV3>(
  pool: SushiPoolBase,
): pool is T {
  return pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
}
