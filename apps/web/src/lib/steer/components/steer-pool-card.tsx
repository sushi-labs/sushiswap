import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LinkInternal,
  Separator,
  Stat,
  StatLabel,
  StatValue,
  classNames,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { formatPercent, formatUSD } from 'sushi'
import {
  type PoolWithFeeAprs,
  type PoolWithIncentives,
  getEvmChainById,
} from 'sushi/evm'
import { APRHoverCard } from '~evm/[chainId]/_ui/apr-hover-card'
import { SteerAPRChart } from './steer-apr-chart'
import { SteerLiquidityDistributionWidget } from './steer-liquidity-distribution-widget/steer-liquidity-distribution-widget'

interface SteerPoolCardProps {
  pool: PoolWithIncentives<PoolWithFeeAprs>
  vault: VaultV1
}

export const SteerPoolCard: FC<SteerPoolCardProps> = ({ pool, vault }) => {
  return (
    <LinkInternal
      href={`/${getEvmChainById(vault.chainId).key}/pool/v3/${vault.poolAddress}/smart/${
        vault.address
      }`}
    >
      <Card
        className={classNames(
          'max-w-[400px] hover:border-blue-300 hover:shadow-md',
        )}
      >
        <CardHeader>
          <CardTitle>{vault.strategy}</CardTitle>
          <CardDescription>{vault.description}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Stat className="!p-0">
            <StatLabel size="sm">Weekly APR</StatLabel>
            <StatValue size="sm">
              <APRHoverCard pool={pool} smartPoolAPR={vault.apr}>
                <span className="underline decoration-dotted underline-offset-2">
                  {formatPercent(vault.apr + pool.incentiveApr)}
                </span>
              </APRHoverCard>
            </StatValue>
          </Stat>
          <div className="h-[200px] rounded-xl flex items-center justify-center">
            {!vault.isDeprecated ? (
              <SteerAPRChart vault={vault} />
            ) : (
              <div className="text-center text-red dark:text-red-600">
                <div className=" font-medium">This vault is deprecated.</div>
                <div className="text-sm">
                  It might not accrue any fees and won{"'"}t be readjusted.
                </div>
              </div>
            )}
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
            <StatValue size="sm">{formatUSD(vault.feesUSD)}</StatValue>
          </Stat>
        </div>
        <Separator />
        <CardContent className="pt-6">
          <SteerLiquidityDistributionWidget vault={vault} />
        </CardContent>
      </Card>
    </LinkInternal>
  )
}
