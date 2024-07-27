'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Container } from '@sushiswap/ui'
import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { ManageV2LiquidityCard } from '~aptos/(common)/components/ManageV2LiquidityCard'
import { PoolComposition } from '~aptos/(common)/components/PoolSection/PoolComposition'
import { PoolMyRewards } from '~aptos/(common)/components/PoolSection/PoolMyRewards'
import { PoolPosition } from '~aptos/(common)/components/PoolSection/PoolPosition/PoolPosition'
import { PoolRewards } from '~aptos/(common)/components/PoolSection/PoolRewards'
import requiredNetworkAlert from '~aptos/(common)/lib/common/required-network-alert'
import { useTotalSupply } from '~aptos/(common)/lib/common/use-total-supply'
import {
  getPIdIndex,
  useUserHandle,
  useUserPool,
} from '~aptos/(common)/lib/common/use-user-handle'
import { useFarms, useIsFarm } from '~aptos/pool/lib/farm/use-farms'
import { useRewardsPerDay } from '~aptos/pool/lib/farm/use-rewards-per-day'
import { useUserRewards } from '~aptos/pool/lib/farm/use-user-rewards'
import { usePool } from '~aptos/pool/lib/use-pool'

const Pool = () => {
  const router = useParams()
  const { account, network, disconnect } = useWallet()
  const tokenAddress = decodeURIComponent(router?.id as string)
  const { data: pool, isLoading: isPoolLoading } = usePool(tokenAddress)
  const { data: farms } = useFarms()
  const farmIndex = useIsFarm({ poolAddress: tokenAddress, farms })
  const { data: coinInfo } = useTotalSupply(tokenAddress)
  const { data: userHandle } = useUserPool(account?.address)
  const { data: stakes, isInitialLoading: isStakeLoading } = useUserHandle({
    userHandle,
  })
  const pIdIndex = useMemo(() => {
    return getPIdIndex(farmIndex, stakes)
  }, [stakes, farmIndex])
  const stakeAmount = useMemo(() => {
    if (stakes?.data.current_table_items.length && pIdIndex !== -1) {
      return Number(
        stakes?.data.current_table_items[pIdIndex]?.decoded_value?.amount,
      )
    } else {
      return 0
    }
  }, [stakes, pIdIndex])

  const rewards = useUserRewards(farms, stakes, pIdIndex, farmIndex)
  const rewardsPerDay = useRewardsPerDay(
    farms,
    farmIndex,
    coinInfo?.data?.decimals,
  )

  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network, disconnect])

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6">
          <div className="flex flex-col gap-6">
            <ManageV2LiquidityCard />
            {pool?.id ? <PoolComposition row={pool} /> : null}
          </div>
          <div className="flex flex-col gap-6">
            {pool?.id ? (
              <PoolPosition
                row={pool}
                isLoading={isPoolLoading || isStakeLoading}
                stakeAmount={stakeAmount}
              />
            ) : null}
            {farmIndex !== undefined && farmIndex !== -1 && (
              <PoolMyRewards
                reward={rewards}
                decimals={coinInfo?.data?.decimals}
                isLoading={isPoolLoading || isStakeLoading}
              />
            )}
            <PoolRewards
              isFarm={farmIndex !== -1}
              rewardsPerDay={rewardsPerDay}
            />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Pool
