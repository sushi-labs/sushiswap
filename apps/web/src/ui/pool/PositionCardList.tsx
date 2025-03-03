import type { V2Position } from '@sushiswap/graph-client/data-api'
import React, { type FC, type ReactNode } from 'react'
import { useSushiV2UserPositions } from 'src/lib/hooks'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { useAccount } from 'wagmi'

interface PositionCardList {
  chainId: SushiSwapV2ChainId
  children({
    positions,
    isLoading,
  }: {
    positions: V2Position[]
    isLoading: boolean
  }): ReactNode
}

const value = (position: V2Position) =>
  (Number(position.unstakedBalance + position.stakedBalance) /
    Number(position.pool.liquidity)) *
  Number(position.pool.liquidityUSD)

export const PositionCardList: FC<PositionCardList> = ({
  children,
  chainId,
}) => {
  const { address } = useAccount()
  const { data: userPositions, isLoading } = useSushiV2UserPositions({
    user: address,
    chainId,
  })

  return (
    <>
      {children({
        positions: isLoading
          ? new Array(6).fill(null)
          : (userPositions || []).sort((a, b) => value(b) - value(a)),
        isLoading,
      })}
    </>
  )
}
