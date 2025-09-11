import { Accordion } from '@sushiswap/ui'
import React, { useMemo } from 'react'
import { formatUSD } from 'sushi'
import { useAccount } from 'wagmi'
import { usePortfolioPositions } from '../hooks/use-portfolio-positions'
import { NotificationBadge } from '../notification-badge'
import { PortfolfioAccordion } from '../portfolio-accordion'
import { PortfolioInfoRowSkeleton } from '../portfolio-info-row-skeleton'
import { PortfolioV2Positions } from '../portfolio-positions/PortfolioV2Positions'
import { PortfolioV3Positions } from '../portfolio-positions/PortfolioV3Positions'
import type { PortfolioAssetsProps } from './portfolio-assets'

export const PositionAssets = (props: PortfolioAssetsProps) => {
  const { value, onValueChange } = props
  const { address } = useAccount()

  const { data, isError, isLoading } = usePortfolioPositions({
    address,
  })

  const totalPositions = useMemo(() => {
    if (!data) return 0
    return data.v2Positions.length + data.v3Positions.length
  }, [data])

  return (
    <PortfolfioAccordion
      value={value}
      onValueChange={onValueChange}
      accordionValue="lps"
      triggerChildren={
        <>
          <div className="flex items-center gap-x-1">
            LP Positions{' '}
            <NotificationBadge size="sm" notificationCount={totalPositions} />
          </div>
          <span className="text-muted-foreground">
            {formatUSD(data?.totalUSD ?? 0)}
          </span>
        </>
      }
    >
      <Accordion type="multiple" defaultValue={['v2', 'v3']}>
        {isError ? (
          <div className="text-center text-red text-sm pt-4">
            Could Not Fetch LP Positions
          </div>
        ) : isLoading ? (
          <PortfolioInfoRowSkeleton amount={12} />
        ) : totalPositions === 0 ? (
          <div className="text-sm mt-2 text-[#64748B] text-center">
            No LP Positions
          </div>
        ) : (
          <>
            {data?.v2Positions.length ? (
              <PortfolioV2Positions positions={data.v2Positions} />
            ) : null}
            {data?.v3Positions.length ? (
              <PortfolioV3Positions positions={data.v3Positions} />
            ) : null}
          </>
        )}
      </Accordion>
    </PortfolfioAccordion>
  )
}
