import { formatPercent, formatUSD } from '@sushiswap/format'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { Button, Chip, Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPair } from '../../../../lib/hooks'
import { PoolPositionProvider, usePoolPosition } from '../../../PoolPositionProvider'
import { PoolPositionRewardsProvider, usePoolPositionRewards } from '../../../PoolPositionRewardsProvider'
import { PoolPositionStakedProvider, usePoolPositionStaked } from '../../../PoolPositionStakedProvider'
import { ICON_SIZE } from '../contants'

interface PositionQuickHoverTooltipProps {
  row: Pair
}

export const PositionQuickHoverTooltip: FC<PositionQuickHoverTooltipProps> = ({ row }) => {
  return (
    <PoolPositionProvider watch={false} pair={row}>
      <PoolPositionStakedProvider watch={false} pair={row}>
        <PoolPositionRewardsProvider pair={row}>
          <_PositionQuickHoverTooltip row={row} />
        </PoolPositionRewardsProvider>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}

const _PositionQuickHoverTooltip: FC<PositionQuickHoverTooltipProps> = ({ row }) => {
  const { token0, token1 } = useTokensFromPair(row)
  const { underlying0, underlying1, value1, value0 } = usePoolPosition()
  const {
    underlying1: stakedUnderlying1,
    underlying0: stakedUnderlying0,
    value0: stakedValue0,
    value1: stakedValue1,
  } = usePoolPositionStaked()

  const { pendingRewards, rewardTokens, values } = usePoolPositionRewards()

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
              <Typography variant="sm" weight={500} className="flex gap-1 text-slate-50">
                {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}
              </Typography>
              <Typography variant="xxs" className="text-slate-400">
                SushiSwap Farm
              </Typography>
            </div>
          </div>
          <Typography variant="xs" weight={600} className="flex gap-1.5 items-end text-slate-400">
            <Chip color="gray" size="sm" label="Classic" />
            Fee {row.swapFee / 100}%
          </Typography>
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="sm" weight={600} className="flex gap-3 text-slate-50">
            <span className="text-slate-400">APR:</span> {formatPercent(row.apr)}
          </Typography>
          <Typography variant="xxs" weight={600} className="flex justify-end gap-1 text-slate-50">
            <span className="text-slate-400">Rewards:</span> {formatPercent(row.incentiveApr)}
          </Typography>
          <Typography variant="xxs" weight={600} className="flex justify-end gap-1 text-slate-50">
            <span className="text-slate-400">Fees:</span> {formatPercent(row.feeApr)}
          </Typography>
        </div>
      </div>
      <hr className="my-3 border-t border-slate-200/10" />
      <div className="flex flex-col gap-1.5">
        <Typography variant="xs" className="mb-1 text-slate-500">
          Position
        </Typography>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Currency.Icon currency={token0} width={18} height={18} />
            <Typography variant="sm" weight={600} className="text-slate-50">
              {underlying0?.toSignificant(6) || '0.00'} {token0?.symbol}
            </Typography>
          </div>
          <Typography variant="xs" className="text-slate-400">
            {formatUSD(value0)}
          </Typography>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Currency.Icon currency={token1} width={18} height={18} />
            <Typography variant="sm" weight={600} className="text-slate-50">
              {underlying1?.toSignificant(6) || '0.00'} {token1?.symbol}
            </Typography>
          </div>
          <Typography variant="xs" className="text-slate-400">
            {formatUSD(value1)}
          </Typography>
        </div>
      </div>
      {row.farm && (
        <div className="flex flex-col gap-1.5 mt-4">
          <Typography variant="xs" className="mb-1 text-slate-500">
            Staked Position
          </Typography>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Currency.Icon currency={token0} width={18} height={18} />
              <Typography variant="sm" weight={600} className="text-slate-50">
                {stakedUnderlying0?.toSignificant(6) || '0.00'} {token0?.symbol}
              </Typography>
            </div>
            <Typography variant="xs" className="text-slate-400">
              {formatUSD(stakedValue0)}
            </Typography>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Currency.Icon currency={token1} width={18} height={18} />
              <Typography variant="sm" weight={600} className="text-slate-50">
                {stakedUnderlying1?.toSignificant(6) || '0.00'} {token1?.symbol}
              </Typography>
            </div>
            <Typography variant="xs" className="text-slate-400">
              {formatUSD(stakedValue1)}
            </Typography>
          </div>
        </div>
      )}
      {row.farm && pendingRewards.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-4">
          <Typography variant="xs" className="mb-1 text-slate-500">
            Farmed Rewards
          </Typography>
          {pendingRewards.map((reward, index) => (
            <div className="flex items-center justify-between gap-2" key={index}>
              <div className="flex items-center gap-2">
                <Currency.Icon currency={rewardTokens[index]} width={18} height={18} />
                <Typography variant="sm" weight={600} className="text-slate-50">
                  {reward?.toSignificant(6) || '0.00'} {rewardTokens[index]?.symbol}
                </Typography>
              </div>
              <Typography variant="xs" className="text-slate-400">
                {formatUSD(values[index])}
              </Typography>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2 mt-8 mb-2">
        {/* <Link.Internal href={`/${row.id}/remove`} passHref={true}> */}
        <Button as="a" href={`/earn/${row.id}/remove`} size="sm" variant="outlined" fullWidth>
          Withdraw
        </Button>
        {/* </Link.Internal> */}
        {/* <Link.Internal href={`/${row.id}/add`} passHref={true}> */}
        <Button as="a" href={`/earn/${row.id}/add`} size="sm" fullWidth>
          Deposit
        </Button>
        {/* </Link.Internal> */}
      </div>
    </div>
  )
}
