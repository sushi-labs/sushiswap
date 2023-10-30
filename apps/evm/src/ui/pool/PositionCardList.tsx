import { Protocol } from '@sushiswap/client'
import { useAccount } from '@sushiswap/wagmi'
import React, { FC, ReactNode } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { useUserPositions } from 'src/lib/hooks'
import { PositionWithPool } from 'src/types'

interface PositionCardList {
  children({
    positions,
    isLoading,
  }: { positions: PositionWithPool[]; isLoading: boolean }): ReactNode
}

const value = (position: PositionWithPool) =>
  (Number(position.balance + position.stakedBalance) /
    Number(position.pool.totalSupply)) *
  Number(position.pool.liquidityUSD)

export const PositionCardList: FC<PositionCardList> = ({ children }) => {
  const { address } = useAccount()
  const { data: userPositions, isValidating } = useUserPositions({
    id: address,
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  return (
    <>
      {children({
        positions: isValidating
          ? new Array(6).fill(null)
          : (userPositions || [])
              .filter((el) => el.pool.protocol === Protocol.SUSHISWAP_V2)
              .sort((a, b) => value(b) - value(a)),
        isLoading: isValidating,
      })}
    </>
  )
}
