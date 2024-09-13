'use client'
import { Breadcrumb, Container } from '@sushiswap/ui'
import { useEffect } from 'react'
import { useTokenInfo } from '~tron/_common/lib/hooks/useTokenInfo'
import { isAddress } from '~tron/_common/lib/utils/helpers'
import { Manage } from '~tron/_common/ui/Pools/Manage/Manage'
import { PoolHeader } from '~tron/_common/ui/Pools/PoolDetails/PoolHeader'
import { PoolLiquidity } from '~tron/_common/ui/Pools/PoolDetails/PoolLiquidity'
import { PoolPosition } from '~tron/_common/ui/Pools/PoolPosition/PoolPosition'
import { PoolRewards } from '~tron/_common/ui/Pools/PoolRewards/PoolRewards'
import { usePoolDispatch } from '../../../explore/pools/pool-provider'

export default function PoolByIdPage({
  params,
}: { params: { poolId: string } }) {
  const { poolId } = params
  const decodedPoolId = decodeURIComponent(poolId)
  const token0 = decodedPoolId?.split(':')?.[0]
  const token1 = decodedPoolId?.split(':')?.[1]
  const pairAddress = decodedPoolId?.split(':')?.[2]
  const { data: token0Data, isLoading: isLoadingToken0 } = useTokenInfo({
    tokenAddress: token0,
  })

  const { data: token1Data, isLoading: isLoadingToken1 } = useTokenInfo({
    tokenAddress: token1,
  })
  const isLoadingTokens = isLoadingToken0 || isLoadingToken1
  const { setToken0, setToken1, setPairAddress } = usePoolDispatch()

  useEffect(() => {
    if (pairAddress && isAddress(pairAddress)) {
      setPairAddress(pairAddress)
    }
  }, [pairAddress, setPairAddress])

  useEffect(() => {
    if (token0Data) {
      setToken0(token0Data)
    }
    if (token1Data) {
      setToken1(token1Data)
    }
  }, [token0Data, token1Data, setToken0, setToken1])

  return (
    <>
      <div className="w-full border-b border-accent pb-8">
        <Container maxWidth="5xl" className="px-4">
          <Breadcrumb />
        </Container>
        <Container maxWidth="5xl" className="pb-4 pt-10 px-4">
          <PoolHeader
            pairAddress={pairAddress}
            token0={token0Data}
            token1={token1Data}
            isLoading={isLoadingTokens}
          />
        </Container>
      </div>
      <section className="bg-gray-50 dark:bg-white/[0.02]">
        <Container className="p-4 mt-4 mx-auto  pb-[86px] justify-between flex flex-col md:flex-row gap-6 max-w-5xl">
          <section className="w-full flex flex-col gap-4">
            <Manage />
            <PoolLiquidity
              pairAddress={pairAddress}
              token0={token0Data}
              token1={token1Data}
              isLoading={isLoadingTokens}
            />
          </section>
          <section className="w-full lg:w-[60%] flex flex-col gap-4">
            <PoolPosition
              token0={token0Data}
              token1={token1Data}
              isLoading={isLoadingTokens}
            />
            <PoolRewards />
          </section>
        </Container>
      </section>
    </>
  )
}
