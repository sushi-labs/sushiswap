import type { PoolId } from 'sushi/types'
import { SushiSwapProtocol, SushiSwapV2Protocol } from 'sushi/types'
import type { SushiSwapV2ChainId } from '../../config/sushiswap-v2'

export type PoolV2<T extends PoolId = PoolId> = T &
  Omit<PoolId, 'chainId' | 'protocol'> & {
    chainId: SushiSwapV2ChainId
    protocol: SushiSwapV2Protocol
  }

export function isPoolV2<T extends PoolV2>(pool: PoolId): pool is T {
  return pool.protocol === SushiSwapProtocol.SUSHISWAP_V2
}
