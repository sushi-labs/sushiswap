'use client'

import { Container } from '@sushiswap/ui'
import { use, useEffect, useState } from 'react'
import { usePoolById } from '~kadena/_common/lib/hooks/use-pool-by-id'
import { Manage } from '~kadena/_common/ui/Pools/Manage/Manage'
import { PoolPosition } from '~kadena/_common/ui/Pools/PoolPosition/PoolPosition'
import { PoolComposition } from '~kadena/_common/ui/Pools/PoolsV2/PoolComposition'
import { usePoolDispatch } from '~kadena/_common/ui/Pools/pool-provider'

export default function AddRemoveLiqPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = use(props.params)
  const poolId = params.id

  const { data: pool } = usePoolById({
    poolId,
    first: 10,
  })

  console.log('swag poolById', pool)
  const [isLoadingToken0, setIsLoadingToken0] = useState(true)
  const [isLoadingToken1, setIsLoadingToken1] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingToken0(false)
      setIsLoadingToken1(false)
    }, 1200)
  }, [])
  const isLoadingTokens = isLoadingToken0 || isLoadingToken1
  const { setToken0, setToken1, setPoolId } = usePoolDispatch()

  useEffect(() => {
    const isAddress = (_address: string) => true
    if (poolId && isAddress(poolId)) {
      setPoolId(poolId)
    }
  }, [poolId, setPoolId])

  useEffect(() => {
    if (pool?.token0) {
      setToken0({
        tokenAddress: '',
        tokenSymbol: token0Symbol ?? '',
        tokenDecimals: 18,
        tokenName: pool.token0.name,
      })
    }
    if (pool?.token1) {
      setToken1({
        tokenAddress: '',
        tokenSymbol: token1Symbol ?? '',
        tokenDecimals: 18,
        tokenName: pool.token1.name,
      })
    }
  }, [pool?.token0, pool?.token1, setToken0, setToken1])

  const token0Name = pool?.token0?.name
  const token1Name = pool?.token1?.name
  const token0Symbol =
    token0Name === 'coin' ? 'KDA' : token0Name?.slice(0, 3).toUpperCase()
  const token1Symbol =
    token1Name === 'coin' ? 'KDA' : token1Name?.slice(0, 3).toUpperCase()

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Manage />
          <PoolComposition pool={pool} />
        </div>
        <div className="flex flex-col gap-6">
          <PoolPosition
            token0={{
              tokenName: token0Name ?? '',
              tokenId: pool?.token0?.id ?? '',
              tokenSymbol: token0Symbol ?? '',
              tokenImage: '',
            }}
            token1={{
              tokenName: token1Name ?? '',
              tokenId: pool?.token1?.id ?? '',
              tokenSymbol: token1Symbol ?? '',
              tokenImage: '',
            }}
            isLoading={isLoadingTokens}
          />
        </div>
      </div>
    </Container>
  )
}
