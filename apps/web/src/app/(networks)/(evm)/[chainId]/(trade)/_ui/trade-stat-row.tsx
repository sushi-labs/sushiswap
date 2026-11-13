import { classNames } from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'

export function TradeStatRow({
  title,
  children,
  fontWeight = 'semibold',
  valueClassName,
}: {
  title: ReactNode
  children: ReactNode
  fontWeight?: 'normal' | 'semibold'
  valueClassName?: string
}): ReactElement {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
        {title}
      </span>
      <span
        className={classNames(
          'text-sm text-right',
          fontWeight === 'semibold' ? 'font-semibold' : '',
          valueClassName,
        )}
      >
        {children}
      </span>
    </div>
  )
}
