'use client'

import { Container } from '@sushiswap/ui'
import { use, useEffect, useState } from 'react'
import { Manage } from '~kadena/_common/ui/Pools/Manage/Manage'
import { PoolLiquidity } from '~kadena/_common/ui/Pools/PoolDetails/PoolLiquidity'
import { PoolPosition } from '~kadena/_common/ui/Pools/PoolPosition/PoolPosition'
import { POOLS } from '~kadena/_common/ui/Pools/PositionsTable/PositionsTable'
import { usePoolDispatch } from '~kadena/_common/ui/Pools/pool-provider'

export default function AddRemoveLiqPage(props: {
  params: Promise<{ address: string }>
}) {
  const params = use(props.params)
  const decodedPoolId = params.address
  const pairAddress = decodedPoolId[2]
  const [isLoadingToken0, setIsLoadingToken0] = useState(true)
  const [isLoadingToken1, setIsLoadingToken1] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingToken0(false)
      setIsLoadingToken1(false)
    }, 1200)
  }, [])
  const isLoadingTokens = isLoadingToken0 || isLoadingToken1
  const { setToken0, setToken1, setPairAddress } = usePoolDispatch()

  useEffect(() => {
    const isAddress = (_address: string) => true
    if (pairAddress && isAddress(pairAddress)) {
      setPairAddress(pairAddress)
    }
  }, [pairAddress, setPairAddress])

  const token0 = POOLS[0].token0
  const token1 = POOLS[0].token1
  useEffect(() => {
    if (token0) {
      setToken0(token0)
    }
    if (token1) {
      setToken1(token1)
    }
  }, [token0, token1, setToken0, setToken1])

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Manage />
          <PoolLiquidity
            pairAddress={pairAddress}
            token0={token0}
            token1={token1}
            isLoading={isLoadingTokens}
          />
        </div>
        <div className="flex flex-col gap-6">
          <PoolPosition
            token0={token0}
            token1={token1}
            isLoading={isLoadingTokens}
          />
        </div>
      </div>
    </Container>
  )
}
