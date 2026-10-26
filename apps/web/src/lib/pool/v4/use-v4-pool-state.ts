'use client'

import { useQuery } from '@tanstack/react-query'
import { readContracts } from '@wagmi/core'
import ms from 'ms'
import {
  SUSHISWAP_V4_CL_POOL_MANAGER,
  SUSHISWAP_V4_CL_TICK_LENS,
  type SushiSwapV4ChainId,
  sushiSwapV4CLPoolManagerAbi_getLiquidity,
  sushiSwapV4CLPoolManagerAbi_getPoolBitmapInfo,
  sushiSwapV4CLPoolManagerAbi_getSlot0,
  sushiSwapV4CLPoolManagerAbi_poolIdToPoolKey,
  sushiSwapV4CLTickLensAbi_getPopulatedTicksInWord,
} from 'sushi/evm'
import type { Hex } from 'viem'
import { useConfig } from 'wagmi'
import {
  type V4PopulatedTick,
  getV4TickBitmapWords,
  getV4TickSpacing,
} from './v4-pool-math'

// Calldata bytes per multicall; the bitmap scan reads up to ~7k words for tick spacing 1
const TICK_SCAN_BATCH_SIZE = 2 ** 15

interface UseV4PoolStateParams {
  chainId: SushiSwapV4ChainId
  poolId: Hex
  enabled?: boolean
}

/** The pool's current price, active liquidity and tick spacing. */
export function useV4PoolSlot0({
  chainId,
  poolId,
  enabled = true,
}: UseV4PoolStateParams) {
  const config = useConfig()

  return useQuery({
    queryKey: ['useV4PoolSlot0', { chainId, poolId }],
    queryFn: async () => {
      const manager = SUSHISWAP_V4_CL_POOL_MANAGER[chainId]

      const [poolKey, slot0, liquidity] = await readContracts(config, {
        allowFailure: false,
        contracts: [
          {
            chainId,
            address: manager,
            abi: sushiSwapV4CLPoolManagerAbi_poolIdToPoolKey,
            functionName: 'poolIdToPoolKey',
            args: [poolId],
          },
          {
            chainId,
            address: manager,
            abi: sushiSwapV4CLPoolManagerAbi_getSlot0,
            functionName: 'getSlot0',
            args: [poolId],
          },
          {
            chainId,
            address: manager,
            abi: sushiSwapV4CLPoolManagerAbi_getLiquidity,
            functionName: 'getLiquidity',
            args: [poolId],
          },
        ],
      })

      const [sqrtPriceX96, tick] = slot0
      const parameters = poolKey[5]

      return {
        sqrtPriceX96,
        tick,
        liquidity,
        tickSpacing: getV4TickSpacing(parameters),
      }
    },
    refetchInterval: ms('10s'),
    enabled,
  })
}

/**
 * Every initialized tick of the pool, sorted ascending: one multicall scans
 * the tick bitmap, a second reads the populated words through the tick lens.
 */
export function useV4PoolTicks({
  chainId,
  poolId,
  tickSpacing,
  enabled = true,
}: UseV4PoolStateParams & { tickSpacing: number | undefined }) {
  const config = useConfig()

  return useQuery({
    queryKey: ['useV4PoolTicks', { chainId, poolId, tickSpacing }],
    queryFn: async (): Promise<V4PopulatedTick[]> => {
      if (!tickSpacing) throw new Error('tickSpacing is required')

      const words = getV4TickBitmapWords(tickSpacing)

      const bitmaps = await readContracts(config, {
        allowFailure: false,
        batchSize: TICK_SCAN_BATCH_SIZE,
        contracts: words.map(
          (word) =>
            ({
              chainId,
              address: SUSHISWAP_V4_CL_POOL_MANAGER[chainId],
              abi: sushiSwapV4CLPoolManagerAbi_getPoolBitmapInfo,
              functionName: 'getPoolBitmapInfo',
              args: [poolId, word],
            }) as const,
        ),
      })

      const populatedWords = words.filter((_, i) => bitmaps[i] !== 0n)
      if (populatedWords.length === 0) return []

      const populatedTicks = await readContracts(config, {
        allowFailure: false,
        batchSize: TICK_SCAN_BATCH_SIZE,
        contracts: populatedWords.map(
          (word) =>
            ({
              chainId,
              address: SUSHISWAP_V4_CL_TICK_LENS[chainId],
              abi: sushiSwapV4CLTickLensAbi_getPopulatedTicksInWord,
              functionName: 'getPopulatedTicksInWord',
              args: [poolId, word],
            }) as const,
        ),
      })

      return populatedTicks
        .flat()
        .map(({ tick, liquidityNet }) => ({ tick, liquidityNet }))
        .sort((a, b) => a.tick - b.tick)
    },
    // Ticks only change with liquidity adds and removes
    staleTime: ms('1m'),
    refetchInterval: ms('1m'),
    enabled: Boolean(enabled && tickSpacing),
  })
}
