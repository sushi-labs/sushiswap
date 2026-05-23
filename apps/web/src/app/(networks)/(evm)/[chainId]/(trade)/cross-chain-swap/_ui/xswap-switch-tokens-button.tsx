'use client'

import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'
import {
  BrowserEvent,
  InterfaceElementName,
  SwapEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { useXSwapForm } from './xswap-form-provider'

export function XSwapSwitchTokensButton() {
  const { switchTokens, token0Param, token1Param } = useXSwapForm()
  const disabled = !token0Param || !token1Param

  return (
    <div className="left-0 right-0 mt-[-26px] mb-[-26px] flex items-center justify-center">
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={SwapEventName.XSWAP_TOKENS_REVERSED}
        element={InterfaceElementName.SWAP_TOKENS_REVERSE_ARROW_BUTTON}
      >
        <button
          onClick={switchTokens}
          type="button"
          disabled={disabled}
          className="hover:shadow-sm transition-border z-10 group bg-background p-2 border border-accent transition-all rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="transition-transform rotate-0 group-hover:rotate-180">
            <ArrowsUpDownIcon strokeWidth={3} className="w-3 h-3 text-blue" />
          </div>
        </button>
      </TraceEvent>
    </div>
  )
}
