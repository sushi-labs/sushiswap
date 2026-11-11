'use client'

import {
  type V4Position,
  getV4Positions,
  isSushiSwapV4ChainId as isIndexedV4ChainId,
} from '@sushiswap/graph-client/data-api'
import {
  type QueryClient,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'
import { readContracts } from '@wagmi/core'
import ms from 'ms'
import {
  type EvmAddress,
  PositionLibrary,
  SUSHISWAP_V4_CL_POOL_MANAGER,
  SUSHISWAP_V4_CL_POSITION_MANAGER,
  type SushiSwapV4ChainId,
  type SushiSwapV4PoolKey,
  TickLibrary,
  computeSushiSwapV4PoolId,
  sushiSwapV4CLPoolManagerAbi_getFeeGrowthGlobals,
  sushiSwapV4CLPoolManagerAbi_getPoolTickInfo,
  sushiSwapV4CLPoolManagerAbi_getPosition,
  sushiSwapV4CLPoolManagerAbi_getSlot0,
  sushiSwapV4CLPositionManagerAbi_ownerOf,
  sushiSwapV4CLPositionManagerAbi_positions,
} from 'sushi/evm'
import {
  BaseError,
  ContractFunctionRevertedError,
  isAddressEqual,
  toFunctionSelector,
  toHex,
} from 'viem'
import { useConfig } from 'wagmi'

/** `account`'s SushiSwap V4 position tokens, burned ones excluded. */
export function useV4Positions({
  chainId,
  account,
  enabled = true,
}: {
  chainId: SushiSwapV4ChainId
  account: EvmAddress | undefined
  enabled?: boolean
}): UseQueryResult<V4Position[]> {
  return useQuery({
    queryKey: ['useV4Positions', { chainId, account }],
    queryFn: async (): Promise<V4Position[]> => {
      if (!account || !isIndexedV4ChainId(chainId)) return []

      const positions = await getV4Positions({ chainId, holder: account })
      return positions.filter(
        (position) =>
          isAddressEqual(
            position.positionManager,
            SUSHISWAP_V4_CL_POSITION_MANAGER[chainId],
          ) &&
          isAddressEqual(
            position.pool.poolManager,
            SUSHISWAP_V4_CL_POOL_MANAGER[chainId],
          ),
      )
    },
    refetchInterval: ms('30s'),
    enabled: Boolean(enabled && account && isIndexedV4ChainId(chainId)),
  })
}

export interface V4PositionDetails {
  tokenId: bigint
  owner: EvmAddress
  poolKey: SushiSwapV4PoolKey
  poolId: `0x${string}`
  tickLower: number
  tickUpper: number
  liquidity: bigint
}

/**
 * A position token's on-chain state; null once burned. Read from chain
 * rather than the index so it is current right after a transaction.
 */
export function useV4PositionDetails({
  chainId,
  tokenId,
  enabled = true,
}: {
  chainId: SushiSwapV4ChainId
  tokenId: bigint | undefined
  enabled?: boolean
}): UseQueryResult<V4PositionDetails | null> {
  const config = useConfig()

  return useQuery({
    queryKey: [
      'useV4PositionDetails',
      { chainId, tokenId: tokenId?.toString() },
    ],
    queryFn: async (): Promise<V4PositionDetails | null> => {
      if (tokenId === undefined) throw new Error('tokenId is required')

      const positionManager = SUSHISWAP_V4_CL_POSITION_MANAGER[chainId]
      const [position, owner] = await readContracts(config, {
        allowFailure: true,
        contracts: [
          {
            chainId,
            address: positionManager,
            abi: sushiSwapV4CLPositionManagerAbi_positions,
            functionName: 'positions',
            args: [tokenId],
          },
          {
            chainId,
            address: positionManager,
            abi: sushiSwapV4CLPositionManagerAbi_ownerOf,
            functionName: 'ownerOf',
            args: [tokenId],
          },
        ],
      })

      // `positions` reverts with `InvalidTokenID()` for a burned token; any
      // other failure, such as an RPC error, fails the query to retry
      if (position.status === 'failure') {
        if (isInvalidTokenIdError(position.error)) return null
        throw position.error
      }
      if (owner.status === 'failure') throw owner.error

      const [poolKey, tickLower, tickUpper, liquidity] = position.result

      return {
        tokenId,
        owner: owner.result,
        poolKey,
        poolId: computeSushiSwapV4PoolId(poolKey),
        tickLower,
        tickUpper,
        liquidity,
      }
    },
    refetchInterval: ms('15s'),
    enabled: Boolean(enabled && tokenId !== undefined),
  })
}

const INVALID_TOKEN_ID_SELECTOR = toFunctionSelector('InvalidTokenID()')

/**
 * Whether `positions` failed because the token does not exist. viem also
 * reports some RPC errors (-32603) as reverts, so the error must match.
 */
function isInvalidTokenIdError(error: Error): boolean {
  if (!(error instanceof BaseError)) return false
  const revert = error.walk((e) => e instanceof ContractFunctionRevertedError)
  return (
    revert instanceof ContractFunctionRevertedError &&
    revert.raw?.slice(0, 10).toLowerCase() === INVALID_TOKEN_ID_SELECTOR
  )
}

export interface V4PositionFees {
  amount0: bigint
  amount1: bigint
}

/**
 * A position's uncollected fees, read from the pool manager at the latest
 * block, so they're current right after a transaction. The index reads them
 * some blocks behind the head.
 */
export function useV4PositionFees({
  chainId,
  details,
}: {
  chainId: SushiSwapV4ChainId
  details: V4PositionDetails | null | undefined
}): UseQueryResult<V4PositionFees> {
  const config = useConfig()

  return useQuery({
    queryKey: [
      'useV4PositionFees',
      { chainId, tokenId: details?.tokenId.toString() },
    ],
    queryFn: async (): Promise<V4PositionFees> => {
      if (!details) throw new Error('details are required')

      const { poolId, tickLower, tickUpper, tokenId } = details
      const address = SUSHISWAP_V4_CL_POOL_MANAGER[chainId]
      const [position, [, tickCurrent], [global0, global1], lower, upper] =
        await readContracts(config, {
          allowFailure: false,
          contracts: [
            {
              chainId,
              address,
              abi: sushiSwapV4CLPoolManagerAbi_getPosition,
              functionName: 'getPosition',
              // The position manager owns every position, salted by token ID
              args: [
                poolId,
                SUSHISWAP_V4_CL_POSITION_MANAGER[chainId],
                tickLower,
                tickUpper,
                toHex(tokenId, { size: 32 }),
              ],
            },
            {
              chainId,
              address,
              abi: sushiSwapV4CLPoolManagerAbi_getSlot0,
              functionName: 'getSlot0',
              args: [poolId],
            },
            {
              chainId,
              address,
              abi: sushiSwapV4CLPoolManagerAbi_getFeeGrowthGlobals,
              functionName: 'getFeeGrowthGlobals',
              args: [poolId],
            },
            {
              chainId,
              address,
              abi: sushiSwapV4CLPoolManagerAbi_getPoolTickInfo,
              functionName: 'getPoolTickInfo',
              args: [poolId, tickLower],
            },
            {
              chainId,
              address,
              abi: sushiSwapV4CLPoolManagerAbi_getPoolTickInfo,
              functionName: 'getPoolTickInfo',
              args: [poolId, tickUpper],
            },
          ],
        })

      const [inside0, inside1] = TickLibrary.getFeeGrowthInside(
        lower,
        upper,
        tickLower,
        tickUpper,
        tickCurrent,
        global0,
        global1,
      )
      const [amount0, amount1] = PositionLibrary.getTokensOwed(
        position.feeGrowthInside0LastX128,
        position.feeGrowthInside1LastX128,
        position.liquidity,
        inside0,
        inside1,
      )
      return { amount0, amount1 }
    },
    refetchInterval: ms('15s'),
    enabled: Boolean(details),
  })
}

/**
 * Call once a transaction on a position confirms: any liquidity change or
 * collect claims all of its fees. Shows them as zero in the indexed
 * positions until their next refetch, and rereads the position and its fees
 * from chain.
 */
export function onV4PositionFeesCollected(
  queryClient: QueryClient,
  { chainId, tokenId }: { chainId: SushiSwapV4ChainId; tokenId: bigint },
): void {
  queryClient.setQueriesData<V4Position[]>(
    { queryKey: ['useV4Positions', { chainId }] },
    (positions) =>
      positions?.map((position) =>
        position.tokenId === tokenId
          ? { ...position, pendingFees: { amount0: 0n, amount1: 0n } }
          : position,
      ),
  )
  void queryClient.invalidateQueries({ queryKey: ['useV4PositionDetails'] })
  void queryClient.invalidateQueries({ queryKey: ['useV4PositionFees'] })
}
