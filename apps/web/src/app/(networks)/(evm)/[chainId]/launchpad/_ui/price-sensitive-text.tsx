'use client'

import { classNames } from '@sushiswap/ui'
import ms from 'ms'
import { useEffect, useRef, useState } from 'react'

export function PriceSensitiveText({
  price,
  children,
  className,
}: {
  price: number | null | undefined
  children: string
  className?: string
}) {
  const previousPrice = useRef<number | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    if (price === null || price === undefined || !Number.isFinite(price)) {
      previousPrice.current = null
      setDirection(null)
      return
    }

    const previous = previousPrice.current
    if (previous !== null && previous !== price) {
      setDirection(price > previous ? 'up' : 'down')

      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setDirection(null), ms('650ms'))
    }

    previousPrice.current = price

    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [price])

  return (
    <span
      className={classNames(
        'inline-flex rounded px-1 -mx-1 transition-colors duration-300',
        direction === 'up' && 'bg-emerald-400/10 text-emerald-400',
        direction === 'down' && 'bg-red/10 text-red',
        className,
      )}
    >
      {children}
    </span>
  )
}
