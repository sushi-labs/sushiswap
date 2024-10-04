'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Container } from '@sushiswap/ui'
import { useEffect, useMemo } from 'react'
import { ManageV2LiquidityCard } from '~aptos/(common)/components/ManageV2LiquidityCard'
import { PoolComposition } from '~aptos/(common)/components/PoolSection/PoolComposition'
import { PoolMyRewards } from '~aptos/(common)/components/PoolSection/PoolMyRewards'
import { PoolPosition } from '~aptos/(common)/components/PoolSection/PoolPosition/PoolPosition'
// import { PoolRewards } from '~aptos/(common)/components/PoolSection/PoolRewards'
import requiredNetworkAlert from '~aptos/(common)/lib/common/required-network-alert'
import { useTotalSupply } from '~aptos/(common)/lib/common/use-total-supply'
import {
  getPIdIndex,
  useUserHandle,
  useUserPool,
} from '~aptos/(common)/lib/common/use-user-handle'
import { useFarms, useIsFarm } from '~aptos/pool/lib/farm/use-farms'
// import { useRewardsPerDay } from '~aptos/pool/lib/farm/use-rewards-per-day'
import { useUserRewards } from '~aptos/pool/lib/farm/use-user-rewards'
import { usePool } from '~aptos/pool/lib/use-pool'

export default function PoolPage({ params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address)
  const { account, network, disconnect } = useWallet()
  const { data: pool, isLoading: isPoolLoading } = usePool(address)
  const { data: farms } = useFarms()
  const farmIndex = useIsFarm({ poolAddress: address, farms })
  const { data: coinInfo } = useTotalSupply(address)
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
  // const rewardsPerDay = useRewardsPerDay(
  //   farms,
  //   farmIndex,
  //   coinInfo?.data?.decimals,
  // )

  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network, disconnect])

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6">
          <div className="flex flex-col gap-6">
            <ManageV2LiquidityCard address={address} />
            <PoolComposition row={pool} />
          </div>
          <div className="flex flex-col gap-6">
            <PoolPosition
              row={pool}
              isLoading={isPoolLoading || isStakeLoading}
              stakeAmount={stakeAmount}
            />
            {pool && farmIndex !== undefined && farmIndex !== -1 ? (
              <PoolMyRewards
                pool={pool}
                reward={rewards}
                decimals={coinInfo?.data?.decimals}
                isLoading={isPoolLoading || isStakeLoading}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  )
}
