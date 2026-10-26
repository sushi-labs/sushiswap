'use client'

import {
  type RawV3Pool,
  type V3Pool,
  hydrateV3Pool,
} from '@sushiswap/graph-client/data-api'
import {
  Button,
  Container,
  LinkInternal,
  Message,
  Separator,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query/pools/use-concentrated-liquidity-pool-stats'
import { useRewardCampaigns } from 'src/lib/hooks/react-query/rewards/use-reward-campaigns'
import { useConcentratedLiquidityPoolReserves } from 'src/lib/wagmi/hooks/pools/hooks/use-concentrated-liquidity-pool-reserves'
import { SushiSwapProtocol, getEvmChainById, isMerklChainId } from 'sushi/evm'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { PoolLiquidityCard } from '~evm/[chainId]/pool/_ui/pool-liquidity-card'
import { PoolStatisticsCharts } from '~evm/[chainId]/pool/_ui/pool-statistics-charts'
import { PoolStatsCard } from '~evm/[chainId]/pool/_ui/pool-stats-card'
import { KatanaStakingMessage } from '../../_ui/katana-staking-message'
import { LiquidityDepthWidget } from './liquidity-depth-widget'
import { PoolRewardDistributionsCard } from './pool-reward-distributions-card'
import { PoolTransactionsV3 } from './pool-transactions-v3'

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
    <Container maxWidth="5xl" className="flex flex-col gap-4 px-4">
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PoolStatisticsCharts
          pool={pool}
          protocol={SushiSwapProtocol.SUSHISWAP_V3}
          depthChart={
            <LiquidityDepthWidget chainId={chainId} address={address} />
          }
        />
        <div className="flex flex-col gap-6">
          <PoolLiquidityCard
            chainId={chainId}
            reserves={reserves}
            isLoading={isReservesLoading}
          />
          <PoolStatsCard stats={poolStats ?? undefined} />
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
