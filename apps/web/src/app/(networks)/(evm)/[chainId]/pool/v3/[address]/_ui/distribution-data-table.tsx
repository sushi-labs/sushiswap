import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import {
  Currency,
  DataTable,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  SkeletonText,
  TimeAgo,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import format from 'date-fns/format'
import { type FC, useMemo } from 'react'
import { rewardPerDay } from 'src/lib/functions'
import type { RewardCampaign } from 'src/lib/hooks/react-query'
import { EvmChainId } from 'sushi/evm'
import { isKatanaStakeRequiredCampaign } from '../_lib/reward-campaign-utils'

interface DistributionDataTableProps {
  chainId: EvmChainId
  isLoading: boolean
  data?: RewardCampaign[]
}

function RewardPerDayCell({ campaign }: { campaign: RewardCampaign }) {
  const reward = rewardPerDay({
    start: campaign.startTimestamp,
    end: campaign.endTimestamp,
    amount: campaign.amount,
    token: campaign.rewardToken,
  })

  if (!reward) return <>n/a</>

  return (
    <div className="whitespace-nowrap flex items-center gap-2">
      <Currency.Icon currency={reward.currency} width={18} height={18} />
      {reward.toSignificant(6)} {reward.currency.symbol}
    </div>
  )
}

function TimestampCell({
  timestamp,
  formatString,
}: {
  timestamp: number
  formatString: string
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <TimeAgo
            className="whitespace-nowrap underline decoration-dotted underline-offset-2"
            value={new Date(timestamp * 1000)}
          />
        </TooltipTrigger>
        <TooltipContent>
          {format(new Date(timestamp * 1000), formatString)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function KatanaStakeRequirementCell({
  campaign,
}: {
  campaign: RewardCampaign
}) {
  if (!isKatanaStakeRequiredCampaign(campaign)) return null

  return (
    <div className="flex justify-center">
      <HoverCard openDelay={150} closeDelay={0}>
        <HoverCardTrigger asChild>
          <ExclamationTriangleIcon
            width={24}
            height={24}
            className="dark:text-yellow text-amber-900"
          />
        </HoverCardTrigger>
        <HoverCardContent className="max-w-[360px] space-y-2 text-sm">
          <p className="font-medium">Stake to earn these emissions</p>
          <p className="text-muted-foreground">
            LPs must stake in the Katana LP staker contract to receive these
            emissions. Staking and opt-in are available at{' '}
            <a
              href="https://app.katana.network/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:underline"
            >
              app.katana.network/portfolio
            </a>
            .
          </p>
          <p className="text-muted-foreground">
            Once staked, the position disappears from the Sushi positions page
            and it does not earn trading fees while staked.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

function getColumns(chainId: EvmChainId): ColumnDef<RewardCampaign, unknown>[] {
  const columns: ColumnDef<RewardCampaign, unknown>[] = [
    {
      id: 'reward',
      header: 'Reward (per day)',
      cell: (props) => {
        return <RewardPerDayCell campaign={props.row.original} />
      },
      meta: {
        body: {
          skeleton: <SkeletonText fontSize="lg" />,
        },
        header: {
          description:
            'The amount of tokens that gets distributed per day to everyone that provided liquidity to this pool.',
        },
      },
    },
    {
      id: 'duration',
      header: 'Started',
      cell: (props) => {
        return (
          <TimestampCell
            timestamp={props.row.original.startTimestamp}
            formatString="dd MMM yyyy HH:mm"
          />
        )
      },
      meta: {
        body: {
          skeleton: <SkeletonText fontSize="lg" />,
        },
      },
    },
    {
      id: 'end',
      header: 'Ends in',
      cell: (props) => {
        return (
          <TimestampCell
            timestamp={props.row.original.endTimestamp}
            formatString="dd MMM yyyy HH:mm"
          />
        )
      },
      meta: {
        body: {
          skeleton: <SkeletonText fontSize="lg" />,
        },
      },
    },
    {
      id: 'oorIncentivized',
      header: 'In-range only',
      cell: (props) => {
        const { isOutOfRangeIncentivized } = props.row.original.params
        if (isOutOfRangeIncentivized) return <></>

        return <CheckIcon width={20} height={20} className="text-green" />
      },
      meta: {
        body: {
          skeleton: <SkeletonText fontSize="lg" />,
        },
        header: {
          description: 'Only rewards in-range positions',
        },
      },
    },
  ]

  if (chainId === EvmChainId.KATANA) {
    columns.push({
      id: 'katana-staking',
      header: '',
      maxSize: 4,
      cell: (props) => {
        return <KatanaStakeRequirementCell campaign={props.row.original} />
      },
      meta: {
        body: {
          skeleton: <SkeletonText fontSize="lg" />,
        },
        header: {
          className: 'text-right',
          description:
            'Some Katana campaigns require staking in the LP staker contract to earn the displayed emissions.',
        },
      },
    })
  }

  return columns
}

export const DistributionDataTable: FC<DistributionDataTableProps> = ({
  chainId,
  isLoading,
  data,
}) => {
  const columns = useMemo(() => getColumns(chainId), [chainId])
  const _data = useMemo(() => {
    return data ?? []
  }, [data])

  return <DataTable loading={isLoading} columns={columns} data={_data} />
}
