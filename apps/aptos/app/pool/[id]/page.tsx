'use client'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AppearOnMount } from '@sushiswap/ui'
import Loading from 'app/loading'
import { Layout } from 'components/Layout'
import { PoolButtons } from 'components/PoolSection/PoolButtons'
import { PoolComposition } from 'components/PoolSection/PoolComposition'
import { PoolHeader } from 'components/PoolSection/PoolHeader'
import { PoolMyRewards } from 'components/PoolSection/PoolMyRewards'
import { PoolPosition } from 'components/PoolSection/PoolPosition/PoolPosition'
import { PoolRewards } from 'components/PoolSection/PoolRewards'
import { useParams } from 'next/navigation'
import { FC, useEffect, useMemo } from 'react'
import { useAccount } from 'utils/useAccount'
import { isFarm, useFarms } from 'utils/useFarms'
import { usePool } from 'utils/usePool'
import { useUserRewards } from 'utils/useUserRewards'
import { useTotalSupply } from 'utils/useTotalSupply'
import { getPIdIndex, useUserHandle, useUserPool } from 'utils/useUserHandle'
import { useRewardsPerDay } from 'utils/useRewardsPerDay'
import requiredNetworkAlert from 'utils/requiredNetworkAlert'

const Pool: FC = ({}) => {
  return <_Pool />
}

const _Pool = () => {
  const router = useParams()
  const { account, network, disconnect } = useWallet()
  const tokenAddress = decodeURIComponent(router?.id)
  const { data: pool, isLoading: isPoolLoading } = usePool(tokenAddress)
  const { data: farms } = useFarms()
  const farmIndex = isFarm(tokenAddress, farms)
  const { data: coinInfo } = useTotalSupply(tokenAddress)
  const { data: userHandle } = useUserPool(account?.address)
  const { data: stakes, isInitialLoading: isStakeLoading } = useUserHandle({ address: account?.address, userHandle })
  const pIdIndex = useMemo(() => {
    return getPIdIndex(farmIndex, stakes)
  }, [stakes, farmIndex])
  const stakeAmount = useMemo(() => {
    if (stakes?.data.current_table_items.length && pIdIndex !== -1) {
      return Number(stakes?.data.current_table_items[pIdIndex]?.decoded_value?.amount)
    } else {
      return 0
    }
  }, [stakes, pIdIndex])
  const { isLoadingAccount } = useAccount()

  const rewards = useUserRewards(farms, stakes, pIdIndex, farmIndex)
  const rewardsPerDay = useRewardsPerDay(farms, farmIndex, coinInfo?.data?.decimals)
  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network])

  return (
    <>
      {isLoadingAccount && <Loading />}
      {pool?.id && (
        <Layout>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
              <div className="flex flex-col order-1 gap-9">
                <PoolHeader row={pool} />
                <hr className="my-3 border-t border-gray-900/5 dark:border-slate-200/5" />
                <PoolComposition row={pool} />
                <PoolRewards isFarm={farmIndex !== -1} rewardsPerDay={rewardsPerDay} />
              </div>
              <div className="flex flex-col order-2 gap-4">
                <AppearOnMount>
                  <div className="flex flex-col gap-10">
                    {farmIndex !== undefined && farmIndex !== -1 && (
                      <PoolMyRewards
                        reward={rewards}
                        decimals={coinInfo?.data?.decimals}
                        isLoading={isPoolLoading || isStakeLoading}
                      />
                    )}
                    <PoolPosition row={pool} isLoading={isPoolLoading || isStakeLoading} stakeAmount={stakeAmount} />
                  </div>
                </AppearOnMount>
                <div className="hidden lg:flex">
                  <PoolButtons
                    isFarm={farmIndex !== undefined && farmIndex !== -1}
                    token0={pool.data.token_x_details.token_address}
                    token1={pool.data.token_y_details.token_address}
                  />
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
          </div>
        </Layout>
      )}
    </>
  )
}

export default Pool
