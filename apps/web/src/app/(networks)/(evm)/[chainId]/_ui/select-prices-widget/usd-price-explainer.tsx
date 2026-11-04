'use client'

import { InformationCircleIcon } from '@heroicons/react/20/solid'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { type ReactElement, useState } from 'react'

export function UsdPriceExplainer({
  quoteSymbol,
}: {
  quoteSymbol: string | undefined
}): ReactElement {
  const [open, setOpen] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded text-xs leading-5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={(event) => {
              // Keep the explanation available on touch devices, where a
              // click would otherwise close Radix's hover/focus tooltip.
              event.preventDefault()
              setOpen(true)
            }}
          >
            <InformationCircleIcon width={14} height={14} aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          align="end"
          collisionPadding={16}
          className="max-w-[min(20rem,calc(100vw-2rem))] !p-3 !font-normal leading-5"
        >
          Dollar prices are converted to a fixed token-pair range. Their USD
          equivalents change with {quoteSymbol ?? 'the paired token'}&apos;s
          price. Bounds are rounded to the pool&apos;s supported ticks.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
