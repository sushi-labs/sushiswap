'use client'

import { type RawV3Pool, hydrateV3Pool } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardLabel,
  CardTitle,
  Container,
  LinkInternal,
  Message,
  Separator,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query/pools/use-concentrated-liquidity-pool-stats'
import { useRewardCampaigns } from 'src/lib/hooks/react-query/rewards/use-reward-campaigns'
import { useConcentratedLiquidityPoolReserves } from 'src/lib/wagmi/hooks/pools/hooks/use-concentrated-liquidity-pool-reserves'
import { formatUSD } from 'sushi'
import { getEvmChainById, isMerklChainId } from 'sushi/evm'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { LiquidityAllocationCard } from '~evm/[chainId]/pool/_ui/liquidity-allocation-card'
import { KatanaStakingMessage } from '../../_ui/katana-staking-message'
import { PoolRewardDistributionsCard } from './pool-reward-distributions-card'
import { PoolTransactionsV3 } from './pool-transactions-v3'
import { StatisticsChartsV3 } from './statistics-chart-v3'

const PoolPageV3: FC<{ pool: RawV3Pool }> = ({ pool }) => {
  return (
    <ConcentratedLiquidityProvider>
      <Pool pool={pool} />
    </ConcentratedLiquidityProvider>
  )
}

const Pool: FC<{ pool: RawV3Pool }> = ({ pool: rawPool }) => {
  const pool = useMemo(() => hydrateV3Pool(rawPool), [rawPool])

  const { chainId, address } = pool

  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId,
    address,
  })
  const { data: rewardsData, isLoading: rewardsLoading } = useRewardCampaigns({
    pool: address,
    chainId,
    enabled: isMerklChainId(chainId),
  })

  const { data: reserves, isLoading: isReservesLoading } =
    useConcentratedLiquidityPoolReserves({
      pool,
      chainId,
    })

  return (
    <Container
      maxWidth="7xl"
      className="flex flex-col gap-4 md:pt-8 border-t border-transparent md:border-accent"
    >
      {pool.hasEnabledSteerVault && (
        <Message
          variant="info"
          size="sm"
          className="mb-4 flex flex-col md:flex-row items-center gap-4 justify-between"
        >
          <p>
            {`This pool has been activated to leverage our liquidity vault feature. Liquidity Vaults are designed to optimize the
        allocation of liquidity within customized price ranges, thereby improving trading efficiency. They achieve
        this by enhancing liquidity depth around the current price, which results in higher fee earnings for liquidity
        providers (LPs) and allows the market to dictate the distribution of LPs' positions based on rational
        decisions.`}
          </p>
          <LinkInternal
            shallow={true}
            href={`/${getEvmChainById(chainId).key}/pool/v3/${address}/smart`}
            className="w-full md:w-fit"
          >
            <Button className="w-full md:w-fit">
              Create Liquidity Vault Position
            </Button>
          </LinkInternal>
        </Message>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_45%]">
        <StatisticsChartsV3 address={address} chainId={chainId} pool={pool} />
        <div className="flex flex-col gap-6">
          <LiquidityAllocationCard
            title="Pool Liquidity"
            amount0={reserves?.[0]}
            amount1={reserves?.[1]}
            isLoading={isReservesLoading}
          />
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex flex-col justify-between md:flex-row gap-y-4">
                  Statistics
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <CardLabel>Volume (24h)</CardLabel>
                  {poolStats ? (
                    <div className="text-xl font-semibold">
                      {formatUSD(poolStats.volumeUSD1d ?? 0)}{' '}
                      <span
                        className={classNames(
                          'text-xs',
                          poolStats['volumeUSD1dChange'] > 0
                            ? 'text-green'
                            : 'text-red',
                        )}
                      >
                        ({poolStats['volumeUSD1dChange'].toFixed(2)}
                        %)
                      </span>
                    </div>
                  ) : (
                    <SkeletonText />
                  )}
                </div>
                <div>
                  <CardLabel>Fees (24h)</CardLabel>
                  {poolStats ? (
                    <div className="text-xl font-semibold">
                      {formatUSD(poolStats.feesUSD1d ?? 0)}{' '}
                      <span
                        className={classNames(
                          'text-xs',
                          poolStats['feesUSD1dChange'] > 0
                            ? 'text-green'
                            : 'text-red',
                        )}
                      >
                        ({poolStats['feesUSD1dChange'].toFixed(2)}
                        %)
                      </span>
                    </div>
                  ) : (
                    <SkeletonText />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="py-4">
        <Separator />
      </div>
      <KatanaStakingMessage pool={address} chainId={chainId} />
      <PoolRewardDistributionsCard
        pool={pool}
        isLoading={rewardsLoading}
        rewardsData={rewardsData}
      />
      <PoolTransactionsV3 pool={pool} poolAddress={address} />
    </Container>
  )
}

export { PoolPageV3 }
