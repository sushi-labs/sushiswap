'use client'

import { useRef } from 'react'
import { useTradeWidgetCompanionTransition } from '../../_ui/use-trade-widget-transition'

// The limit page's shell, shared with its loading state so they line up: the
// form keeps the swap widget's width; orders take the rest on desktop.
export function CowLimitColumns({
  form,
  orders,
}: {
  form: React.ReactNode
  orders: React.ReactNode
}): React.JSX.Element {
  const ordersRef = useRef<HTMLElement>(null)
  useTradeWidgetCompanionTransition(ordersRef)

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-6">
      <div className="w-full max-w-lg shrink-0">{form}</div>
      <section
        ref={ordersRef}
        aria-label="Your orders"
        className="w-full max-w-lg min-w-0 rounded-3xl bg-[rgba(255,255,255,0.8)] p-4 backdrop-blur-2xl md:p-6 lg:max-w-none lg:flex-1 dark:bg-[rgba(25,32,49,0.8)]"
      >
        {orders}
      </section>
    </div>
  )
}
