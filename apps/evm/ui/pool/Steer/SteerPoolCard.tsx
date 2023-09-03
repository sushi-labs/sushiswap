import { Pool } from '@sushiswap/client'
import { formatPercent, formatUSD } from '@sushiswap/format'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  classNames,
  LinkInternal,
  Separator,
  Stat,
  StatLabel,
  StatValue,
} from '@sushiswap/ui'
import { FC } from 'react'

import { SteerStrategyConfig } from './constants'
import { SteerTokenDistributionBar } from './SteerTokenDistributionBar'

interface SteerPoolCardProps {
  pool: Pool
  vault: Pool['steerVaults'][0]
}

export const SteerPoolCard: FC<SteerPoolCardProps> = ({ pool, vault }) => {
  // Gotta use the current pool tick, don't have a nice fetcher for that though, maybe Flair?
  const inRange = vault.lowerTick < 10 && vault.upperTick > 10

  return (
    <LinkInternal href={`/pool/${pool.id}/positions/create/${vault.id}`}>
      <Card className={classNames('max-w-[400px] hover:border-blue-300 hover:shadow-md')}>
        <CardHeader>
          {/* <div className="flex gap-2 pb-3">
            <Chip className="bg-blue/20 text-blue">
              <ShieldCheckIcon className="h-3 w-3" />
              Lowest risk
            </Chip>
          </div> */}
          <CardTitle>{SteerStrategyConfig[vault.strategy].name}</CardTitle>
          <CardDescription>{SteerStrategyConfig[vault.strategy].description}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Stat className="!p-0">
            {/* Gotta use the weekly APR for now, as that's what's provided by Steer, can look into getting custom APRs later */}
            <StatLabel>Weekly APR</StatLabel>
            <StatValue size="3xl">{formatPercent(vault.apr)}</StatValue>
          </Stat>
          <div className="h-[200px] bg-secondary rounded-xl flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Chart here</span>
          </div>
        </CardContent>
        <Separator />
        <div className="grid grid-cols-2 divide-x divide-accent">
          <Stat className="px-6 py-4">
            <StatLabel size="sm">TVL</StatLabel>
            {/* vault.reserveUSD */}
            <StatValue size="sm">{formatUSD(vault.reserveUSD)}</StatValue>
          </Stat>
          <Stat className="px-6 py-4">
            <StatLabel size="sm">Total Fees</StatLabel>
            {/* vault.feesUSD, will have to be total for now, will fix later */}
            <StatValue size="sm">{formatUSD(vault.feesUSD)}</StatValue>
          </Stat>
        </div>
        <Separator />
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <CardTitle>Liquidity Distribution</CardTitle>

            <Chip
              variant={'outline'}
              className={classNames(
                inRange ? 'bg-green/20 text-green hover:bg-green/40' : 'bg-red/20 text-red hover:bg-red/[0.35]',
                'space-x-1'
              )}
            >
              <div className={classNames(inRange ? 'bg-green' : 'bg-red', 'w-2 h-2 rounded-full')} />
              {inRange ? 'In' : 'Out of'} Range
            </Chip>
          </div>
          <SteerTokenDistributionBar vault={vault} />
        </CardContent>
        {/* <div className="flex flex-col divide-y divide-accent">
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
        </div> */}
      </Card>
    </LinkInternal>
  )
}
