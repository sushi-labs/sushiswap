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
import React, { type FC, type ReactNode } from 'react'
import { type Amount, Percent, ZERO } from 'sushi'
import type { EvmChainId, EvmCurrency } from 'sushi/evm'

import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import { getDefaultTTL } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { usePoolPosition } from '../../../_common/ui/pool-position-provider'

interface RemoveSectionWidgetProps {
  isFarm: boolean
  chainId: EvmChainId
  percentage: string
  token0: EvmCurrency
  token1: EvmCurrency
  token0Minimum?: Amount<EvmCurrency>
  token1Minimum?: Amount<EvmCurrency>
  setPercentage(percentage: string): void
  children: ReactNode
  denominator: number
  setDenominator(denominator: number): void
  amountToRemove: Amount<EvmCurrency> | undefined
}
const DENOMINATOR_OPTIONS = [
  { value: 100, label: '0' },
  { value: 1000, label: '1' },
  { value: 10000, label: '2' },
  { value: 100000, label: '3' },
  { value: 1000000, label: '4' },
  { value: 10000000, label: '5' },
]

export const RemoveSectionWidget: FC<RemoveSectionWidgetProps> = ({
  chainId,
  percentage,
  setPercentage,
  token0Minimum,
  token1Minimum,
  children,
  denominator,
  setDenominator,
  amountToRemove,
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
      {balance?.eq(ZERO) ? (
        <Message variant="warning" size="sm" className="mb-4">
          No LP tokens found. Are you sure you unstaked your LP tokens?
        </Message>
      ) : null}
      <div
        className={balance?.eq(ZERO) ? 'opacity-40 pointer-events-none' : ''}
      >
        <div className="flex flex-col gap-6">
          <Card variant="outline" className="p-6">
            <div className="flex justify-betwee flex-col gap-4">
              <div>
                <h1 className="py-1 text-3xl text-gray-900 dark:text-slate-50">
                  {new Percent({
                    numerator: percentage,
                    denominator: denominator,
                  }).toString({ fixed: denominator.toString().length - 3 })}
                  %
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {DENOMINATOR_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    fullWidth
                    variant={
                      denominator === option.value ? 'default' : 'secondary'
                    }
                    onClick={() => {
                      setPercentage('0')
                      setDenominator(option.value)
                    }}
                    testId={`remove-liquidity-denominator-${option.value}`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="px-1 pt-2 pb-3">
              <input
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                type="range"
                min="1"
                max={denominator.toString()}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
              />
            </div>
          </Card>
          <Card variant="outline" className="p-6">
            <CardGroup>
              <CardLabel>You&apos;ll receive at least:</CardLabel>
              <CardCurrencyAmountItem amount={amountToRemove} />
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
