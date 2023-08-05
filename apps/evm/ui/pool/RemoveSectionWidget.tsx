'use client'

import { CogIcon } from '@heroicons/react-v1/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { classNames, List, WidgetDescription, WidgetFooter } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency as UICurrency } from '@sushiswap/ui/components/currency'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/components/settings'
import { Widget, WidgetHeader, WidgetTitle } from '@sushiswap/ui/components/widget'
import React, { FC, ReactNode } from 'react'

import { usePoolPosition } from './PoolPositionProvider'

interface RemoveSectionWidgetProps {
  isFarm: boolean
  chainId: ChainId
  percentage: string
  token0: Type
  token1: Type
  token0Minimum?: Amount<Type>
  token1Minimum?: Amount<Type>
  setPercentage(percentage: string): void
  children: ReactNode
}

export const RemoveSectionWidget: FC<RemoveSectionWidgetProps> = ({
  chainId,
  percentage,
  setPercentage,
  token0,
  token0Minimum,
  token1Minimum,
  children,
}) => {
  const { balance } = usePoolPosition()

  return (
    <Widget id="removeLiquidity" variant="empty">
      <div
        data-state={balance?.[FundSource.WALLET]?.greaterThan(ZERO) ? 'closed' : 'open'}
        className={classNames(
          'data-[state=open]:opacity-80 bg-gray-50 dark:bg-slate-900 data-[state=closed]:pointer-events-none opacity-0 z-10 absolute inset-0'
        )}
      />
      <WidgetHeader>
        <WidgetTitle>Remove Liquidity</WidgetTitle>
        <WidgetDescription>If you dont see your balance, maybe you forgot to unstake first?</WidgetDescription>
      </WidgetHeader>
      <div className="p-3 pb-2 space-y-2 overflow-hidden bg-white rounded-xl dark:bg-secondary">
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="py-1 text-3xl text-gray-900 dark:text-slate-50">{percentage}%</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              fullWidth
              variant={percentage === '25' ? 'default' : 'secondary'}
              onClick={() => setPercentage('25')}
              testId="remove-liquidity-25"
            >
              25%
            </Button>
            <Button
              size="sm"
              fullWidth
              variant={percentage === '50' ? 'default' : 'secondary'}
              onClick={() => setPercentage('50')}
              testId="remove-liquidity-50"
            >
              50%
            </Button>
            <Button
              size="sm"
              fullWidth
              variant={percentage === '75' ? 'default' : 'secondary'}
              onClick={() => setPercentage('75')}
              testId="remove-liquidity-75"
            >
              75%
            </Button>
            <Button
              size="sm"
              fullWidth
              variant={percentage === '100' ? 'default' : 'secondary'}
              onClick={() => setPercentage('100')}
              testId="remove-liquidity-max"
            >
              MAX
            </Button>
            <SettingsOverlay
              options={{
                slippageTolerance: {
                  storageKey: 'removeLiquidity',
                  defaultValue: '0.5',
                  title: 'Remove Liquidity Slippage',
                },
              }}
              modules={[SettingsModule.SlippageTolerance]}
            >
              <IconButton size="sm" name="Settings" icon={CogIcon} variant="secondary" className="!rounded-xl" />
            </SettingsOverlay>
          </div>
        </div>
        <div className="px-1 pt-2 pb-3">
          <input
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            type="range"
            min="1"
            max="100"
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
          />
        </div>
      </div>
      <List className="!pt-6">
        <List.Label>You&apos;ll receive at least:</List.Label>
        <List.Control className="!bg-secondary">
          {token0Minimum ? (
            <List.KeyValue flex title={`${token0Minimum.currency.symbol}`}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <UICurrency.Icon currency={token0Minimum.currency} width={18} height={18} />
                  {token0Minimum.toSignificant(4)}{' '}
                  {Native.onChain(chainId).wrapped.address === token0.wrapped.address
                    ? Native.onChain(chainId).symbol
                    : token0Minimum?.currency.symbol}
                </div>
              </div>
            </List.KeyValue>
          ) : null}
          {token1Minimum ? (
            <List.KeyValue flex title={`${token1Minimum.currency.symbol}`}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <UICurrency.Icon currency={token1Minimum.currency} width={18} height={18} />
                  {token1Minimum.toSignificant(4)}{' '}
                  {Native.onChain(chainId).wrapped.address === token0.wrapped.address
                    ? Native.onChain(chainId).symbol
                    : token1Minimum?.currency.symbol}
                </div>
              </div>
            </List.KeyValue>
          ) : null}
        </List.Control>
      </List>
      <WidgetFooter>{children}</WidgetFooter>
    </Widget>
  )
}
