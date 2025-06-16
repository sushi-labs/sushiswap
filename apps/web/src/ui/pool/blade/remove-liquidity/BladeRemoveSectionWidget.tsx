'use client'

import {
  Card,
  CardGroup,
  CardLabel,
  Currency,
  Message,
  WidgetDescription,
  WidgetFooter,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Widget, WidgetHeader, WidgetTitle } from '@sushiswap/ui'
import React, { type FC, type ReactNode } from 'react'
import type { BladeChainId } from 'sushi/config'
import type { Type } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { ZERO } from 'sushi/math'
import { useBladePoolPosition } from '../BladePoolPositionProvider'

interface BladeRemoveSectionWidgetProps {
  chainId: BladeChainId
  percentage: string
  tokensMinimum: Array<{ usdValue: number; currency: Type }>
  setPercentage(percentage: string): void
  children: ReactNode
}

export const BladeRemoveSectionWidget: FC<BladeRemoveSectionWidgetProps> = ({
  percentage,
  setPercentage,
  tokensMinimum,
  children,
}) => {
  const { balance } = useBladePoolPosition()

  return (
    <Widget id="removeLiquidity" variant="empty">
      <WidgetHeader>
        <WidgetTitle>Remove Liquidity</WidgetTitle>
        <WidgetDescription>
          Trade in your LP tokens to receive your underlying tokens
        </WidgetDescription>
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
              {tokensMinimum.map((tokenData, index) => (
                <div
                  className="flex items-center gap-2 justify-between"
                  key={index}
                >
                  <div className="flex items-center gap-2">
                    <Currency.Icon
                      currency={tokenData.currency}
                      width={18}
                      height={18}
                    />
                    <span className="text-sm font-medium text-gray-500">
                      {tokenData.currency.wrapped.symbol}
                    </span>
                  </div>

                  <span className="text-sm font-normal text-gray-400">
                    {formatUSD(tokenData.usdValue)}
                  </span>
                </div>
              ))}
              {tokensMinimum.length === 0 && (
                <div className="text-sm text-muted-foreground py-2">
                  No tokens to receive
                </div>
              )}
            </CardGroup>
          </Card>
        </div>
        <WidgetFooter>{children}</WidgetFooter>
      </div>
    </Widget>
  )
}
