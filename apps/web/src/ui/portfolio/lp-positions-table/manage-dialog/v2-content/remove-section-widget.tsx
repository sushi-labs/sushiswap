'use client'

import {
  Card,
  CardCurrencyAmountItem,
  CardGroup,
  CardLabel,
  Message,
  WidgetFooter,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui'
import React, { type FC, type ReactNode } from 'react'
import { usePoolPosition } from 'src/ui/pool'
import type { Amount, Type } from 'sushi/currency'
import { ZERO } from 'sushi/math'

interface RemoveSectionWidgetProps {
  isFarm: boolean
  percentage: string
  token0: Type
  token1: Type
  token0Minimum?: Amount<Type>
  token1Minimum?: Amount<Type>
  setPercentage(percentage: string): void
  children: ReactNode
}

export const RemoveSectionWidget: FC<RemoveSectionWidgetProps> = ({
  percentage,
  setPercentage,
  token0Minimum,
  token1Minimum,
  children,
}) => {
  const { balance } = usePoolPosition()

  return (
    <Widget id="removeLiquidity" variant="empty">
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
        <div className="flex flex-col gap-3">
          <Card
            variant="outline"
            className="p-5 border-none pb-2 space-y-2 overflow-hidden bg-background rounded-xl dark:bg-background"
          >
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
                  variant={percentage === '25' ? 'networks' : 'secondary'}
                  onClick={() => setPercentage('25')}
                  testId="remove-liquidity-25"
                >
                  25%
                </Button>
                <Button
                  size="sm"
                  fullWidth
                  variant={percentage === '50' ? 'networks' : 'secondary'}
                  onClick={() => setPercentage('50')}
                  testId="remove-liquidity-50"
                >
                  50%
                </Button>
                <Button
                  size="sm"
                  fullWidth
                  variant={percentage === '75' ? 'networks' : 'secondary'}
                  onClick={() => setPercentage('75')}
                  testId="remove-liquidity-75"
                >
                  75%
                </Button>
                <Button
                  size="sm"
                  fullWidth
                  variant={percentage === '100' ? 'networks' : 'secondary'}
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
                className="w-full h-1 bg-gray-50 rounded-lg appearance-none cursor-pointer range-lg dark:bg-slate-800"
              />
            </div>
          </Card>
          <Card variant="outline" className="border-none space-y-3 !p-1">
            <CardGroup>
              <CardLabel className="dark:text-[#9CA3AF]">
                You&apos;ll receive at least:
              </CardLabel>
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
