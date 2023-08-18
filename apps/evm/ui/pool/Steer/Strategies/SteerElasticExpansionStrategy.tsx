'use client'

import { formatPercent, formatUSD } from '@sushiswap/format'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Separator,
  Stat,
  StatLabel,
  StatValue,
} from '@sushiswap/ui'
import { useEffect, useRef } from 'react'

import { SteerStrategyConfig } from '../constants'
import { SteerStrategyLiquidityDistribution } from '../LiquidityChart/SteerStrategyLiquidityDistribution'
import { SteerStrategyComponent } from '.'

export const SteerElasticExpansionStrategy: SteerStrategyComponent = ({
  vault,
  generic: { priceExtremes, tokenRatios, adjustment, positions },
}) => {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    container.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <Container ref={container} maxWidth="5xl" className="px-2 sm:px-4">
      <div className="flex gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Liquidity</CardTitle>
            <CardDescription>
              Depending on your range, the supplied tokens for this position will not always be a 50:50 ratio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{SteerStrategyConfig[vault.strategy].name}</CardTitle>
            <CardDescription>{SteerStrategyConfig[vault.strategy].description}</CardDescription>
          </CardHeader>
          <Separator />
          <div className="grid grid-cols-2">
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Weekly APR</StatLabel>
              <StatValue size="sm">{formatPercent(vault.apr)}</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">TVL</StatLabel>
              <StatValue size="sm">{formatUSD(vault.reserveUSD)}</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">
                {vault.token0.symbol}:{vault.token1.symbol} Ratio (%)
              </StatLabel>
              <StatValue size="sm">
                {formatPercent(tokenRatios.token0)} : {formatPercent(tokenRatios.token1)}
              </StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Adjustment frequency</StatLabel>
              {/* TODO: Improve */}
              <StatValue size="sm">Every {adjustment.frequency}</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">{adjustment.next.includes('ago') ? 'Last' : 'Next'} Adjustment</StatLabel>
              <StatValue size="sm">{adjustment.next}</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Liquidity pool fee</StatLabel>
              <StatValue size="sm">{formatPercent(vault.pool.swapFee)}</StatValue>
            </Stat>
            {/* <Stat className="px-6 py-3">
              <StatLabel size="sm">Time frame</StatLabel>
              <StatValue size="sm">20 days</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Deviation</StatLabel>
              <StatValue size="sm">2</StatValue>
            </Stat> */}
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Management fee</StatLabel>
              <StatValue size="sm">{formatPercent(vault.performanceFee)}</StatValue>
            </Stat>
          </div>
          <Separator />
          <CardHeader>
            <CardTitle>Liquidity Distribution</CardTitle>
          </CardHeader>
          <div className="px-6">
            <div className="h-[200px] w-full bg-secondary rounded-xl flex items-center justify-center">
              {/* <span className="text-xs text-muted-foreground">Liquidity distribution here</span> */}
              <SteerStrategyLiquidityDistribution pool={vault.pool} positions={positions} />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <Stat className="p-6">
              <StatLabel size="sm">Minimum price</StatLabel>
              <StatValue size="sm">{priceExtremes.min} ETH/DAI</StatValue>
            </Stat>
            <Stat className="p-6">
              <StatLabel size="sm">Maximum price</StatLabel>
              <StatValue size="sm">{priceExtremes.max} ETH/DAI</StatValue>
            </Stat>
          </div>
        </Card>
      </div>
    </Container>
  )
}
