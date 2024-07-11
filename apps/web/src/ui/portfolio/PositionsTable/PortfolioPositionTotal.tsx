import { classNames } from '@sushiswap/ui'
import { FC } from 'react'
import { formatUSD } from 'sushi'

interface PortfolioPositionInfoProps {
  isLoading: boolean
  totalUSD: number | undefined
}

export const PortfolioPositionInfo: FC<PortfolioPositionInfoProps> = ({
  isLoading,
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
      </div>
    )}
  </>
)
