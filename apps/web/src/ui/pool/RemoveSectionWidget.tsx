'use client'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import {
  Card,
  CardCurrencyAmountItem,
  CardGroup,
  CardLabel,
  Message,
  WidgetAction,
  WidgetDescription,
  WidgetFooter,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { IconButton } from '@sushiswap/ui'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { Widget, WidgetHeader, WidgetTitle } from '@sushiswap/ui'
import React, { FC, ReactNode } from 'react'
import { EvmChainId } from 'sushi/chain'
import { Amount, Type } from 'sushi/currency'
import { ZERO } from 'sushi/math'

import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import { getDefaultTTL } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { usePoolPosition } from './PoolPositionProvider'

interface RemoveSectionWidgetProps {
  isFarm: boolean
  chainId: EvmChainId
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
  token0Minimum,
  token1Minimum,
  children,
}) => {
  const { balance } = usePoolPosition()

  return (
    <Widget id="removeLiquidity" variant="empty">
      <WidgetHeader>
        <WidgetTitle>Remove Liquidity</WidgetTitle>
        <WidgetDescription>
          Trade in your LP tokens to receive your underlying tokens
        </WidgetDescription>
        <WidgetAction variant="empty">
          <SettingsOverlay
            options={{
              slippageTolerance: {
                storageKey: SlippageToleranceStorageKey.RemoveLiquidity,
                title: 'Remove Liquidity Slippage',
              },
              transactionDeadline: {
                storageKey: TTLStorageKey.RemoveLiquidity,
                defaultValue: getDefaultTTL(chainId).toString(),
              },
            }}
            modules={[
              SettingsModule.SlippageTolerance,
              SettingsModule.TransactionDeadline,
            ]}
          >
            <IconButton
              size="sm"
              name="Settings"
              icon={Cog6ToothIcon}
              variant="secondary"
            />
          </SettingsOverlay>
        </WidgetAction>
      </WidgetHeader>
      {balance?.equalTo(ZERO) ? (
        <Message variant="warning" size="sm" className="mb-4">
          No LP tokens found. Are you sure you unstaked your LP tokens?
        </Message>
      ) : null}
      <div
        className={
          balance?.equalTo(ZERO) ? 'opacity-40 pointer-events-none' : ''
        }
      >
        <div className="flex flex-col gap-6">
          <Card variant="outline" className="p-6">
            <div className="flex justify-between gap-4">
              <div>
                <h1 className="py-1 text-3xl text-gray-900 dark:text-slate-50">
                  {percentage}%
                </h1>
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
          </Card>
          <Card variant="outline" className="p-6">
            <CardGroup>
              <CardLabel>You&apos;ll receive at least:</CardLabel>
              <CardCurrencyAmountItem amount={token0Minimum} />
              <CardCurrencyAmountItem amount={token1Minimum} />
            </CardGroup>
          </Card>
        </div>
        <WidgetFooter>{children}</WidgetFooter>
      </div>
    </Widget>
  )
}
