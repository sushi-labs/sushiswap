'use client'

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

export default function PositionsCreatePage({ params }: { params: { id: string } }) {
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
            <div className="flex flex-col gap-4"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Moving Volatility Pool</CardTitle>
            <CardDescription>
              This strategy determines a range for its liquidity by calculating the midpoint using the simple moving
              average (SMA) of an asset’s price over a given period of time{' '}
            </CardDescription>
          </CardHeader>
          <Separator />
          <div className="grid grid-cols-2">
            <Stat className="px-6 py-3">
              <StatLabel size="sm">APR</StatLabel>
              <StatValue size="sm">114.45</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">TVL</StatLabel>
              <StatValue size="sm">$7.8m</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">ETH:DAI Ratio (%)</StatLabel>
              <StatValue size="sm">22% : 78%</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Adjustment frequency</StatLabel>
              <StatValue size="sm">Every 12 Hours</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Next Adjustment</StatLabel>
              <StatValue size="sm">00:12m:30s</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Liquidity pool fee</StatLabel>
              <StatValue size="sm">0.05%</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Time frame</StatLabel>
              <StatValue size="sm">20 days</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Deviation</StatLabel>
              <StatValue size="sm">2</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Management fee</StatLabel>
              <StatValue size="sm">10%</StatValue>
            </Stat>
          </div>
          <Separator />
          <CardHeader>
            <CardTitle>Liquidity Distribution</CardTitle>
          </CardHeader>
          <div className="px-6">
            <div className="h-[200px] bg-secondary rounded-xl flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Liquidity distribution here</span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <Stat className="p-6">
              <StatLabel size="sm">Minimum price</StatLabel>
              <StatValue size="sm">0.0005097 ETH/DAI</StatValue>
            </Stat>
            <Stat className="p-6">
              <StatLabel size="sm">Maximum price</StatLabel>
              <StatValue size="sm">0.0007297 ETH/DAI</StatValue>
            </Stat>
          </div>
        </Card>
      </div>
    </Container>
  )
}
