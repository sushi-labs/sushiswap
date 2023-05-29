import { Badge } from '@sushiswap/ui/future/components/Badge'
import { NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { unwrapToken } from '../../lib/functions'
import { formatNumber } from '@sushiswap/format'
import React, { FC, useMemo, useState } from 'react'
import { AngleRewardsPool } from '@sushiswap/react-query'
import { ChainId } from '@sushiswap/chain'
import { useTokenAmountDollarValues } from '../../lib/hooks'
import { Collapsible } from '@sushiswap/ui/future/components/animation/Collapsible'
import { format } from 'date-fns'
import { Token, tryParseAmount } from '@sushiswap/currency'
import { useBreakpoint } from '@sushiswap/ui/future'
import { Dialog } from '@sushiswap/ui/future/components/dialog'

interface RewardsSectionItem {
  chainId: ChainId
  data: AngleRewardsPool
}

const rewardPerDay = ({
  start,
  end,
  amount,
  tvl,
  userTVL,
  token,
}: {
  start: number
  end: number
  amount: number
  tvl: number
  userTVL: number
  token: Token
}) => {
  const days = (end - start) / 3600 / 24
  return tryParseAmount(((amount / days) * (userTVL / tvl)).toString(), token)
}

export const RewardsSectionItem: FC<RewardsSectionItem> = ({ chainId, data }) => {
  const { isMd } = useBreakpoint('md')

  const unclaimed = useMemo(() => Object.values(data.rewardsPerToken).map((el) => el.unclaimed), [data])
  const dollarValues = useTokenAmountDollarValues({ chainId, amounts: unclaimed })
  const [open, setOpen] = useState(false)

  return (
    <div className="p-4 flex flex-col gap-1 border border-gray-200 rounded-2xl">
      <div
        role="button"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-4">
          <div className="min-w-[52px]">
            <Badge
              className="border-2 border-gray-100 dark:border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
              position="bottom-right"
              badgeContent={<NetworkIcon chainId={chainId} width={20} height={20} />}
            >
              <Currency.IconList iconWidth={40} iconHeight={40}>
                <Currency.Icon currency={data.token0} />
                <Currency.Icon currency={data.token1} />
              </Currency.IconList>
            </Badge>
          </div>
          <div className="flex flex-col items-baseline gap-[1px]">
            <span className="text-sm font-medium flex items-baseline gap-1 text-gray-900 dark:text-slate-50">
              {unwrapToken(data.token0).symbol} <span className="font-normal text-gray-900 dark:text-slate-500">/</span>{' '}
              {unwrapToken(data.token1).symbol}
              <span className="text-xs text-gray-500 dark:text-slate-500">{data.poolFee}%</span>
            </span>
            <div className="rounded-full px-2 py-0.5 text-xs bg-black/[0.06] dark:bg-white/[0.06]">
              {data.distributionData.length} Ongoing Farms
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end lg:items-start">
          <span className="text-xs text-gray-600 dark:text-slate-400">Position Size</span>
          <span className="text-sm font-medium">${formatNumber(data.userTVL)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-600 dark:text-slate-400">Average APR</span>
          <span className="text-sm font-medium">{formatNumber(data.meanAPR)}%</span>
        </div>
        <div className="flex flex-col items-end lg:items-start">
          <span className="text-xs text-gray-600 dark:text-slate-400">Claimable</span>
          <span className="text-sm font-medium">${dollarValues.reduce((acc, cur) => acc + +formatNumber(cur), 0)}</span>
        </div>
      </div>
      {isMd ? (
        <Collapsible open={open}>
          <div className="py-4">
            <div className="h-px bg-gray-200 dark:bg-slate-200/5 w-full" />
          </div>
          <div className="pb-3 grid grid-cols-3">
            <span className="text-xs font-semibold text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap">
              Your reward
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap">
              Reward Score
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap">
              Duration
            </span>
          </div>
          <div className="flex flex-col gap-3 divide-y divide-gray-200 dark:divide-slate-200/5">
            {data.distributionData.map(({ start, end, amount, token }) => (
              <div className="grid grid-cols-3 pt-2">
                <div className="flex items-center gap-2">
                  <Currency.Icon currency={token} width={30} height={30} />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {rewardPerDay({
                        start,
                        end,
                        amount,
                        tvl: data.tvl ?? 0,
                        userTVL: data.userTVL ?? 0,
                        token,
                      })?.toSignificant(6)}{' '}
                      {token.symbol}{' '}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-500">per day</span>
                  </div>
                </div>
                <div />
                <div className="flex flex-col">
                  <span className="font-mediumt">{Math.floor((end - start) / 3600 / 24)} days left</span>
                  <span className="text-xs text-gray-500 dark:text-slate-500">
                    Ends at: {format(end * 1000, 'dd MMM yyyy hh:mm')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Collapsible>
      ) : (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <Dialog.Content>Test</Dialog.Content>
        </Dialog>
      )}
    </div>
  )
}
