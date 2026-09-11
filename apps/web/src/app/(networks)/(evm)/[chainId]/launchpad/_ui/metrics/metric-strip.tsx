import { classNames } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'

type MetricStripColumns = 3 | 4

export function MetricStrip({
  children,
  columns = 4,
}: {
  children: ReactNode
  columns?: MetricStripColumns
}) {
  return (
    <PerpsCard className="overflow-hidden" fullWidth>
      <div
        className={classNames(
          'grid',
          columns === 3 ? 'sm:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4',
        )}
      >
        {children}
      </div>
    </PerpsCard>
  )
}

export function MetricStripItem({
  label,
  value,
  detail,
  index,
  columns = 4,
  className,
  valueClassName,
}: {
  label: ReactNode
  value: ReactNode
  detail?: ReactNode
  index: number
  columns?: MetricStripColumns
  className?: string
  valueClassName?: string
}) {
  return (
    <div
      className={classNames(
        'border-white/[0.06] px-4 py-4 sm:px-5',
        columns === 3
          ? index > 0 && 'border-t sm:border-l sm:border-t-0'
          : [
              index % 2 === 1 && 'border-l',
              index > 1 && 'border-t lg:border-t-0',
              index > 0 && 'lg:border-l',
            ],
        className,
      )}
    >
      <div className="text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
        {label}
      </div>
      <div
        className={classNames(
          'mt-1.5 text-lg font-semibold text-perps-muted',
          valueClassName,
        )}
      >
        {value}
      </div>
      {detail ? (
        <div className="mt-1 text-[11px] text-perps-muted-50">{detail}</div>
      ) : null}
    </div>
  )
}
