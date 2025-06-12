import { CheckIcon } from '@heroicons/react/20/solid'
import {
  Currency,
  DataTable,
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
import type { RewardCampaign } from 'src/lib/hooks/react-query'
import { rewardPerDay } from '../../lib/functions'

interface DistributionDataTableProps {
  isLoading: boolean
  data?: RewardCampaign[]
}

const COLUMNS = [
  {
    id: 'reward',
    header: 'Reward (per day)',
    cell: (props) => {
      const { startTimestamp, endTimestamp, amount, rewardToken } =
        props.row.original
      const _reward = rewardPerDay({
        start: startTimestamp,
        end: endTimestamp,
        amount,
        token: rewardToken,
      })
      if (!_reward) return <>n/a</>

      return (
        <div className="whitespace-nowrap flex items-center gap-2">
          <Currency.Icon currency={_reward.currency} width={18} height={18} />
          {_reward.toSignificant(6)} {_reward.currency.symbol}
        </div>
      )
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
      const { startTimestamp } = props.row.original
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <TimeAgo
                className="whitespace-nowrap underline decoration-dotted underline-offset-2"
                value={new Date(startTimestamp * 1000)}
              />
            </TooltipTrigger>
            <TooltipContent>
              {format(new Date(startTimestamp * 1000), 'dd MMM yyyy HH:mm')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
      const { endTimestamp } = props.row.original
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <TimeAgo
                className="whitespace-nowrap underline decoration-dotted underline-offset-2"
                value={new Date(endTimestamp * 1000)}
              />
            </TooltipTrigger>
            <TooltipContent>
              {format(new Date(endTimestamp * 1000), 'dd MMM yyyy HH:mm')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
] satisfies ColumnDef<RewardCampaign, unknown>[]

export const DistributionDataTable: FC<DistributionDataTableProps> = ({
  isLoading,
  data,
}) => {
  const _data = useMemo(() => {
    return data ?? []
  }, [data])

  return <DataTable loading={isLoading} columns={COLUMNS} data={_data} />
}
