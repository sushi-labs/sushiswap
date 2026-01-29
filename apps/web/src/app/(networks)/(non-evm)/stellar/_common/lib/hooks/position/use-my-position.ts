import { useQueries } from '@tanstack/react-query'
import ms from 'ms'
import { useMemo } from 'react'
import {
  type PositionInfo,
  positionService,
} from '../../services/position-service'
import { getPoolDirectSDK, getTokenByContract } from '../../soroban'
import type { Token } from '../../types/token.type'
import { useUserPositions } from './use-positions'

export interface PositionSummary {
  tokenId: number
  token0: Token
  token1: Token
  liquidity: string
  principalToken0: bigint
  principalToken1: bigint
  feesToken0: bigint
  feesToken1: bigint
  pool: string
  tickLower: number
  tickUpper: number
  fee: number
}

export interface MyPositionData {
  positions: PositionSummary[]
  isLoading: boolean
  error: Error | null
}

const getPositionKey = (position: PositionInfo) => {
  return `${position.token0}-${position.token1}-${position.fee}`
}

type PoolData = {
  address: string
  token0: Token
  token1: Token
}

/**
 * Hook to get aggregated position data for the My Position component
 */
export function useMyPosition({
  userAddress,
  poolAddress,
  excludeDust = false,
}: {
  userAddress?: string
  poolAddress?: string
  excludeDust?: boolean
}): MyPositionData {
  const {
    data: positions = [],
    isLoading: positionsLoading,
    error: positionsError,
  } = useUserPositions({ userAddress, excludeDust })

  const positionToPoolQueries = useQueries({
    queries: positions.map((position) => ({
      queryKey: [
        'stellar',
        'position-pool',
        position.token0,
        position.token1,
        position.fee,
      ],
      queryFn: async (): Promise<[string, PoolData | null]> => {
        try {
          const poolAddress = await getPoolDirectSDK({
            tokenA: position.token0,
            tokenB: position.token1,
            fee: position.fee,
          })
          if (!poolAddress) {
            throw new Error('Pool not found')
          }
          const token0 = await getTokenByContract(position.token0)
          const token1 = await getTokenByContract(position.token1)
          return [
            getPositionKey(position),
            {
              address: poolAddress,
              token0,
              token1,
            },
          ] as const
        } catch (_error) {
          return [getPositionKey(position), null] as const
        }
      },
      enabled: Boolean(!positionsLoading && !positionsError),
      staleTime: ms('1m'),
      retry: 1,
    })),
  })

  const poolsLoading = positionToPoolQueries.some((query) => query.isLoading)

  const positionToPoolMap = useMemo(() => {
    return Object.fromEntries(
      positionToPoolQueries
        .map((query) => query.data)
        .filter((data) => data !== undefined),
    )
  }, [positionToPoolQueries])

  // Filter positions for the specific pool
  const filteredPositions = useMemo(() => {
    if (poolAddress === undefined) {
      return positions
    }
    return positions.filter((position) => {
      // Check if this position belongs to the current pool
      return (
        positionToPoolMap[getPositionKey(position)]?.address === poolAddress
      )
    })
  }, [positions, poolAddress, positionToPoolMap])

  // Group positions by pool for efficient batched principal calculation
  const positionsByPool = useMemo(() => {
    const grouped = new Map<string, PositionInfo[]>()
    for (const position of filteredPositions) {
      const pool = positionToPoolMap[getPositionKey(position)]
      if (pool) {
        if (!grouped.has(pool.address)) {
          grouped.set(pool.address, [])
        }
        grouped.get(pool.address)!.push(position)
      }
    }
    return grouped
  }, [filteredPositions, positionToPoolMap])

  // Fetch principal amounts per pool (batched)
  const principalQueries = useQueries({
    queries: Array.from(positionsByPool.entries()).map(([pool, positions]) => ({
      queryKey: [
        'stellar',
        'position-principals-batch',
        pool,
        positions.map((p) => p.tokenId).sort(),
      ],
      queryFn: async () => {
        try {
          const tokenIds = positions.map((p) => p.tokenId)
          const results = await positionService.getPositionsPrincipalBatch({
            tokenIds,
            poolAddress: pool,
          })

          // Convert Map to tokenId mapping (each position has unique tokenId)
          const mappedResults: [
            number,
            { amount0: bigint; amount1: bigint },
          ][] = []
          for (const position of positions) {
            const result = results.get(position.tokenId)
            if (result) {
              mappedResults.push([position.tokenId, result])
            }
          }

          return mappedResults
        } catch (_error) {
          // Return zeros for all positions in this pool
          return positions.map(
            (position) =>
              [position.tokenId, { amount0: 0n, amount1: 0n }] as [
                number,
                { amount0: bigint; amount1: bigint },
              ],
          )
        }
      },
      enabled: Boolean(positions.length > 0 && pool),
      staleTime: ms('30s'),
      retry: 1,
    })),
  })

  // Check if any principal queries are still loading
  const principalsLoading = principalQueries.some((query) => query.isLoading)

  const positionToPrincipalMap = useMemo(() => {
    const allResults: [number, { amount0: bigint; amount1: bigint }][] = []

    for (const query of principalQueries) {
      if (query.data) {
        allResults.push(...query.data)
      }
    }

    return Object.fromEntries(allResults) as Record<
      number,
      { amount0: bigint; amount1: bigint }
    >
  }, [principalQueries])

  // Aggregate position data with principal amounts
  const positionData = useMemo((): MyPositionData => {
    if (positionsLoading || principalsLoading || poolsLoading) {
      return {
        positions: [],
        isLoading: true,
        error: positionsError || null,
      }
    }

    // Aggregate amounts for each token across all positions (principal + fees)
    const positionSummaries: PositionSummary[] = []

    // Process each position with its principal amounts
    filteredPositions.forEach((position) => {
      const principalData = positionToPrincipalMap[position.tokenId]
      const positionKey = getPositionKey(position)
      const poolData = positionToPoolMap[positionKey]

      // Skip if we don't have principal data yet
      if (!principalData || !poolData) {
        return
      }

      // Add to position summaries
      positionSummaries.push({
        tokenId: position.tokenId,
        liquidity: position.liquidity.toString(),
        principalToken0: principalData.amount0,
        principalToken1: principalData.amount1,
        feesToken0: position.tokensOwed0,
        feesToken1: position.tokensOwed1,
        token0: poolData.token0,
        token1: poolData.token1,
        pool: poolData.address,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        fee: position.fee,
      })
    })

    return {
      positions: positionSummaries,
      isLoading: false,
      error: positionsError || null,
    }
  }, [
    filteredPositions,
    positionToPoolMap,
    positionToPrincipalMap,
    poolsLoading,
    positionsLoading,
    positionsError,
    principalsLoading,
  ])

  return positionData
}
