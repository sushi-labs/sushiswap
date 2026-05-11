import { classNames } from '@sushiswap/ui'
import type { ReactNode } from 'react'

export const StatItem = ({
  title,
  value,
}: {
  title: ReactNode
  value: ReactNode
}) => {
  return (
    <div className="grid grid-cols-2 text-xs font-medium">
      <div className={classNames('text-perps-muted-50')}>{title}</div>
      <div
        className={classNames(
          'justify-end text-perps-muted-70 flex whitespace-nowrap',
        )}
      >
        {value}
      </div>
    </div>
  )
}
