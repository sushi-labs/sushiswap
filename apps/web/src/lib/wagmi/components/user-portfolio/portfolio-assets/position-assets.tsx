import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sushiswap/ui'
import React, { useMemo } from 'react'
import { formatUSD } from 'sushi/format'
import { useAccount } from 'wagmi'
import { usePortfolioPositions } from '../hooks/use-portfolio-positions'
import { NotificationBadge } from '../notification-badge'
import { PortfolioV2Positions } from '../portfolio-positions/PortfolioV2Positions'
import { PortfolioV3Positions } from '../portfolio-positions/PortfolioV3Positions'
import type {
  PortfolioAccordionValue,
  PortfolioAssetsProps,
} from './portfolio-assets'

export const PositionAssets = (props: PortfolioAssetsProps) => {
  const { value, onValueChange } = props
  const { address } = useAccount()

  const { data, isError, isLoading } = usePortfolioPositions(address)

  const totalPositions = useMemo(() => {
    if (!data) return 0
    return data.v2Positions.length + data.v3Positions.length
  }, [data])

  return (
    <Accordion
      type="single"
      onValueChange={(val) => onValueChange(val as PortfolioAccordionValue)}
      value={value}
      className="border border-accent rounded-xl"
    >
      <AccordionItem value="lps" className="!border-0">
        <AccordionTrigger
          hideChevron={true}
          className="px-3 text-xs !py-2 hover:!no-underline data-[state=closed]:border-0 data-[state=closed]:rounded-b-xl !rounded-t-xl border-b border-b-accent dark:bg-slate-800 bg-slate-100 sm:bg-white flex justify-between items-center"
        >
          <div className="flex items-center gap-x-1">
            LP Positions{' '}
            <NotificationBadge size="sm" notificationCount={totalPositions} />
          </div>
          <span className="text-[#535263] dark:text-[#E4DDEC]">
            {formatUSD(data?.totalUSD ?? 0)}
          </span>
        </AccordionTrigger>
        <AccordionContent className="cursor-default max-h-[225px] overflow-y-auto">
          <Accordion type="multiple" defaultValue={['v2', 'v3']}>
            {totalPositions === 0 && !isLoading && !isError ? (
              <div className="text-sm mt-2 text-[#64748B] text-center">
                No LP Positions
              </div>
            ) : null}
            {data?.v2Positions.length ? (
              <PortfolioV2Positions positions={data.v2Positions} />
            ) : null}
            {data?.v3Positions.length ? (
              <PortfolioV3Positions positions={data.v3Positions} />
            ) : null}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
