'use client'

import type { V3Pool } from '@sushiswap/graph-client/data-api'
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
import { type FC, useMemo } from 'react'
import {
  type RewardCampaign,
  useKatanaRewardCampaigns,
} from 'src/lib/hooks/react-query'
import {
  EvmChainId,
  EvmNative,
  getEvmChainById,
  isMerklChainId,
} from 'sushi/evm'
import { DistributionDataTable } from '../../_ui/distribution-data-table'

interface PoolRewardDistributionsCardParams {
  pool: V3Pool
  isLoading: boolean
  rewardsData?: RewardCampaign[]
}

export const PoolRewardDistributionsCard: FC<
  PoolRewardDistributionsCardParams
> = ({ pool, isLoading, rewardsData }) => {
  if (!pool) return null
  if (!isMerklChainId(pool.chainId)) return null

  const {
    data: katanaRewardCampaigns,
    isLoading: isKatanaRewardCampaignsLoading,
  } = useKatanaRewardCampaigns({
    pool: pool.address,
    chainId: pool.chainId,
    enabled: pool.chainId === EvmChainId.KATANA,
  })

  const mergedRewardsData = useMemo(() => {
    return [...(rewardsData ?? []), ...(katanaRewardCampaigns ?? [])]
  }, [katanaRewardCampaigns, rewardsData])

  const isRewardsLoading =
    isLoading ||
    (pool.chainId === EvmChainId.KATANA && isKatanaRewardCampaignsLoading)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward distributions</CardTitle>
        <CardDescription>
          Anyone can add distributions to this pool.{' '}
          {pool.token0 && pool.token1 ? (
            <LinkInternal
              href={`/${getEvmChainById(pool.chainId).key}/pool/incentivize?chainId=${
                pool.chainId
              }&fromCurrency=${
                pool.token0.address ===
                EvmNative.fromChainId(pool.chainId).wrap().address
                  ? 'NATIVE'
                  : pool.token0.address
              }&toCurrency=${
                pool.token1.address ===
                EvmNative.fromChainId(pool.chainId).wrap().address
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
            chainId={pool.chainId}
            isLoading={isRewardsLoading}
            data={mergedRewardsData?.filter((el) => el.isLive)}
          />
        </TabsContent>
        <TabsContent value="inactive">
          <DistributionDataTable
            chainId={pool.chainId}
            isLoading={isRewardsLoading}
            data={mergedRewardsData?.filter((el) => !el.isLive)}
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
