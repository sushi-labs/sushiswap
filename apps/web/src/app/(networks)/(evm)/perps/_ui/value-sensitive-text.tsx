import { classNames } from '@sushiswap/ui'
import { useEffect, useRef, useState } from 'react'

export const ValueSensitiveText = ({
  value,
  flashMs = 400,
  className,
  formatOptions,
}: {
  value: string | number
  flashMs?: number
  className?: string
  formatOptions?: Intl.NumberFormatOptions
}) => {
  const prevRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [direction, setDirection] = useState<'up' | 'down' | null>(null)

  const num = typeof value === 'string' ? Number.parseFloat(value) : value

  useEffect(() => {
    if (Number.isNaN(num)) return

    const prev = prevRef.current

    if (prev !== null && prev !== num) {
      setDirection(num > prev ? 'up' : 'down')

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setDirection(null)
      }, flashMs)
    }

    prevRef.current = num

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [num, flashMs])

  const colorClass =
    direction === 'up' ? 'text-green' : direction === 'down' ? 'text-red' : ''

  return (
    <span
      className={classNames(`transition-colors ${colorClass}`, className ?? '')}
      style={{
        transitionDuration: `${flashMs}ms`,
        animationDuration: `${flashMs}ms`,
      }}
    >
      {formatOptions
        ? new Intl.NumberFormat(undefined, formatOptions).format(
            Number.isNaN(num) ? 0 : num,
          )
        : value}
    </span>
  )
}
