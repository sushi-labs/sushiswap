'use client'

import { formatPercent, formatUSD } from '@sushiswap/format'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Stat,
  StatLabel,
  StatValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { useEffect, useRef } from 'react'

import { SteerStrategyConfig } from '../constants'
import {
  SteerPositionAdd,
  SteerPositionAddProvider,
  SteerPositionDetails,
  SteerPositionRemove,
} from '../LiquidityManagement'
import { SteerStrategyLiquidityDistribution } from '../SteerStrategyLiquidityChart'
import { SteerStrategyComponent } from '.'

export const SteerElasticExpansionStrategy: SteerStrategyComponent = ({
  vault,
  generic: { priceExtremes, tokenRatios, adjustment, positions },
}) => {
  const rootDiv = useRef<HTMLDivElement>(null)
  useEffect(() => {
    rootDiv.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div ref={rootDiv} className="flex gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Liquidity</CardTitle>
          <CardDescription>
            Depending on your range, the supplied tokens for this position will not always be a 50:50 ratio.
          </CardDescription>
        </CardHeader>
        <Tabs className="w-full" defaultValue="add">
          <CardContent>
            <TabsList className="!flex">
              <TabsTrigger testdata-id="add-tab" value="add" className="flex flex-1">
                Add
              </TabsTrigger>
              <TabsTrigger testdata-id="remove-tab" value="remove" className="flex flex-1">
                Remove
              </TabsTrigger>
              <TabsTrigger testdata-id="position-tab" value="position" className="flex flex-1">
                Position
              </TabsTrigger>
            </TabsList>
          </CardContent>
          <div className="px-6">
            <Separator />
          </div>
          <TabsContent value="add">
            <CardHeader>
              <CardTitle>Add liquidity</CardTitle>
              <CardDescription>Provide liquidity to earn fees & rewards.</CardDescription>
            </CardHeader>
            <CardContent>
              <SteerPositionAddProvider>
                <SteerPositionAdd vault={vault} />
              </SteerPositionAddProvider>
            </CardContent>
          </TabsContent>
          <TabsContent value="remove">
            <CardHeader>
              <CardTitle>Remove liquidity</CardTitle>
              <CardDescription>Please enter how much of the position you want to remove.</CardDescription>
            </CardHeader>
            <CardContent>
              <SteerPositionRemove vault={vault} />
            </CardContent>
          </TabsContent>
          <TabsContent value="position">
            <SteerPositionDetails vault={vault} />
          </TabsContent>
        </Tabs>
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
  )
}
