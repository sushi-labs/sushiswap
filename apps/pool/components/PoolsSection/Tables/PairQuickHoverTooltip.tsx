import { formatNumber, formatPercent } from '@sushiswap/format'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { Button, Chip, Currency, Link, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { incentiveRewardToToken } from '../../../lib/functions'
import { useTokensFromPair } from '../../../lib/hooks'
import { ICON_SIZE } from './columns'

interface PairQuickHoverTooltip {
  row: {
    pair: Pair
  }
}

export const PairQuickHoverTooltip: FC<PairQuickHoverTooltip> = ({ row }) => {
  const { token0, token1 } = useTokensFromPair(row.pair)

  return (
    <div className="flex flex-col p-2 !pb-0">
      <div className="flex justify-between gap-8">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
            <div className="flex flex-col">
              <Typography
                variant="sm"
                weight={500}
                className="flex gap-1 text-slate-50"
              >
                {token0.symbol} <span className="text-slate-500">/</span>{' '}
                {token1.symbol}
              </Typography>
              <Typography variant="xxs" className="text-slate-400">
                SushiSwap Farm
              </Typography>
            </div>
          </div>
          <Typography
            variant="xs"
            weight={600}
            className="flex gap-1.5 mt-1 items-center text-slate-400"
          >
            <Chip color="gray" label={`Fee ${row.pair.swapFee / 100}%`} />
          </Typography>
        </div>
        <div className="flex flex-col gap-1">
          <Typography
            variant="sm"
            weight={600}
            className="flex gap-3 text-slate-50"
          >
            <span className="text-slate-400">APR:</span>{' '}
            {formatPercent(row.pair.apr)}
          </Typography>
          <Typography
            variant="xxs"
            weight={600}
            className="flex justify-end gap-1 text-slate-50"
          >
            <span className="text-slate-400">Rewards:</span>{' '}
            {formatPercent(row.pair.incentiveApr)}
          </Typography>
          <Typography
            variant="xxs"
            weight={600}
            className="flex justify-end gap-1 text-slate-50"
          >
            <span className="text-slate-400">Fees:</span>{' '}
            {formatPercent(row.pair.feeApr)}
          </Typography>
        </div>
      </div>
      {row.pair.farm?.incentives && (
        <>
          <hr className="my-3 border-t border-slate-200/10" />
          <div className="flex flex-col gap-1.5">
            <Typography variant="xs" className="mb-1 text-slate-500">
              Reward Emission
            </Typography>
            {row.pair.farm.incentives.map((incentive, index) => (
              <div key={index} className="flex items-center gap-2">
                <Currency.Icon
                  currency={incentiveRewardToToken(row.pair.chainId, incentive)}
                  width={18}
                  height={18}
                />
                <Typography variant="sm" weight={600} className="text-slate-50">
                  <span>
                    {formatNumber(incentive.rewardPerDay)}{' '}
                    {incentive.rewardToken.symbol}
                  </span>{' '}
                  <span className="font-normal text-slate-300">per day</span>
                </Typography>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-end gap-2 mt-4 mb-2">
        <Link.Internal href={`/${row.pair.id}/add`} passHref={true}>
          <Button as="a" size="sm" fullWidth>
            Deposit
          </Button>
        </Link.Internal>
      </div>
    </div>
  )
}
