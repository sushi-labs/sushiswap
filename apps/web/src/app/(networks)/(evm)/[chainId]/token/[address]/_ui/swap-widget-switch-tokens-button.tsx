'use client'

import {
  BrowserEvent,
  InterfaceElementName,
  SwapEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { SwitchArrowsIcon } from '@sushiswap/ui/icons/switch-arrows-icon'
import { useDerivedStateSwapWidget } from './derivedstate-swap-widget-provider'

export const SwapWidgetSwitchTokensButton = () => {
  const {
    mutate: { switchTokens },
  } = useDerivedStateSwapWidget()

  return (
    <div className="mt-[-28px] mb-[-28px] flex items-center justify-center">
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={SwapEventName.SWAP_TOKENS_REVERSED}
        element={InterfaceElementName.SWAP_TOKENS_REVERSE_ARROW_BUTTON}
      >
        <button
          onClick={switchTokens}
          type="button"
          aria-label="Switch tokens"
          className="z-10 group bg-background dark:bg-muted px-7 py-3 border border-accent rounded-full shadow-md hover:shadow-sm transition-shadow cursor-pointer"
        >
          <div className="transition-transform rotate-0 group-hover:rotate-180">
            <SwitchArrowsIcon aria-hidden="true" className="w-3.5 h-3.5" />
          </div>
        </button>
      </TraceEvent>
    </div>
  )
}
