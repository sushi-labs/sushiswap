import {
  SushiSwapProtocol,
  type SushiSwapV2Protocol,
  type SushiSwapV3Protocol,
  type SushiSwapV4Protocol,
} from 'sushi/evm'

/** The pool pages' URL segment of each protocol: `/pool/<segment>/<address>`. */
export const POOL_PATH_SEGMENTS = {
  [SushiSwapProtocol.SUSHISWAP_V2]: 'v2',
  [SushiSwapProtocol.SUSHISWAP_V3]: 'v3',
  [SushiSwapProtocol.SUSHISWAP_V4]: 'v4',
} as const satisfies Record<
  SushiSwapV2Protocol | SushiSwapV3Protocol | SushiSwapV4Protocol,
  string
>
