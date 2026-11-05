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
import { useMemo } from 'react'
import {
  type EvmAddress,
  SUSHISWAP_V4_CL_POOL_MANAGER,
  SUSHISWAP_V4_CL_POSITION_MANAGER,
  type SushiSwapV4ChainId,
  type SushiSwapV4PoolKey,
  computeSushiSwapV4PoolId,
  sushiSwapV4CLPositionManagerAbi_ownerOf,
  sushiSwapV4CLPositionManagerAbi_positions,
} from 'sushi/evm'
import {
  BaseError,
  ContractFunctionRevertedError,
  isAddressEqual,
  toFunctionSelector,
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

type V4PositionFees = NonNullable<V4Position['pendingFees']>

/**
 * A position's uncollected fees, from its owner's indexed positions; null
 * until the index has the position.
 */
export function useV4PositionFees({
  chainId,
  details,
}: {
  chainId: SushiSwapV4ChainId
  details: V4PositionDetails | null | undefined
}): { data: V4PositionFees | null | undefined; isLoading: boolean } {
  const positions = useV4Positions({ chainId, account: details?.owner })

  const data = useMemo(() => {
    if (!positions.data || !details) return undefined
    const position = positions.data.find(
      ({ tokenId }) => tokenId === details.tokenId,
    )
    return position?.pendingFees ?? null
  }, [positions.data, details])

  return { data, isLoading: positions.isLoading }
}

/**
 * Call once a transaction on a position confirms: any liquidity change or
 * collect claims all of its fees. Shows them as zero until the positions'
 * next interval refetch (rather than refetching now, when the index likely
 * still reads a block from before the transaction), and refetches the
 * position itself.
 */
export function onV4PositionFeesCollected(
  queryClient: QueryClient,
  { chainId, tokenId }: { chainId: SushiSwapV4ChainId; tokenId: bigint },
): void {
  queryClient.setQueriesData<V4Position[]>(
    { queryKey: ['useV4Positions', { chainId }] },
    (positions) =>
      positions?.map((position) =>
        position.tokenId === tokenId && position.pendingFees
          ? { ...position, pendingFees: { amount0: 0n, amount1: 0n } }
          : position,
      ),
  )
  void queryClient.invalidateQueries({ queryKey: ['useV4PositionDetails'] })
}
