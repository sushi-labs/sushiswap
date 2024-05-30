import type { SushiPoolBase } from 'sushi/types'
import { SushiSwapProtocol, SushiSwapV2Protocol } from 'sushi/types'
import type { SushiSwapV2ChainId } from '../../config/sushiswap-v2'

export type SushiPoolV2 = Omit<SushiPoolBase, 'chainId' | 'protocol'> & {
  chainId: SushiSwapV2ChainId
  protocol: SushiSwapV2Protocol
}

export function isSushiPoolV2<T extends SushiPoolV2>(
  pool: SushiPoolBase,
): pool is T {
  return pool.protocol === SushiSwapProtocol.SUSHISWAP_V2
}
