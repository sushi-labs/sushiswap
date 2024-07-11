import React, { FC } from 'react'
import { formatUSD } from 'sushi/format'

interface PortfolioPositionsInfoProps {
  isLoading: boolean
  totalUSD: number | undefined
}

export const PortfolioPositionsInfo: FC<PortfolioPositionsInfoProps> = ({
  isLoading,
  totalUSD,
}) => (
  <>
    {isLoading ? (
      <div className="skeleton w-20 h-4" />
    ) : (
      <div className="flex flex-col w-full">
        <span className="text-large font-semibold">
          {formatUSD(totalUSD ?? 0)}
        </span>
      </div>
    )}
  </>
)
