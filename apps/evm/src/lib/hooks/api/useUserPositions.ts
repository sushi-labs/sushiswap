'use client'

import { parseArgs } from '@sushiswap/client'
import { useMemo } from 'react'
import { PositionWithPool } from 'src/types'
import { ChainId } from 'sushi/chain'
import useSWR from 'swr'


export interface GetUserArgs {
  id?: string
  chainIds?: ChainId[]
}

export function getUserPositionsWithPoolsUrl(args: GetUserArgs) {
  return `/pool/api/user-with-pools/${parseArgs(args)}`
}


export function useUserPositions(args: GetUserArgs, shouldFetch = true) {
  const { data: positions } = useSWR<PositionWithPool[]>(
    shouldFetch && args.id ? getUserPositionsWithPoolsUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
  
  const pools = useMemo(
    () => positions?.map((position) => position.pool) || [],
    [positions],
  )

  const isValidating =
    shouldFetch &&
    (!positions || !pools || (positions.length > 0 && pools.length === 0))

  return useMemo(
    () => ({
      data: !isValidating
        ? positions?.filter((position) =>
            Array.isArray(args.chainIds)
              ? args.chainIds?.includes(position.chainId as ChainId)
              : true,
          )
        : undefined,
      isValidating,
    }),
    [args.chainIds, isValidating, positions],
  )
}

