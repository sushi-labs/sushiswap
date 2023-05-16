import { PositionCard } from './PositionCard'
import React, { FC, ReactNode } from 'react'
import { useUserPositions } from '../../lib/hooks'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import { useAccount } from 'wagmi'
import { PositionWithPool } from '../../types'

interface PositionCardList {
  children({ positions, isLoading }: { positions: PositionWithPool[]; isLoading: boolean }): ReactNode
}
export const PositionCardList: FC<PositionCardList> = ({ children }) => {
  const { address } = useAccount()
  const { data: userPositions, isValidating } = useUserPositions({ id: address, chainIds: SUPPORTED_CHAIN_IDS })

  return (
    <>
      {children({
        positions: isValidating
          ? new Array(6).fill(null)
          : (userPositions || []).filter((el) => el.pool.version === 'LEGACY'),
        isLoading: isValidating,
      })}
    </>
  )
}
