import { classNames } from '@sushiswap/ui'
import type { ReactNode } from 'react'

export const StatItem = ({
  title,
  value,
  isPortfolioStat,
}: {
  title: ReactNode
  value: ReactNode
  isPortfolioStat?: boolean
}) => {
  return (
    <div className="grid grid-cols-2 text-xs font-medium">
      <div
        className={classNames(
          'text-[#6A7282]',
          isPortfolioStat ? '!text-[#81898C] font-medium' : '',
        )}
      >
        {title}
      </div>
      <div
        className={classNames(
          'justify-end text-[#99A1AF] flex whitespace-nowrap',
          isPortfolioStat ? '!text-white font-medium' : '',
        )}
      >
        {value}
      </div>
    </div>
  )
}
