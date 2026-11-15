'use client'

import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'
import {
  BrowserEvent,
  InterfaceElementName,
  type SwapEventName,
  TraceEvent,
} from '@sushiswap/telemetry'

// Omit `event` to render the button without click telemetry.
export function SwitchTokensButton({
  onClick,
  event,
  disabled,
}: {
  onClick: () => void
  event?: SwapEventName
  disabled?: boolean
}): React.JSX.Element {
  const button = (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      aria-label="Switch tokens"
      className="hover:shadow-sm transition-border z-10 group bg-background p-2 border border-accent transition-all rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="transition-transform rotate-0 group-hover:rotate-180">
        <ArrowsUpDownIcon strokeWidth={3} className="w-3 h-3 text-blue" />
      </div>
    </button>
  )

  return (
    <div className="left-0 right-0 mt-[-26px] mb-[-26px] flex items-center justify-center">
      {event ? (
        <TraceEvent
          events={[BrowserEvent.onClick]}
          name={event}
          element={InterfaceElementName.SWAP_TOKENS_REVERSE_ARROW_BUTTON}
        >
          {button}
        </TraceEvent>
      ) : (
        button
      )}
    </div>
  )
}
