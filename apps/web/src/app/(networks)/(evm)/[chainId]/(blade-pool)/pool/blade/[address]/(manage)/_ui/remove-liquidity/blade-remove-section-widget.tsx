'use client'

import { Card, Message, WidgetDescription, WidgetFooter } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Widget, WidgetHeader, WidgetTitle } from '@sushiswap/ui'
import React, { type FC, type ReactNode } from 'react'
import { formatUSD } from 'sushi'
import type { BladeChainId } from 'sushi/evm'
import { useBladePoolPosition } from '../blade-pool-position-provider'

interface BladeRemoveSectionWidgetProps {
  chainId: BladeChainId
  percentage: string
  totalUsdValue: number
  setPercentage(percentage: string): void
  children: ReactNode
}

export const BladeRemoveSectionWidget: FC<BladeRemoveSectionWidgetProps> = ({
  percentage,
  setPercentage,
  totalUsdValue,
  children,
}) => {
  const { balance } = useBladePoolPosition()

  const estimatedValue = totalUsdValue * (Number(percentage) / 100)

  return (
    <Widget id="removeLiquidity" variant="empty">
      <WidgetHeader>
        <WidgetTitle>Remove Liquidity</WidgetTitle>
        <WidgetDescription>
          Trade in your LP tokens to receive your underlying tokens
        </WidgetDescription>
      </WidgetHeader>
      {balance?.amount === 0n ? (
        <Message variant="warning" size="sm" className="mb-4">
          No LP tokens found. Are you sure you unstaked your LP tokens?
        </Message>
      ) : null}
      <div
        className={
          balance?.amount === 0n ? 'opacity-40 pointer-events-none' : ''
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

          {/* Simple estimated value display matching Figma */}
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-muted-foreground">
              Estimated Value
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-slate-50">
              {formatUSD(estimatedValue)}
            </span>
          </div>
        </div>
        <WidgetFooter>{children}</WidgetFooter>
      </div>
    </Widget>
  )
}
