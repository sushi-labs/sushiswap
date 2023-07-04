import { Chain } from '@sushiswap/chain'
import { formatNumber } from '@sushiswap/format'
import { useAngleRewardsMultipleChains } from '@sushiswap/react-query'
import { SkeletonBox, SkeletonText } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Explainer } from '@sushiswap/ui/components/explainer'
import { List } from '@sushiswap/ui/components/list/List'
import { Address } from '@sushiswap/wagmi'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import React, { FC, ReactNode } from 'react'

import { ConcentratedLiquidityHarvestButton } from '../ConcentratedLiquidityHarvestButton'

interface RewardSlide {
  address: Address | undefined
  data: NonNullable<ReturnType<typeof useAngleRewardsMultipleChains>['data']>[0]
}

export const RewardSlide: FC<RewardSlide> = ({ address, data }) => {
  return (
    <div className="flex flex-col relative bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all rounded-2xl p-7 overflow-hidden w-[320px]">
      <span className="text-xs font-semibold text-gray-600 uppercase dark:text-slate-400">
        {Chain.from(data.chainId).name}
      </span>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        ${data.unclaimed.reduce((acc, cur) => acc + +formatNumber(cur.amountUSD), 0)}
      </h1>
      <div className="flex flex-col flex-grow gap-1 mt-4">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-slate-400">
          Claimable{' '}
          {data.unclaimed.length > 0 && (
            <Explainer>
              <List className="!pt-0 ">
                <List.Label>Claimable on {Chain.from(data.chainId).name}</List.Label>
                <List.Control>
                  {data.unclaimed.map((el) => (
                    <List.KeyValue key={el.amount.currency.id} flex title={`${el.amount.currency.symbol}`}>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Currency.Icon currency={el.amount.currency} width={18} height={18} />
                          {el.amount.toSignificant(4)} {el.amount.currency.symbol}
                        </div>
                      </div>
                    </List.KeyValue>
                  ))}
                </List.Control>
                <List.Label className="font-normal">
                  Claiming will harvest all your rewards for all your V3 Positions on {Chain.from(data.chainId).name}.
                </List.Label>
              </List>
            </Explainer>
          )}
        </span>
        <div className="flex gap-1.5 truncate flex-grow h-full">
          {data.unclaimed.length === 0 ? (
            <span className="text-sm font-light text-gray-500 dark:text-slate-500">No rewards found</span>
          ) : (
            React.Children.toArray(
              data.unclaimed.map((el) => {
                return (
                  <div key={el.amount.currency.id} className="flex items-center gap-1">
                    <div className="w-4 h-4">
                      <Currency.Icon currency={el.amount.currency} width={18} height={18} />
                    </div>
                    <span className="text-sm ">{el.amount.toSignificant(4)}</span>
                  </div>
                )
              })
            )
              .reduce<ReactNode[]>((previousValue, currentValue) => {
                return [...previousValue, currentValue, '+']
              }, [])
              .slice(0, -1)
          )}
        </div>
        <div className="mt-4">
          <ConcentratedLiquidityHarvestButton account={address} chainId={data.chainId}>
            {({ write, isLoading }) => (
              <Checker.Connect fullWidth={false} size="sm" variant="secondary">
                <Checker.Network fullWidth={false} size="sm" variant="secondary" chainId={data.chainId}>
                  <Button
                    fullWidth={false}
                    size="sm"
                    disabled={isLoading}
                    onClick={() => write?.()}
                    variant="secondary"
                  >
                    Claim
                  </Button>
                </Checker.Network>
              </Checker.Connect>
            )}
          </ConcentratedLiquidityHarvestButton>
        </div>
      </div>
    </div>
  )
}

export const RewardSlideSkeleton: FC = () => {
  return (
    <div className="flex flex-col relative bg-white dark:bg-slate-800 shadow-md hover:shadow-lg rounded-2xl p-7 overflow-hidden w-[320px] h-[220px]">
      <SkeletonText fontSize="xs" className="w-[50px]" />
      <SkeletonText fontSize="2xl" className="w-[90px]" />
      <div className="flex flex-col flex-grow gap-1 mt-4">
        <SkeletonText fontSize="sm" className="w-[50px]" />
        <SkeletonText fontSize="sm" className="w-[90px]" />
      </div>
      <div className="mt-4">
        <SkeletonBox className="w-[140px] h-[36px]" />
      </div>
    </div>
  )
}
