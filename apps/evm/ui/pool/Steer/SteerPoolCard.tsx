import { Pool } from '@sushiswap/client'
import { formatPercent, formatUSD } from '@sushiswap/format'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  classNames,
  LinkInternal,
  Separator,
  Stat,
  StatLabel,
  StatValue,
} from '@sushiswap/ui'
import { FC } from 'react'

import { SteerStrategyConfig } from './constants'
import { SteerAPRChart } from './SteerAPRChart'
import { SteerAPRHoverCard } from './SteerAPRHoverCard'
import { SteerLiquidityDistributionWidget } from './SteerLiquidityDistributionWidget/SteerLiquidityDistributionWidget'

interface SteerPoolCardProps {
  pool: Pool
  vault: Pool['steerVaults'][0]
}

export const SteerPoolCard: FC<SteerPoolCardProps> = ({ pool, vault }) => {
  return (
    <LinkInternal href={`/pool/${pool.id}/smart/${vault.id}`}>
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
            <StatLabel>Weekly APR</StatLabel>
            <SteerAPRHoverCard pool={pool} vault={vault}>
              <StatValue
                size="sm"
                className={classNames(pool.isIncentivized && 'underline decoration-dotted underline-offset-3')}
              >
                {formatPercent(vault.apr1w + pool.incentiveApr)}
              </StatValue>
            </SteerAPRHoverCard>
          </Stat>
          <div className="h-[200px] rounded-xl flex items-center justify-center">
            <SteerAPRChart vault={vault} />
          </div>
        </CardContent>
        <Separator />
        <div className="grid grid-cols-2 divide-x divide-accent">
          <Stat className="px-6 py-4">
            <StatLabel size="sm">TVL</StatLabel>
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
          <SteerLiquidityDistributionWidget vault={vault} />
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
