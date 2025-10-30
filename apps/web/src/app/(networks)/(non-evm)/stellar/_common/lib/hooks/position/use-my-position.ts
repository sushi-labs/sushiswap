import { useQueries } from '@tanstack/react-query'
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
}

export interface MyPositionData {
  totalValue: number
  positions: PositionSummary[]
  isLoading: boolean
  error: Error | null
}

const UNKNOWN_TOKEN: Token = {
  code: 'unknown',
  issuer: 'unknown',
  contract: 'unknown',
  name: 'unknown',
  org: 'unknown',
  decimals: 7,
}

const getPositionKey = (position: PositionInfo) => {
  return `${position.token0}-${position.token1}-${position.fee}`
}

/**
 * Hook to get aggregated position data for the My Position component
 */
export function useMyPosition(userAddress?: string, poolAddress?: string) {
  const {
    data: positions = [],
    isLoading: positionsLoading,
    error: positionsError,
  } = useUserPositions(userAddress)

  const positionToPoolQueries = useQueries({
    queries: positions.map((position) => ({
      queryKey: [
        'stellar',
        'position-pool',
        position.token0,
        position.token1,
        position.fee,
      ],
      queryFn: async () => {
        try {
          const poolAddress = await getPoolDirectSDK({
            tokenA: position.token0,
            tokenB: position.token1,
            fee: position.fee,
          })
          return [getPositionKey(position), poolAddress] as const
        } catch (_error) {
          return [getPositionKey(position), null] as const
        }
      },
      enabled: !positionsLoading && !positionsError,
      staleTime: 1000 * 60, // 1 minute
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
      return positionToPoolMap[getPositionKey(position)] === poolAddress
    })
  }, [positions, poolAddress, positionToPoolMap])

  // Group positions by pool for efficient batched principal calculation
  const positionsByPool = useMemo(() => {
    const grouped = new Map<string, PositionInfo[]>()
    for (const position of filteredPositions) {
      const pool = positionToPoolMap[getPositionKey(position)]
      if (pool) {
        if (!grouped.has(pool)) {
          grouped.set(pool, [])
        }
        grouped.get(pool)!.push(position)
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
          const results = await positionService.getPositionsPrincipalBatch(
            tokenIds,
            pool,
          )

          // Convert Map to position key mapping
          const mappedResults: [
            string,
            { amount0: bigint; amount1: bigint },
          ][] = []
          for (const position of positions) {
            const result = results.get(position.tokenId)
            if (result) {
              mappedResults.push([getPositionKey(position), result])
            }
          }

          return mappedResults
        } catch (_error) {
          // Return zeros for all positions in this pool
          return positions.map(
            (position) =>
              [getPositionKey(position), { amount0: 0n, amount1: 0n }] as [
                string,
                { amount0: bigint; amount1: bigint },
              ],
          )
        }
      },
      enabled: positions.length > 0 && pool !== '',
      staleTime: 1000 * 30, // 30 seconds
      retry: 1,
    })),
  })

  // Check if any principal queries are still loading
  const principalsLoading = principalQueries.some((query) => query.isLoading)

  const positionToPrincipalMap = useMemo(() => {
    const allResults: [string, { amount0: bigint; amount1: bigint }][] = []

    for (const query of principalQueries) {
      if (query.data) {
        allResults.push(...query.data)
      }
    }

    return Object.fromEntries(allResults)
  }, [principalQueries])

  // Aggregate position data with principal amounts
  const positionData = useMemo((): MyPositionData => {
    if (positionsLoading || principalsLoading || poolsLoading) {
      return {
        totalValue: 0,
        positions: [],
        isLoading: true,
        error: positionsError || null,
      }
    }

    // Aggregate amounts for each token across all positions (principal + fees)
    const positionSummaries: PositionSummary[] = []

    // Process each position with its principal amounts
    filteredPositions.forEach((position) => {
      const positionKey = getPositionKey(position)
      const principalData = positionToPrincipalMap[positionKey]
      const poolAddress = positionToPoolMap[positionKey]

      // Skip if we don't have principal data yet
      if (!principalData) {
        return
      }

      const token0 = getTokenByContract(position.token0) ?? UNKNOWN_TOKEN
      const token1 = getTokenByContract(position.token1) ?? UNKNOWN_TOKEN

      // Add to position summaries
      positionSummaries.push({
        tokenId: position.tokenId,
        liquidity: position.liquidity.toString(),
        principalToken0: principalData.amount0,
        principalToken1: principalData.amount1,
        feesToken0: position.tokensOwed0,
        feesToken1: position.tokensOwed1,
        token0,
        token1,
        pool: poolAddress || '',
      })
    })

    // Calculate total value (placeholder - would need price data)
    const totalValue = 0 // TODO: Calculate based on token amounts and prices

    return {
      totalValue,
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
