import { classNames } from '@sushiswap/ui'
import type { ReactNode } from 'react'

export interface DetailListItem {
  label: string
  value: ReactNode
}

export function DetailList({
  items,
  variant = 'spaced',
  className,
  valueClassName,
}: {
  items: readonly DetailListItem[]
  variant?: 'bordered' | 'spaced'
  className?: string
  valueClassName?: string
}) {
  return (
    <dl
      className={classNames(
        variant === 'bordered'
          ? 'divide-y divide-white/[0.06] rounded-xl border border-white/[0.06]'
          : 'space-y-4',
        className,
      )}
    >
      {items.map(({ label, value }) => (
        <div
          key={label}
          className={classNames(
            'flex justify-between text-sm',
            variant === 'bordered'
              ? 'items-center gap-5 px-4 py-3'
              : 'items-start gap-4',
          )}
        >
          <dt className="text-perps-muted-50">{label}</dt>
          <dd
            className={classNames(
              'text-right font-medium text-perps-muted',
              valueClassName,
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
