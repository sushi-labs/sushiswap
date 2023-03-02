import { ChainId } from '@sushiswap/chain'
import { UserPosition } from '@sushiswap/graph-client'
import { parseArgs, Pools } from '@sushiswap/client'
import { useMemo } from 'react'
import useSWR from 'swr'
import { PositionWithPool } from '../../../types'
import { useGraphPools } from './useGraphPools'

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

export function useUserPositions(args: GetUserArgs, shouldFetch = true) {
  const { data: positions } = useSWR<UserPosition[]>(
    shouldFetch && args.id ? getUserPositionsUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json())
  )

  const pools = useGraphPools(positions?.map((position) => position.pool) || [])

  return useMemo(
    () => ({
      data: transformPositions(positions, pools).filter((position) =>
        !!args.chainIds ? args.chainIds?.includes(position.chainId) : true
      ),
      isValidating: !positions || !pools || (positions.length > 0 && pools.length === 0),
    }),
    [args.chainIds, pools, positions]
  )
}
