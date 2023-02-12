import { ChainId } from '@sushiswap/chain'
import { UserPosition } from '@sushiswap/graph-client'
import { parseArgs, Pools, usePools } from '@sushiswap/client'
import { useMemo } from 'react'
import useSWR from 'swr'
import { PositionWithPool } from '../../../types'
import { useSWRConfig } from 'swr/_internal'

export interface GetUserArgs {
  id?: string
  chainIds?: ChainId[]
}

export function getUserPositionsUrl(args: GetUserArgs) {
  return `/earn/api/user/${parseArgs(args)}`
}

const transformPositions = (positions?: UserPosition[], pools?: Pools) =>
  positions && pools
    ? positions
        .map((position) => {
          const pool = pools.find((pool) => pool.id === position.pool)

          return { ...position, pool }
        })
        .filter((position): position is PositionWithPool => !!position.pool)
    : []

export async function getUserPositions(args: GetUserArgs): Promise<UserPosition[]> {
  const url = getUserPositionsUrl(args)
  if (!url) throw new Error('GetUser: Missing id or chainIds.')

  return fetch(url).then((data) => data.json())
}

export function useUserPositions(args: GetUserArgs, shouldFetch = true) {
  const { data: positions } = useSWR<UserPosition[]>(
    shouldFetch && args.id ? getUserPositionsUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json())
  )

  const { data: pools, isValidating } = usePools({
    args: { ids: positions?.map((position) => position.pool) },
    swrConfig: useSWRConfig(),
    shouldFetch: !!positions,
  })

  return useMemo(
    () => ({
      data: transformPositions(positions, pools).filter((position) =>
        !!args.chainIds ? args.chainIds?.includes(position.chainId) : true
      ),
      isValidating,
    }),
    [args.chainIds, isValidating, pools, positions]
  )
}
