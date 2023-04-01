import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FeeAmount, TICK_SPACINGS, computePoolAddress, nearestUsableTick } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityPool } from '@sushiswap/wagmi/future/hooks'
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'
import { tickLensAbi } from '@sushiswap/abi'
import { Writeable } from 'zod'

interface useTicks {
  token0: Type | undefined
  token1: Type | undefined
  chainId: ChainId
  feeAmount: FeeAmount | undefined
  numSurroundingTicks?: number | undefined
  enabled?: boolean | undefined
}

const bitmapIndex = (tick: number, tickSpacing: number) => {
  return Math.floor(tick / tickSpacing / 256)
}

export function useTicks({ token0, token1, chainId, feeAmount, numSurroundingTicks, enabled }: useTicks) {
  numSurroundingTicks = numSurroundingTicks ?? 125

  const { data: pool } = useConcentratedLiquidityPool({ token0, token1, chainId, feeAmount, enabled })

  const tickSpacing = feeAmount && TICK_SPACINGS[feeAmount]

  const activeTick = pool?.tickCurrent && tickSpacing ? nearestUsableTick(pool?.tickCurrent, tickSpacing) : undefined

  const poolAddress = useMemo(
    () =>
      token0 && token1 && feeAmount && chainId
        ? computePoolAddress({
            // TODO harcdoded chainId
            factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
            tokenA: token0.wrapped,
            tokenB: token1.wrapped,
            fee: feeAmount,
          })
        : undefined,
    [chainId, feeAmount, token0, token1]
  )

  const minIndex = useMemo(
    () =>
      tickSpacing && activeTick && numSurroundingTicks
        ? bitmapIndex(activeTick - (numSurroundingTicks as number) * tickSpacing, tickSpacing)
        : undefined,
    [tickSpacing, activeTick, numSurroundingTicks]
  )

  const maxIndex = useMemo(
    () =>
      tickSpacing && activeTick && numSurroundingTicks
        ? bitmapIndex(activeTick + numSurroundingTicks * tickSpacing, tickSpacing)
        : undefined,
    [tickSpacing, activeTick, numSurroundingTicks]
  )

  // TODO: Fix, obviously 👍
  const TICK_LENS_ADDRESS_ARBITRUM = '0xbfd8137f7d1516D3ea5cA83523914859ec47F573'

  const contractReads = useMemo(() => {
    const reads = []
    if (minIndex && maxIndex && poolAddress) {
      for (let i = minIndex; i <= maxIndex; i++) {
        reads.push({
          address: TICK_LENS_ADDRESS_ARBITRUM,
          abi: tickLensAbi,
          functionName: 'getPopulatedTicksInWord',
          args: [poolAddress as Address, i],
        } as const)
      }
    }
    return reads
  }, [maxIndex, minIndex, poolAddress])

  const reads = useContractReads({ contracts: contractReads, enabled })

  return useMemo(() => {
    const { data } = reads

    const reduced = data?.reduce((ticks, word) => [...ticks, ...word], [])
    const renamed = (reduced as Writeable<typeof reduced>)?.map((tick) => ({
      tickIdx: tick.tick,
      liquidityNet: tick.liquidityNet,
    }))
    const sorted = renamed?.sort((a, b) => a.tickIdx - b.tickIdx)

    return {
      ...reads,
      data: sorted,
    }
  }, [reads])
}
