'use client'

import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
  InformationCircleIcon,
} from '@heroicons/react-v1/solid'
import { useCopyClipboard } from '@sushiswap/hooks'
import {
  Button,
  IconButton,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'

import { type ReactNode, useMemo } from 'react'
import {
  currencyFormatter,
  usePerpsClaim,
  useSushiReferralOverview,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatUnits } from 'viem'
import { PerpsCard } from '~evm/perps/_ui/_common'

const PERPS_CLAIM_TOKEN_DECIMALS = 6

function SummaryCard({
  label,
  value,
  isLoading,
  footer,
  tooltip,
  actionButton,
}: {
  label: string
  value: string
  isLoading: boolean
  footer?: string
  tooltip?: string
  actionButton?: ReactNode
}) {
  return (
    <PerpsCard className="p-3 gap-2 flex flex-col justify-between " fullWidth>
      <div className="text-perps-muted-50 text-xs lg:text-sm">
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
              <TooltipContent className="!bg-black/10">
                {tooltip}
              </TooltipContent>
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
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="font-medium text-lg md:text-2xl text-ellipsis overflow-hidden text-perps-muted">
            {value}
          </div>
          {actionButton ? actionButton : null}
        </div>
      )}
      <div className="text-xs text-perps-muted/40">{footer}</div>
    </PerpsCard>
  )
}

export function ReferralsSummaryCards() {
  const address = useAccount('evm')
  const overview = useSushiReferralOverview({ address })
  const claim = usePerpsClaim({ address })
  const [isCopied, staticCopy] = useCopyClipboard()

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
          footer={shareLink ? '' : 'Create a code to unlock your invite link.'}
          actionButton={
            shareLink ? (
              <IconButton
                name="share"
                size="sm"
                icon={isCopied ? ClipboardCheckIcon : ClipboardCopyIcon}
                onClick={() => staticCopy(shareLink)}
                variant="perps-tertiary"
                className="rounded-xl !text-perps-muted-50"
              />
            ) : undefined
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
