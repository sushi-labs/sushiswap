import { formatPercent, formatUSD } from '@sushiswap/format'
import { Currency, Link } from '@sushiswap/ui'
import React, { FC, useCallback } from 'react'
import { PositionWithPool } from '../../../../types'
import { PoolPositionProvider, usePoolPosition } from '../../../PoolPositionProvider'
import { PoolPositionRewardsProvider, usePoolPositionRewards } from '../../../PoolPositionRewardsProvider'
import { PoolPositionStakedProvider, usePoolPositionStaked } from '../../../PoolPositionStakedProvider'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Button } from '@sushiswap/ui/future/components/button'
import { ArrowDownIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { useNetwork, useSwitchNetwork } from '@sushiswap/wagmi'
import { ZERO } from '@sushiswap/math'

interface PositionQuickHoverTooltipProps {
  row: PositionWithPool
}

export const PositionQuickHoverTooltip: FC<PositionQuickHoverTooltipProps> = ({ row }) => {
  return (
    <PoolPositionProvider pool={row.pool}>
      <PoolPositionStakedProvider watch={false} pool={row.pool}>
        <PoolPositionRewardsProvider pool={row.pool}>
          <_PositionQuickHoverTooltip row={row} />
        </PoolPositionRewardsProvider>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}

const _PositionQuickHoverTooltip: FC<PositionQuickHoverTooltipProps> = ({ row }) => {
  const { switchNetwork } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { underlying0, underlying1, value1, value0 } = usePoolPosition()
  const {
    underlying1: stakedUnderlying1,
    underlying0: stakedUnderlying0,
    value0: stakedValue0,
    value1: stakedValue1,
  } = usePoolPositionStaked()

  const { pendingRewards, rewardTokens, values, harvest } = usePoolPositionRewards()

  const _harvest = useCallback(() => {
    if (row.pool.chainId !== chain?.id) {
      switchNetwork?.(row.pool.chainId)
    } else if (harvest) {
      harvest()
    }
  }, [chain?.id, harvest, row.pool.chainId, switchNetwork])

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-gray-500 dark:text-slate-500">
          <span className="font-semibold text-gray-900 dark:text-slate-50">Total APR</span> • Rewards + Fees
        </span>
        <span className="text-3xl font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(row.pool.totalApr1d)}{' '}
          <span className="text-[10px] text-gray-500 dark:text-slate-500">
            {formatPercent(row.pool.incentiveApr)} + {formatPercent(row.pool.feeApr1d)}
          </span>
        </span>
      </div>
      <div className="flex gap-2">
        <Link.Internal href={`/${row.pool.id}/add`} passHref={true}>
          <Button as="a" size="xs" variant="outlined">
            <PlusIcon width={16} height={16} /> Deposit
          </Button>
        </Link.Internal>
        <Link.Internal href={`/${row.pool.id}/remove`} passHref={true}>
          <Button as="a" size="xs" variant="outlined">
            <MinusIcon width={16} height={16} /> Withdraw
          </Button>
        </Link.Internal>
        <Button as="a" size="xs" variant="outlined" onClick={_harvest}>
          <ArrowDownIcon width={16} height={16} /> Claim
        </Button>
      </div>

      <div className="max-h-[240px] scroll border-t border-gray-200 dark:border-slate-200/5 mt-2">
        {row.pool.incentives && pendingRewards.length > 0 && (
          <>
            <List className="!pt-5">
              <List.Label>Pending rewards</List.Label>
              <List.Control className="bg-gray-100 dark:bg-slate-700">
                {pendingRewards.map((reward, index) => (
                  <List.Item
                    key={index}
                    icon={Currency.Icon}
                    iconProps={{
                      currency: reward?.currency,
                      width: 24,
                      height: 24,
                    }}
                    title={
                      <div className="flex items-baseline gap-2">
                        {reward?.toSignificant(6) || '0.00'} {rewardTokens[index]?.symbol}
                        <span className="text-[10px] text-gray-600 dark:text-slate-400 text-slate-600">
                          {' '}
                          {formatUSD(values[index])}
                        </span>
                      </div>
                    }
                  />
                ))}
              </List.Control>
            </List>
          </>
        )}

        <List className="!pt-5">
          <div className="flex justify-between">
            <List.Label>Position</List.Label>
            <List.Label>{formatUSD(value0 + value1)}</List.Label>
          </div>
          <List.Control className="bg-gray-100 dark:bg-slate-700">
            <List.Item
              loading={!underlying0}
              icon={Currency.Icon}
              iconProps={{
                currency: underlying0?.currency,
                width: 24,
                height: 24,
              }}
              title={
                <div className="flex items-baseline gap-2">
                  {underlying0?.toSignificant(6)} {underlying0?.currency.symbol}
                  <span className="text-[10px] text-gray-600 dark:text-slate-400 text-slate-600">
                    {formatUSD(value0)}
                  </span>
                </div>
              }
            />
            <List.Item
              loading={!underlying1}
              icon={Currency.Icon}
              iconProps={{
                currency: underlying1?.currency,
                width: 24,
                height: 24,
              }}
              title={
                <div className="flex items-baseline gap-2">
                  {underlying1?.toSignificant(6)} {underlying1?.currency.symbol}
                  <span className="text-[10px] text-gray-600 dark:text-slate-400 text-slate-600">
                    {formatUSD(value1)}
                  </span>
                </div>
              }
            />
          </List.Control>
        </List>

        {row.pool.incentives && stakedUnderlying0?.greaterThan(ZERO) && stakedUnderlying1?.greaterThan(ZERO) && (
          <List className="!pt-5">
            <div className="flex justify-between">
              <List.Label>Staked Position</List.Label>
              <List.Label>{formatUSD(stakedValue0 + stakedValue1)}</List.Label>
            </div>
            <List.Control className="bg-gray-100 dark:bg-slate-700">
              <List.Item
                icon={Currency.Icon}
                iconProps={{
                  currency: stakedUnderlying0?.currency,
                  width: 24,
                  height: 24,
                }}
                title={
                  <div className="flex items-baseline gap-2">
                    {stakedUnderlying0?.toSignificant(6)} {stakedUnderlying0?.currency.symbol}
                    <span className="text-[10px] text-gray-600 dark:text-slate-400 text-slate-600">
                      {formatUSD(stakedValue1)}
                    </span>
                  </div>
                }
              />
              <List.Item
                icon={Currency.Icon}
                iconProps={{
                  currency: stakedUnderlying1?.currency,
                  width: 24,
                  height: 24,
                }}
                title={
                  <div className="flex items-baseline gap-2">
                    {stakedUnderlying1?.toSignificant(6) || '0.00'} {stakedUnderlying1?.currency.symbol}
                    <span className="text-[10px] text-gray-600 dark:text-slate-400 text-slate-600">
                      {formatUSD(stakedValue1)}
                    </span>
                  </div>
                }
              />
            </List.Control>
          </List>
        )}
      </div>
    </div>
  )
}
