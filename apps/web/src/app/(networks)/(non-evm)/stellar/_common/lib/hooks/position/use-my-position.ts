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
        } catch (error) {
          console.error(
            'Error fetching pool address for position',
            position.tokenId,
            error,
          )
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

  // Fetch principal amounts for each position
  console.log(
    `🔧 [useMyPosition] Setting up ${filteredPositions.length} principal queries`,
  )

  const principalQueries = useQueries({
    queries: filteredPositions.map((position) => ({
      queryKey: ['stellar', 'position-principal', position.tokenId],
      queryFn: async () => {
        console.log(`🔍 Calculating principal for position ${position.tokenId}`)

        try {
          const result = await positionService.getPositionPrincipal(
            position.tokenId,
          )
          console.log(`✅ Principal for position ${position.tokenId}:`, {
            amount0: result.amount0.toString(),
            amount1: result.amount1.toString(),
          })
          return [getPositionKey(position), result]
        } catch (error) {
          console.error(
            `❌ Failed to get principal for position ${position.tokenId}:`,
            error,
          )
          return [getPositionKey(position), { amount0: 0n, amount1: 0n }]
        }
      },
      enabled: position.tokenId !== undefined && position.tokenId !== null,
      staleTime: 1000 * 30, // 30 seconds
      retry: 1,
    })),
  })

  // Check if any principal queries are still loading
  const principalsLoading = principalQueries.some((query) => query.isLoading)

  const positionToPrincipalMap = useMemo(() => {
    return Object.fromEntries(
      principalQueries
        .map((query) => query.data)
        .filter(
          (data): data is [string, { amount0: bigint; amount1: bigint }] =>
            data !== undefined,
        ),
    )
  }, [principalQueries])

  // Debug query states
  console.log(
    `🔧 [useMyPosition] Principal queries status:`,
    principalQueries.map((q, i) => ({
      index: i,
      tokenId: filteredPositions[i]?.tokenId,
      isLoading: q.isLoading,
      isFetching: q.isFetching,
      isSuccess: q.isSuccess,
      isError: q.isError,
      hasData: !!q.data,
      data: q.data,
      error: q.error,
    })),
  )

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
      const principalData = positionToPrincipalMap[getPositionKey(position)]
      const token0 = getTokenByContract(position.token0) ?? UNKNOWN_TOKEN
      const token1 = getTokenByContract(position.token1) ?? UNKNOWN_TOKEN
      console.log(`Processing position ${position.tokenId}:`, {
        principal0: principalData.amount0.toString(),
        principal1: principalData.amount1.toString(),
        fees0: position.tokensOwed0.toString(),
        fees1: position.tokensOwed1.toString(),
        liquidity: position.liquidity.toString(),
        token0: token0,
        token1: token1,
      })

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
        pool: positionToPoolMap[getPositionKey(position)] || '',
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
