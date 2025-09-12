'use client'

import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'
import {
  BrowserEvent,
  InterfaceElementName,
  SwapEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { useDerivedStateSwapWidget } from './derivedstate-swap-widget-provider'

export const SwapWidgetSwitchTokensButton = () => {
  const {
    mutate: { switchTokens },
  } = useDerivedStateSwapWidget()

  return (
    <div className="left-0 right-0 mt-[-26px] mb-[-26px] flex items-center justify-center">
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={SwapEventName.SWAP_TOKENS_REVERSED}
        element={InterfaceElementName.SWAP_TOKENS_REVERSE_ARROW_BUTTON}
      >
        <button
          onClick={switchTokens}
          type="button"
          className="hover:shadow-sm transition-border z-10 group bg-background p-2 border border-accent transition-all rounded-full cursor-pointer"
        >
          <div className="transition-transform rotate-0 group-hover:rotate-180">
            <ArrowsUpDownIcon strokeWidth={3} className="w-3 h-3 text-blue" />
          </div>
        </button>
      </TraceEvent>
    </div>
  )
}
