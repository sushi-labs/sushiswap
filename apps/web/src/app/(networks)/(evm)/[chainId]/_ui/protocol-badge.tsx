import {
  SUSHISWAP_V4,
  type SushiSwapV4Protocol,
} from '@sushiswap/graph-client/data-api'
import React, { type JSX } from 'react'
import { SushiSwapProtocol } from 'sushi/evm'

export const ProtocolBadge: Record<
  SushiSwapProtocol | SushiSwapV4Protocol,
  JSX.Element
> = {
  [SUSHISWAP_V4]: (
    <div className="whitespace-nowrap bg-blue/20 text-blue text-[10px] px-2 rounded-full">
      V4
    </div>
  ),
  [SushiSwapProtocol.SUSHISWAP_V2]: (
    <div className="whitespace-nowrap bg-pink/20 text-pink text-[10px] px-2 rounded-full">
      V2
    </div>
  ),
  [SushiSwapProtocol.SUSHISWAP_V3]: (
    <div className="whitespace-nowrap bg-blue/20 text-blue text-[10px] px-2 rounded-full">
      V3
    </div>
  ),
  [SushiSwapProtocol.BLADE]: (
    <div className="whitespace-nowrap bg-blue/20 text-blue text-[10px] px-2 rounded-full">
      BLADE
    </div>
  ),
}
