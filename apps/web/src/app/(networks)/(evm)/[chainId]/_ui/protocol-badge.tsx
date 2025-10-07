import React, { type JSX } from 'react'
import { SushiSwapProtocol } from 'sushi/evm'

export const ProtocolBadge: Record<SushiSwapProtocol, JSX.Element> = {
  [SushiSwapProtocol.SUSHISWAP_V2]: (
    <div className="whitespace-nowrap dark:bg-[#252A3C] bg-pink/20 text-pink text-xs px-2.5 py-1 rounded-full font-medium w-fit">
      V2
    </div>
  ),
  [SushiSwapProtocol.SUSHISWAP_V3]: (
    <div className="whitespace-nowrap bg-[#3B7EF61A] dark:bg-[#252A3C] text-[#3B7EF6] text-xs px-2.5 py-1 rounded-full font-medium w-fit">
      V3
    </div>
  ),
  [SushiSwapProtocol.BLADE]: (
    <div className="whitespace-nowrap dark:bg-[#252A3C] bg-blue/20 text-blue text-xs px-2.5 py-1 rounded-full font-medium w-fit">
      BLADE
    </div>
  ),
}
