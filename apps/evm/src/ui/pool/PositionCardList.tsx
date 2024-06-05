import { SushiV2StakedUnstakedPosition } from '@sushiswap/graph-client-new/composite/sushi-v2-staked-unstaked-positions'
import React, { FC, ReactNode } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { useSushiV2UserPositions } from 'src/lib/hooks'
import { useAccount } from 'wagmi'

interface PositionCardList {
  children({
    positions,
    isLoading,
  }: {
    positions: SushiV2StakedUnstakedPosition[]
    isLoading: boolean
  }): ReactNode
}

const value = (position: SushiV2StakedUnstakedPosition) =>
  (Number(position.unstakedBalance + position.stakedBalance) /
    Number(position.pool.liquidity)) *
  Number(position.pool.liquidityUSD)

export const PositionCardList: FC<PositionCardList> = ({ children }) => {
  const { address } = useAccount()
  const { data: userPositions, isLoading } = useSushiV2UserPositions({
    user: address!,
    chainIds: SUPPORTED_CHAIN_IDS,
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
