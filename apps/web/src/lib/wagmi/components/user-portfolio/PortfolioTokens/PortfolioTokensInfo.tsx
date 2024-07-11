import { classNames } from '@sushiswap/ui'
import React, { FC } from 'react'
import { formatPercent, formatUSD } from 'sushi'

interface PortfolioTokensInfoProps {
  isLoading: boolean
  percentageChange24h: number | undefined
  amountUSD24Change: number | undefined
  totalUSD: number | undefined
}

export const PortfolioTokensInfo: FC<PortfolioTokensInfoProps> = ({
  isLoading,
  percentageChange24h,
  amountUSD24Change,
  totalUSD,
}) => (
  <>
    {isLoading ? (
      <div className="skeleton w-20 h-4" />
    ) : (
      <div className="flex flex-col w-full">
        <span className={classNames('text-large font-semibold')}>
          {formatUSD(totalUSD ?? 0)}
        </span>
        <span
          className={classNames(
            'font-normal text-gray-400 dark:text-slate-600',
          )}
        >
          {(percentageChange24h ?? 0) > 0 ? '+' : '-'}
          {formatUSD(amountUSD24Change ?? 0)}
          <span
            className={classNames(
              'text-large font-normal',
              (percentageChange24h ?? 0) > 0 ? 'text-green' : 'text-red',
            )}
          >
            {` (${formatPercent(Math.abs(percentageChange24h ?? 0))})`}
          </span>
        </span>
      </div>
    )}
  </>
)
