import React, { FC, ReactNode } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { useUserPositions } from 'src/lib/hooks'
import { PositionWithPool } from 'src/types'
import { useAccount } from 'wagmi'

interface PositionCardList {
  children({
    positions,
    isLoading,
  }: { positions: PositionWithPool[]; isLoading: boolean }): ReactNode
}

const value = (position: PositionWithPool) =>
  (Number(position.unstakedBalance + position.stakedBalance) /
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
              .sort((a, b) => value(b) - value(a)),
        isLoading: isValidating,
      })}
    </>
  )
}
