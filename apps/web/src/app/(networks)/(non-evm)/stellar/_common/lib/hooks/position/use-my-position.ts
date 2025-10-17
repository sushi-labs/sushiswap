import type { UserPositionInfo } from '@sushiswap/stellar-contract-binding-position-manager'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { positionService } from '../../services/position-service'
import { POOL_CONFIGS, getPoolConfig } from '../../soroban/contract-addresses'
import { getPoolInfoFromContract } from '../../soroban/position-manager-helpers'
import { formatTokenAmount } from '../../utils/format'
import { useUserPositions } from './use-positions'

export interface PositionAsset {
  address: string
  code: string
  amount: string
  usdAmount: string
}

export interface PositionSummary {
  tokenId: number
  liquidity: string
  principalToken0: string
  principalToken1: string
  feesToken0: string
  feesToken1: string
}

export interface MyPositionData {
  totalValue: number
  assets: PositionAsset[]
  positions: PositionSummary[]
  isLoading: boolean
  error: Error | null
}

/**
 * Hook to get aggregated position data for the My Position component
 */
export function useMyPosition(
  userAddress: string | undefined,
  poolAddress: string,
) {
  const {
    data: positions = [],
    isLoading: positionsLoading,
    error: positionsError,
  } = useUserPositions(userAddress)

  // Get pool configuration (hardcoded first, then dynamic)
  const hardcodedConfig = getPoolConfig(poolAddress)

  // If no hardcoded config, fetch dynamically from contract
  const { data: dynamicConfig, isLoading: configLoading } = useQuery({
    queryKey: ['stellar', 'pool-config', poolAddress],
    queryFn: async () => {
      console.log(`🔍 Fetching dynamic pool config for ${poolAddress}`)
      const config = await getPoolInfoFromContract(poolAddress)
      console.log(`✅ Dynamic pool config loaded:`, config)
      return config
    },
    enabled: !hardcodedConfig && !!poolAddress,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  })

  // Use hardcoded config if available, otherwise use dynamic config
  const poolConfig = hardcodedConfig || dynamicConfig

  // Filter positions for the specific pool
  const poolPositions = useMemo(() => {
    if (!poolConfig || !positions.length) {
      return []
    }

    return positions.filter((position) => {
      // Check if this position belongs to the current pool by matching token addresses
      return (
        (position.token0 === poolConfig.token0.address &&
          position.token1 === poolConfig.token1.address) ||
        (position.token0 === poolConfig.token1.address &&
          position.token1 === poolConfig.token0.address)
      )
    })
  }, [positions, poolConfig])

  // Fetch principal amounts for each position
  console.log(
    `🔧 [useMyPosition] Setting up ${poolPositions.length} principal queries`,
  )

  const principalQueries = useQueries({
    queries: poolPositions.map((position) => ({
      queryKey: ['stellar', 'position-principal', position.token_id],
      queryFn: async () => {
        console.log(
          `🔍 Calculating principal for position ${position.token_id}`,
        )

        try {
          const result = await positionService.getPositionPrincipal(
            position.token_id,
          )
          console.log(`✅ Principal for position ${position.token_id}:`, {
            amount0: result.amount0.toString(),
            amount1: result.amount1.toString(),
          })
          return result
        } catch (error) {
          console.error(
            `❌ Failed to get principal for position ${position.token_id}:`,
            error,
          )
          return { amount0: 0n, amount1: 0n }
        }
      },
      enabled: position.token_id !== undefined && position.token_id !== null,
      staleTime: 1000 * 30, // 30 seconds
      retry: 1,
    })),
  })

  // Check if any principal queries are still loading
  const principalsLoading = principalQueries.some((query) => query.isLoading)

  // Debug query states
  console.log(
    `🔧 [useMyPosition] Principal queries status:`,
    principalQueries.map((q, i) => ({
      index: i,
      tokenId: poolPositions[i]?.token_id,
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
    if (!poolConfig || poolPositions.length === 0) {
      return {
        totalValue: 0,
        assets: [
          {
            address: poolConfig?.token0.address || '',
            code: poolConfig?.token0.code || '',
            amount: '0.0',
            usdAmount: '0.0',
          },
          {
            address: poolConfig?.token1.address || '',
            code: poolConfig?.token1.code || '',
            amount: '0.0',
            usdAmount: '0.0',
          },
        ],
        positions: [],
        isLoading: positionsLoading || principalsLoading || configLoading,
        error: positionsError || null,
      }
    }

    // If still loading principals, show loading state
    if (principalsLoading) {
      return {
        totalValue: 0,
        assets: [
          {
            address: poolConfig.token0.address,
            code: poolConfig.token0.code,
            amount: '0.0',
            usdAmount: '0.0',
          },
          {
            address: poolConfig.token1.address,
            code: poolConfig.token1.code,
            amount: '0.0',
            usdAmount: '0.0',
          },
        ],
        positions: [],
        isLoading: true,
        error: null,
      }
    }

    // Aggregate amounts for each token across all positions (principal + fees)
    const tokenAmounts = new Map<string, { amount: bigint; code: string }>()
    const positionSummaries: PositionSummary[] = []

    // Process each position with its principal amounts
    poolPositions.forEach((position, index) => {
      const principalData = principalQueries[index]?.data || {
        amount0: 0n,
        amount1: 0n,
      }

      console.log(`Processing position ${position.token_id}:`, {
        principal0: principalData.amount0.toString(),
        principal1: principalData.amount1.toString(),
        fees0: position.tokens_owed0.toString(),
        fees1: position.tokens_owed1.toString(),
        liquidity: position.liquidity.toString(),
      })

      // Add to position summaries
      positionSummaries.push({
        tokenId: position.token_id,
        liquidity: position.liquidity.toString(),
        principalToken0: formatTokenAmount(principalData.amount0, 7),
        principalToken1: formatTokenAmount(principalData.amount1, 7),
        feesToken0: formatTokenAmount(position.tokens_owed0, 7),
        feesToken1: formatTokenAmount(position.tokens_owed1, 7),
      })

      // Calculate total for token0 (principal + fees)
      const token0Key = position.token0
      const token0Code =
        position.token0 === poolConfig.token0.address
          ? poolConfig.token0.code
          : poolConfig.token1.code
      const token0Total = principalData.amount0 + position.tokens_owed0

      if (tokenAmounts.has(token0Key)) {
        const existing = tokenAmounts.get(token0Key)!
        tokenAmounts.set(token0Key, {
          amount: existing.amount + token0Total,
          code: existing.code,
        })
      } else {
        tokenAmounts.set(token0Key, {
          amount: token0Total,
          code: token0Code,
        })
      }

      // Calculate total for token1 (principal + fees)
      const token1Key = position.token1
      const token1Code =
        position.token1 === poolConfig.token0.address
          ? poolConfig.token0.code
          : poolConfig.token1.code
      const token1Total = principalData.amount1 + position.tokens_owed1

      if (tokenAmounts.has(token1Key)) {
        const existing = tokenAmounts.get(token1Key)!
        tokenAmounts.set(token1Key, {
          amount: existing.amount + token1Total,
          code: existing.code,
        })
      } else {
        tokenAmounts.set(token1Key, {
          amount: token1Total,
          code: token1Code,
        })
      }
    })

    console.log(
      '✅ Aggregated token amounts (principal + fees):',
      Array.from(tokenAmounts.entries()).map(([addr, data]) => ({
        address: addr,
        code: data.code,
        amount: data.amount.toString(),
      })),
    )

    // Convert to assets array
    const assets: PositionAsset[] = Array.from(tokenAmounts.entries()).map(
      ([address, data]) => ({
        address,
        code: data.code,
        amount: formatTokenAmount(data.amount, 7),
        usdAmount: '0.0', // TODO: Calculate USD values using price feeds
      }),
    )

    // Calculate total value (placeholder - would need price data)
    const totalValue = 0 // TODO: Calculate based on token amounts and prices

    return {
      totalValue,
      assets,
      positions: positionSummaries,
      isLoading: positionsLoading || principalsLoading,
      error: positionsError || null,
    }
  }, [
    poolPositions,
    poolConfig,
    configLoading,
    positionsLoading,
    positionsError,
    principalQueries,
    principalsLoading,
  ])

  return positionData
}
