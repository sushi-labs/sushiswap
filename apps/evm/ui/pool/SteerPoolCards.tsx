'use client'

import { StarIcon } from '@heroicons/react/20/solid'
import { ArrowTrendingUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import FaceSmileIcon from '@heroicons/react/24/outline/FaceSmileIcon'
import { ShieldCheckIcon } from '@heroicons/react/24/solid'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  LinkInternal,
  Separator,
  Stat,
  StatLabel,
  StatValue,
} from '@sushiswap/ui'

export const SteerPoolCards = () => {
  return (
    <div className="flex justify-center gap-4">
      <LinkInternal href="/pool/8453:0x5f0a153a64fd734c111b770da11de2c385ca8042/positions/create/stable-strategy">
        <Card className="max-w-[400px] hover:border-blue-300 hover:shadow-md">
          <CardHeader>
            <div className="flex gap-2 pb-3">
              <Chip className="bg-blue/20 text-blue">
                <ShieldCheckIcon className="h-3 w-3" />
                Lowest risk
              </Chip>
            </div>
            <CardTitle>Stable Pool</CardTitle>
            <CardDescription>
              Uses Simple Moving Average and a predefined multiplier to construct a price range.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <Stat className="!p-0">
              <StatLabel>APR</StatLabel>
              <StatValue size="3xl">19.45%</StatValue>
            </Stat>
            <div className="h-[200px] bg-secondary rounded-xl flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Chart here</span>
            </div>
          </CardContent>
          <Separator />
          <div className="grid grid-cols-2 divide-x divide-accent">
            <Stat className="px-6 py-4">
              <StatLabel size="sm">TVL</StatLabel>
              <StatValue size="sm">$0.4m</StatValue>
            </Stat>
            <Stat className="px-6 py-4">
              <StatLabel size="sm">Fees 24h</StatLabel>
              <StatValue size="sm">$293.12</StatValue>
            </Stat>
          </div>
          <Separator />
          <div className="flex flex-col divide-y divide-accent">
            <div className="flex items-center p-6 gap-6">
              <FaceSmileIcon className="w-10 h-10 text-blue" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Good for like-kind assets and stable pairs</span>
                <span className="text-sm text-muted-foreground">Flexible adjustment to price movements.</span>
              </div>
            </div>
            <div className="flex items-center p-6 gap-6">
              <ExclamationCircleIcon className="w-10 h-10 text-gren" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Low impermanent loss risk</span>
                <span className="text-sm text-muted-foreground">
                  Real return is less likely to suffer from impermanent loss.
                </span>
              </div>
            </div>
          </div>
        </Card>
      </LinkInternal>
      <Card className="max-w-[400px] hover:border-blue-300 hover:shadow-md">
        <CardHeader>
          <div className="flex gap-2 pb-3">
            <Chip className="bg-yellow/20 text-yellow">
              <StarIcon className="h-3 w-3" />
              Best Yield
            </Chip>
            <Chip className="bg-green/20 text-green">
              <ArrowTrendingUpIcon className="h-3 w-3" /> Most Popular
            </Chip>
          </div>
          <CardTitle>Elastic Expansion Pool</CardTitle>
          <CardDescription>
            Uses Simple Moving Average and a predefined multiplier to construct a price range.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Stat className="!p-0">
            <StatLabel>APR</StatLabel>
            <StatValue size="3xl">114.45%</StatValue>
          </Stat>
          <div className="h-[200px] bg-secondary rounded-xl flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Chart here</span>
          </div>
        </CardContent>
        <Separator />
        <div className="grid grid-cols-2 divide-x divide-accent">
          <Stat className="px-6 py-4">
            <StatLabel size="sm">TVL</StatLabel>
            <StatValue size="sm">$7.8m</StatValue>
          </Stat>
          <Stat className="px-6 py-4">
            <StatLabel size="sm">Fees 24h</StatLabel>
            <StatValue size="sm">$345,293.12</StatValue>
          </Stat>
        </div>
        <Separator />
        <div className="flex flex-col divide-y divide-accent">
          <div className="flex items-center p-6 gap-6">
            <FaceSmileIcon className="w-10 h-10 text-blue" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Good for volatile pairs</span>
              <span className="text-sm text-muted-foreground">Flexible adjustment to price movements.</span>
            </div>
          </div>
          <div className="flex items-center p-6 gap-6">
            <ExclamationCircleIcon className="w-10 h-10 text-red" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">High impermanent loss risk</span>
              <span className="text-sm text-muted-foreground">Real return might suffer from impermanent loss.</span>
            </div>
          </div>
        </div>
      </Card>
      <Card className="max-w-[400px] hover:border-blue-300 hover:shadow-md">
        <CardHeader>
          <div className="h-8" />
          <CardTitle>Moving Volatility Pool</CardTitle>
          <CardDescription>
            Uses Simple Moving Average and a predefined multiplier to construct a price range.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Stat className="!p-0">
            <StatLabel>APR</StatLabel>
            <StatValue size="3xl">94.45%</StatValue>
          </Stat>
          <div className="h-[200px] bg-secondary rounded-xl flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Chart here</span>
          </div>
        </CardContent>
        <Separator />
        <div className="grid grid-cols-2 divide-x divide-accent">
          <Stat className="px-6 py-4">
            <StatLabel size="sm">TVL</StatLabel>
            <StatValue size="sm">$1.4m</StatValue>
          </Stat>
          <Stat className="px-6 py-4">
            <StatLabel size="sm">Fees 24h</StatLabel>
            <StatValue size="sm">$109,293.12</StatValue>
          </Stat>
        </div>
        <Separator />
        <div className="flex flex-col divide-y divide-accent">
          <div className="flex items-center p-6 gap-6">
            <FaceSmileIcon className="w-10 h-10 text-blue" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Good for like-kind assets and volatile pairs</span>
              <span className="text-sm text-muted-foreground">Flexible adjustment to price movements.</span>
            </div>
          </div>
          <div className="flex items-center p-6 gap-6">
            <ExclamationCircleIcon className="w-10 h-10 text-yellow" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Medium impermanent loss risk</span>
              <span className="text-sm text-muted-foreground">Real return might suffer from impermanent loss.</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
