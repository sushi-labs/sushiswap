'use client'

import { InformationCircleIcon } from '@heroicons/react-v1/solid'
import {
  Card,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  currencyFormatter,
  usePerpsClaim,
  useSushiReferralOverview,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatUnits } from 'viem'

const PERPS_CLAIM_TOKEN_DECIMALS = 6

function SummaryCard({
  label,
  value,
  isLoading,
  footer,
  tooltip,
}: {
  label: string
  value: string
  isLoading: boolean
  footer?: string
  tooltip?: string
}) {
  return (
    <Card className="p-2 !rounded-md gap-2 flex !bg-[#18223B] border-transparent flex-col justify-between w-full">
      <div className="text-muted-foreground text-xs lg:text-sm">
        {tooltip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  aria-label={label}
                  className="inline-flex items-center gap-1 text-left"
                >
                  <span>{label}</span>
                  <InformationCircleIcon className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          label
        )}
      </div>
      {isLoading ? (
        <div className="w-24 h-8">
          <SkeletonText fontSize="xl" />
        </div>
      ) : (
        <div className="font-medium text-lg md:text-2xl">{value}</div>
      )}
      <div className="text-xs text-slate-400">{footer}</div>
    </Card>
  )
}

export function ReferralsSummaryCards() {
  const address = useAccount('evm')
  const overview = useSushiReferralOverview({ address })
  const claim = usePerpsClaim({ address })

  const primaryCode = overview.data?.primaryReferralCode?.code
  const shareLink = primaryCode
    ? `https://sushi.com/perps/invite/${primaryCode}`
    : undefined

  const claimableRewardsValue = useMemo(() => {
    if (!claim.data) {
      return currencyFormatter.format(0)
    }

    return currencyFormatter.format(
      Number(
        formatUnits(
          BigInt(claim.data.claimableAmount),
          PERPS_CLAIM_TOKEN_DECIMALS,
        ),
      ),
    )
  }, [claim.data])

  return (
    <div className="grid w-full gap-2 md:grid-cols-4">
      <div className="grid w-full grid-cols-2 gap-2 md:contents">
        <SummaryCard
          label="Current rewards"
          value={currencyFormatter.format(overview.data?.totalEarnedFees ?? 0)}
          isLoading={overview.isLoading}
          footer="Lifetime cumulative rewards earned so far."
        />
        <SummaryCard
          label="Claimable rewards"
          value={claimableRewardsValue}
          isLoading={claim.isLoading}
          tooltip="Rewards can take a some time to become available."
          footer="Use Claim Rewards to withdraw."
        />
        <SummaryCard
          label="Referral code"
          value={primaryCode ?? 'Not created'}
          isLoading={overview.isLoading}
          footer={
            shareLink
              ? 'Use Share Code to copy your invite link.'
              : 'Create a code to unlock your invite link.'
          }
        />
        <SummaryCard
          label="Referees"
          value={String(overview.data?.referredUserCount ?? 0)}
          isLoading={overview.isLoading}
        />
      </div>
    </div>
  )
}
