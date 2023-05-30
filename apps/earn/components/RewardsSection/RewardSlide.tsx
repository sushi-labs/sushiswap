import React, { FC, ReactNode, useMemo } from 'react'
import { useAngleRewardsMultipleChains } from '@sushiswap/react-query'
import { Chain } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { useTokenAmountDollarValues } from '../../lib/hooks'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { formatNumber } from '@sushiswap/format'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Explainer } from '@sushiswap/ui/future/components/Explainer'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import Button from '@sushiswap/ui/future/components/button/Button'
import { ConcentratedLiquidityHarvestButton } from '../ConcentratedLiquidityHarvestButton'
import { Address } from 'wagmi'

export const RewardSlide: FC<{
  address: Address | undefined
  data: NonNullable<ReturnType<typeof useAngleRewardsMultipleChains>['data']>[0]
}> = ({ address, data }) => {
  const unclaimed = useMemo(
    () =>
      Object.values(
        Object.values(data.pools ?? []).reduce<Record<string, Amount<Token>>>((acc, cur) => {
          Object.values(cur.rewardsPerToken).forEach((val) => {
            if (!acc[val.unclaimed.currency.address]) {
              acc[val.unclaimed.currency.address] = val.unclaimed
            } else {
              acc[val.unclaimed.currency.address] = acc[val.unclaimed.currency.address].add(val.unclaimed)
            }
          })

          return acc
        }, {})
      ),
    []
  )

  const dollarValues = useTokenAmountDollarValues({ chainId: data.chainId, amounts: unclaimed })

  return (
    <div className="flex flex-col relative bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all rounded-2xl p-7 overflow-hidden w-[320px]">
      <span className="uppercase text-xs font-semibold dark:text-slate-400 text-gray-600">
        {Chain.from(data.chainId).name}
      </span>
      <h1 className="text-2xl font-semibold dark:text-white text-gray-900">
        ${dollarValues.reduce((acc, cur) => acc + +formatNumber(cur), 0)}
      </h1>
      <div className="flex flex-col gap-1 mt-4 flex-grow">
        <span className="font-medium flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
          Claimable{' '}
          {unclaimed.length > 0 && (
            <Explainer hover iconSize={16} placement="bottom" width={320}>
              <List className="!pt-0 ">
                <List.Label>Claimable on {Chain.from(data.chainId).name}</List.Label>
                <List.Control>
                  {unclaimed.map((el, i) => (
                    <List.KeyValue key={i} flex title={`${el.currency.symbol}`}>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Currency.Icon currency={el.currency} width={18} height={18} />
                          {el.toSignificant(4)} {el.currency.symbol}
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
          {unclaimed.length === 0 ? (
            <span className="text-sm font-light text-gray-500 dark:text-slate-500">No rewards found</span>
          ) : (
            React.Children.toArray(
              unclaimed.map((el, i) => {
                return (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-4 h-4">
                      <Currency.Icon currency={el.currency} width={18} height={18} />
                    </div>
                    <span className="text-sm ">{el.toSignificant(4)}</span>
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
              <Checker.Connect fullWidth variant="outlined">
                <Checker.Network fullWidth variant="outlined" chainId={data.chainId}>
                  <Button fullWidth disabled={isLoading} onClick={() => write?.()} variant="outlined">
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
