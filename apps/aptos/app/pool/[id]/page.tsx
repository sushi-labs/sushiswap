'use client'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AppearOnMount } from '@sushiswap/ui'
import { Layout } from 'components/Layout'
import { PoolButtons } from 'components/PoolSection/PoolButtons'
import { PoolComposition } from 'components/PoolSection/PoolComposition'
import { PoolHeader } from 'components/PoolSection/PoolHeader'
import { PoolMyRewards } from 'components/PoolSection/PoolMyRewards'
import { PoolPosition } from 'components/PoolSection/PoolPosition/PoolPosition'
import { PoolRewards } from 'components/PoolSection/PoolRewards'
import { useParams } from 'next/navigation'
import { FC, useMemo } from 'react'
import { isFarm, useFarms } from 'utils/useFarms'
import { usePool } from 'utils/usePool'
import { Pool } from 'utils/usePools'
import { useRewards } from 'utils/useRewards'
import { useTotalSupply } from 'utils/useTotalSupply'
import { getPIdIndex, useUserHandle, useUserPool } from 'utils/useUserHandle'

const LINKS = (row: Pool) => [
  {
    href: `/${row.id}`,
    label: ``,
  },
]

const Pool: FC = ({}) => {
  return <_Pool />
}

const _Pool = () => {
  const router = useParams()
  const { account } = useWallet()
  const [chainId, ...address] = decodeURIComponent(router?.id).split(':')
  const tokenAddress = address.join(':')
  const { data: pool, isLoading: isPoolLoading } = usePool(Number(chainId), tokenAddress)

  const { data: farms } = useFarms()
  const farmIndex = isFarm(tokenAddress, farms)
  const { data: coinInfo } = useTotalSupply(chainId, tokenAddress)
  const { data: userHandle } = useUserPool(account?.address)
  const pIdIndex = useMemo(() => {
    return getPIdIndex(farmIndex, userHandle?.data?.pids)
  }, [userHandle?.data?.pids, farmIndex])
  const { data: stakes, isInitialLoading: isStakeLoading } = useUserHandle({ address: account?.address, userHandle })
  const stakeAmount = useMemo(() => {
    if (stakes?.data.current_table_items.length && pIdIndex !== -1) {
      return Number(stakes?.data.current_table_items[pIdIndex]?.decoded_value?.amount)
    } else {
      return 0
    }
  }, [stakes, pIdIndex, coinInfo])

  const rewards = useRewards(farms, stakes, pIdIndex, farmIndex)
  return (
    <>
      {pool?.id && (
        <Layout>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
              <div className="flex flex-col order-1 gap-9">
                <PoolHeader row={pool} />
                <hr className="my-3 border-t border-gray-900/5 dark:border-slate-200/5" />
                <PoolComposition row={pool} />
                <PoolRewards isFarm={farmIndex !== -1} />
              </div>
              <div className="flex flex-col order-2 gap-4">
                <AppearOnMount>
                  <div className="flex flex-col gap-10">
                    <PoolMyRewards
                      isFarm={farmIndex !== -1}
                      reward={rewards}
                      decimals={coinInfo?.data?.decimals}
                      isLoading={isPoolLoading || isStakeLoading}
                    />
                    <PoolPosition row={pool} isLoading={isPoolLoading || isStakeLoading} stakeAmount={stakeAmount} />
                  </div>
                </AppearOnMount>
                <div className="hidden lg:flex">
                  <PoolButtons />
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  )
}

export default Pool
