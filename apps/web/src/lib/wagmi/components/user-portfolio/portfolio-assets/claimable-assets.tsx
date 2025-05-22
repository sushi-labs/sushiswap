import type { PortfolioFarmClaim } from '@sushiswap/graph-client/data-api'
import { Accordion } from '@sushiswap/ui'
import React, { useMemo } from 'react'
import { formatUSD } from 'sushi/format'
import { useAccount } from 'wagmi'
import { usePortfolioClaimables } from '../hooks/use-portfolio-claimables'
import { NotificationBadge } from '../notification-badge'
import { PortfolfioAccordion } from '../portfolio-accordion'
import { PortfolioFarmClaimables } from '../portfolio-claimables/PortfolioFarmClaimables'
import { PortfolioFuroClaimables } from '../portfolio-claimables/PortfolioFuroClaimables'
import { PortfolioInfoRowSkeleton } from '../portfolio-info-row-skeleton'
import type { PortfolioAssetsProps } from './portfolio-assets'

export const ClaimableAssets = (props: PortfolioAssetsProps) => {
  const { value, onValueChange } = props
  const { address } = useAccount()

  const { data, isError, isLoading } = usePortfolioClaimables({
    address,
  })

  const totalClaimables = useMemo(() => {
    if (!data) return 0
    return (
      data.v2PositionClaimables.length +
      data.v3PositionClaimables.length +
      data.furoClaimables.length
    )
  }, [data])

  const farmClaimables: PortfolioFarmClaim[] = useMemo(
    () =>
      data ? [...data.v2PositionClaimables, ...data.v3PositionClaimables] : [],
    [data],
  )

  return (
    <PortfolfioAccordion
      value={value}
      onValueChange={onValueChange}
      accordionValue="claimables"
      triggerChildren={
        <>
          <div className="flex items-center gap-x-1">
            Claimables{' '}
            <NotificationBadge size="sm" notificationCount={totalClaimables} />
          </div>
          <span className="text-[#535263] dark:text-[#E4DDEC]">
            {formatUSD(data?.totalUSD ?? 0)}
          </span>
        </>
      }
    >
      <Accordion type="multiple" defaultValue={['alm', 'furo']}>
        {isError ? (
          <div className="text-center text-red text-sm pt-4">
            Could Not Fetch Claimables
          </div>
        ) : isLoading ? (
          <PortfolioInfoRowSkeleton amount={12} />
        ) : totalClaimables === 0 ? (
          <div className="text-sm mt-2 text-[#64748B] text-center">
            No Claimables
          </div>
        ) : (
          <>
            {farmClaimables.length ? (
              <PortfolioFarmClaimables claimables={farmClaimables} />
            ) : null}
            {data?.furoClaimables.length ? (
              <PortfolioFuroClaimables claimables={data?.furoClaimables} />
            ) : null}
          </>
        )}
      </Accordion>
    </PortfolfioAccordion>
  )
}
