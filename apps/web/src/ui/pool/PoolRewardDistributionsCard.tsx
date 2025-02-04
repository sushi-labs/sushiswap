'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LinkInternal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { useAngleRewards } from 'src/lib/hooks/react-query'
import { ChainKey } from 'sushi/chain'
import { Native } from 'sushi/currency'
import { getAddress } from 'viem'

import type { V3Pool } from '@sushiswap/graph-client/data-api'
import { isMerklChainId } from 'sushi/config'
import { DistributionDataTable } from './DistributionDataTable'

interface PoolRewardDistributionsCardParams {
  pool: V3Pool
}

export const PoolRewardDistributionsCard: FC<
  PoolRewardDistributionsCardParams
> = ({ pool }) => {
  const { data: rewardsData, isLoading: rewardsLoading } = useAngleRewards({
    chainId: pool.chainId,
  })

  if (!pool) return null
  if (!isMerklChainId(pool.chainId)) return null

  const currentAngleRewardsPool = rewardsData?.pools[getAddress(pool.address)]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward distributions</CardTitle>
        <CardDescription>
          Anyone can add distributions to this pool.{' '}
          {pool.token0 && pool.token1 ? (
            <LinkInternal
              href={`/${ChainKey[pool.chainId]}/pool/incentivize?chainId=${
                pool.chainId
              }&fromCurrency=${
                pool.token0.address ===
                Native.onChain(pool.chainId).wrapped.address
                  ? 'NATIVE'
                  : pool.token0.address
              }&toCurrency=${
                pool.token1.address ===
                Native.onChain(pool.chainId).wrapped.address
                  ? 'NATIVE'
                  : pool.token1.address
              }&feeAmount=${pool.swapFee * 10_000 * 100}`}
            >
              <Button asChild variant="link">
                Want to add one?
              </Button>
            </LinkInternal>
          ) : null}
        </CardDescription>
      </CardHeader>
      <Tabs className="w-full" defaultValue="active">
        <CardContent>
          <TabsList className="!flex">
            <TabsTrigger value="active" className="flex flex-1">
              Active
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex flex-1">
              Upcoming & Expired
            </TabsTrigger>
          </TabsList>
        </CardContent>
        <TabsContent value="active">
          <DistributionDataTable
            isLoading={rewardsLoading}
            data={currentAngleRewardsPool?.distributionData.filter(
              (el) => el.isLive,
            )}
          />
        </TabsContent>
        <TabsContent value="inactive">
          <DistributionDataTable
            isLoading={rewardsLoading}
            data={currentAngleRewardsPool?.distributionData.filter(
              (el) => !el.isLive,
            )}
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
