'use client'

import { useMemo } from 'react'
import { useConcentratedLiquidityPool } from 'src/lib/wagmi/hooks/pools/hooks/useConcentratedLiquidityPool'
import {
  type EvmCurrency,
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_TICK_LENS,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  TICK_SPACINGS,
  computeSushiSwapV3PoolAddress,
  nearestUsableTick,
} from 'sushi/evm'
import type { Address } from 'viem'
import { useReadContracts } from 'wagmi'
import type { util } from 'zod'

interface useTicksProps {
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  chainId: SushiSwapV3ChainId
  feeAmount: SushiSwapV3FeeAmount | undefined
  numSurroundingTicks?: number | undefined
  enabled?: boolean | undefined
}

const bitmapIndex = (tick: number, tickSpacing: number) => {
  return Math.floor(tick / tickSpacing / 256)
}

const getPopulatedTicksInWordAbiShard = [
  {
    inputs: [
      { internalType: 'address', name: 'pool', type: 'address' },
      {
        internalType: 'int16',
        name: 'tickBitmapIndex',
        type: 'int16',
      },
    ],
    name: 'getPopulatedTicksInWord',
    outputs: [
      {
        components: [
          { internalType: 'int24', name: 'tick', type: 'int24' },
          {
            internalType: 'int128',
            name: 'liquidityNet',
            type: 'int128',
          },
          {
            internalType: 'uint128',
            name: 'liquidityGross',
            type: 'uint128',
          },
        ],
        internalType: 'struct ITickLens.PopulatedTick[]',
        name: 'populatedTicks',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function useTicks({
  token0,
  token1,
  chainId,
  feeAmount,
  numSurroundingTicks: _numSurroundingTicks,
  enabled,
}: useTicksProps) {
  const numSurroundingTicks = _numSurroundingTicks ?? 1250

  const { data: pool } = useConcentratedLiquidityPool({
    token0,
    token1,
    chainId,
    feeAmount,
    enabled,
  })

  const tickSpacing = feeAmount && TICK_SPACINGS[feeAmount]
  const activeTick =
    typeof pool?.tickCurrent === 'number' && tickSpacing
      ? nearestUsableTick(pool?.tickCurrent, tickSpacing)
      : undefined
  const poolAddress = useMemo(
    () =>
      token0 && token1 && feeAmount && chainId
        ? computeSushiSwapV3PoolAddress({
            factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
            tokenA: token0.wrap(),
            tokenB: token1.wrap(),
            fee: feeAmount,
          })
        : undefined,
    [chainId, feeAmount, token0, token1],
  )

  const minIndex = useMemo(
    () =>
      tickSpacing !== undefined && activeTick !== undefined
        ? bitmapIndex(
            activeTick - numSurroundingTicks * tickSpacing,
            tickSpacing,
          )
        : undefined,
    [tickSpacing, activeTick, numSurroundingTicks],
  )
  const maxIndex = useMemo(
    () =>
      tickSpacing !== undefined && activeTick !== undefined
        ? bitmapIndex(
            activeTick + numSurroundingTicks * tickSpacing,
            tickSpacing,
          )
        : undefined,
    [tickSpacing, activeTick, numSurroundingTicks],
  )

  const contractReads = useMemo(() => {
    const reads = []
    if (
      typeof minIndex === 'number' &&
      typeof maxIndex === 'number' &&
      typeof poolAddress === 'string'
    ) {
      for (let i = minIndex; i <= maxIndex; i++) {
        reads.push({
          address: SUSHISWAP_V3_TICK_LENS[chainId],
          abi: getPopulatedTicksInWordAbiShard,
          chainId,
          functionName: 'getPopulatedTicksInWord',
          args: [poolAddress as Address, i],
        } as const)
      }
    }
    return reads
  }, [chainId, maxIndex, minIndex, poolAddress])

  const reads = useReadContracts({
    contracts: contractReads,
    allowFailure: false,
    query: {
      enabled: true,
    },
  })

  return useMemo(() => {
    const { data } = reads

    const reduced = data?.reduce((ticks, word) => {
      return ticks.concat(word)
    }, [])
    const renamed = (reduced as util.Writeable<typeof reduced>)?.map(
      (tick) => ({
        tickIdx: tick.tick,
        liquidityNet: tick.liquidityNet,
      }),
    )
    const sorted = renamed?.sort((a, b) => a.tickIdx - b.tickIdx)

    return {
      ...reads,
      data: sorted,
    }
  }, [reads])
}
