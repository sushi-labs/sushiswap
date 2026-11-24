'use client'
import type { PoolChainId } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { Card, CardContent } from '@sushiswap/ui'
import { useMemo } from 'react'
import { DataItem } from 'src/app/(networks)/(evm)/_common/ui/data-item'
import { useSushiV2UserPositions } from 'src/lib/hooks'
import { useClaimableRewards } from 'src/lib/hooks/react-query/rewards/use-claimable-rewards'
import { useConcentratedLiquidityPositions } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-liquidity-positions'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { formatUSD, getChainById } from 'sushi'
import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/evm'
import { SushiSwapV3ChainIds, isEvmTestnetChainId } from 'sushi/evm'
import { useConnection } from 'wagmi'
import { ClaimableFeesDialog } from './claim-fees/claimable-fees-dialog'
import { ClaimableRewardsDialog } from './claim-rewards/claimable-rewards-dialog'
import { usePositionFilters } from './position-filters-provider'

const CLAIM_SUPPORTED_CHAIN_IDS = SushiSwapV3ChainIds.filter(
  (chainId) => !isEvmTestnetChainId(chainId),
)

export const PositionStats = ({
  chainId,
}: {
  chainId: PoolChainId
}) => {
  const address = useAccount('evm')
  const { address: rewardsAccount, isConnecting } = useConnection()
  const isMounted = useIsMounted()
  const {
    data: rewardsByChain,
    isLoading: isRewardsLoading,
    isError: isRewardsError,
  } = useClaimableRewards({ account: rewardsAccount })
  const rewards = useMemo(
    () => (rewardsByChain ? Object.values(rewardsByChain) : []),
    [rewardsByChain],
  )
  const totalUnclaimedRewards = rewards.reduce(
    (total, reward) => total + reward.totalRewardsUSD,
    0,
  )
  const isRewardsPending = isRewardsLoading || isConnecting || !isMounted
  const {
    state: { tab, hideClosedPositions },
  } = usePositionFilters()
  const {
    data: v3Positions,
    isInitialLoading: isV3PositionsLoading,
    isError: isV3PositionsError,
  } = useConcentratedLiquidityPositions({
    account: address,
    chainIds: isSushiSwapV3ChainId(chainId) ? [chainId] : [],
  })
  const {
    data: allV3Positions,
    isInitialLoading: isAllV3PositionsLoading,
    isError: isAllV3PositionsError,
  } = useConcentratedLiquidityPositions({
    account: address,
    chainIds: CLAIM_SUPPORTED_CHAIN_IDS,
  })
  const {
    data: v2Positions,
    isLoading: isV2PositionsLoading,
    isError: isV2PositionsError,
  } = useSushiV2UserPositions({
    user: address,
    chainId: isSushiSwapV2ChainId(chainId) ? chainId : undefined,
  })
  const isLoading =
    isV2PositionsLoading ||
    isV3PositionsLoading ||
    isAllV3PositionsLoading ||
    !isMounted
  const isError =
    isV2PositionsError || isV3PositionsError || isAllV3PositionsError

  const totalPosValue = useMemo(() => {
    const _v3Positions = v3Positions?.filter((pos) =>
      hideClosedPositions ? pos.liquidity !== 0n : true,
    )
    const totalV2PosValue =
      v2Positions?.reduce((acc, pos) => acc + pos.value, 0) ?? 0
    const totalV3PosValue =
      _v3Positions?.reduce((acc, pos) => acc + pos.position.positionUSD, 0) ?? 0
    return tab === 'v2' ? totalV2PosValue : totalV3PosValue
  }, [tab, v2Positions, v3Positions, hideClosedPositions])

  const totalUnclaimedFees = useMemo(
    () =>
      allV3Positions?.reduce(
        (acc, pos) => acc + pos.position.unclaimedUSD,
        0,
      ) ?? 0,
    [allV3Positions],
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <div className="col-span-1">
        <Card>
          <CardContent className="pt-5">
            <DataItem
              label="Position Value"
              value={formatUSD(totalPosValue)}
              isLoading={isLoading}
              isError={isError}
              subLabel={getChainById(chainId).name}
            />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card>
          <CardContent className="pt-5">
            <DataItem
              label={
                <div className="relative">
                  <div className="pr-36">Total unclaimed rewards</div>
                  <div className="absolute top-0 right-0 z-[1]">
                    <ClaimableRewardsDialog
                      rewards={rewards}
                      isLoading={isRewardsPending}
                      isError={isRewardsError}
                    />
                  </div>
                </div>
              }
              value={formatUSD(totalUnclaimedRewards)}
              isLoading={isRewardsPending}
              isError={isRewardsError}
              subLabel="Rewards earned"
            />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        <Card>
          <CardContent className="pt-5">
            <DataItem
              label={
                <div className="relative">
                  <div>Total unclaimed fees</div>
                  <div className="absolute top-0 right-0 z-[1]">
                    <ClaimableFeesDialog />
                  </div>
                </div>
              }
              value={formatUSD(totalUnclaimedFees)}
              isLoading={isLoading}
              isError={isError}
              subLabel={`Fees earned`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
