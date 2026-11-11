'use client'

import {
  BrowserEvent,
  InterfaceElementName,
  SwapEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { SwitchArrowsIcon } from '@sushiswap/ui/icons/switch-arrows-icon'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export const SimpleSwapSwitchTokensButton = () => {
  const {
    mutate: { switchTokens },
  } = useDerivedStateSimpleSwap()

  return (
    <div className="left-0 right-0 mt-[-28px] mb-[-28px] flex items-center justify-center ">
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={SwapEventName.SWAP_TOKENS_REVERSED}
        element={InterfaceElementName.SWAP_TOKENS_REVERSE_ARROW_BUTTON}
      >
        <button
          onClick={switchTokens}
          type="button"
          className="hover:shadow-sm transition-border shadow-md z-10 group bg-background dark:bg-muted py-3 px-7 border border-accent transition-all rounded-full cursor-pointer"
        >
          <div className="transition-transform rotate-0 group-hover:rotate-180">
            <SwitchArrowsIcon className="w-3.5 h-3.5" />
          </div>
        </button>
      </TraceEvent>
    </div>
  )
}
