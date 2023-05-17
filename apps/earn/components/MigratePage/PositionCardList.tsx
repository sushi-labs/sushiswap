import React, { FC, ReactNode } from 'react'
import { useUserPositions } from '../../lib/hooks'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import { useAccount } from 'wagmi'
import { PositionWithPool } from '../../types'

interface PositionCardList {
  children({ positions, isLoading }: { positions: PositionWithPool[]; isLoading: boolean }): ReactNode
}

const value = (position: PositionWithPool) =>
  (Number(position.balance + position.stakedBalance) / Number(position.pool.totalSupply)) *
  Number(position.pool.liquidityUSD)

export const PositionCardList: FC<PositionCardList> = ({ children }) => {
  const { address } = useAccount()
  const { data: userPositions, isValidating } = useUserPositions({ id: address, chainIds: SUPPORTED_CHAIN_IDS })

  return (
    <>
      {children({
        positions: isValidating
          ? new Array(6).fill(null)
          : (userPositions || []).filter((el) => el.pool.version === 'LEGACY').sort((a, b) => value(b) - value(a)),
        isLoading: isValidating,
      })}
    </>
  )
}
