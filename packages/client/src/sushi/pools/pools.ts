import type {} from '@sushiswap/database'
import type { getPools as getPoolsOriginal } from '@sushiswap/pools-api/lib/api'
import { PoolsApiSchema } from '@sushiswap/pools-api/lib/schemas'
import { parseArgs } from 'src/functions'
import type { GetApiInputFromOutput } from 'src/types'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { POOL_API } from '.'

export { PoolsApiSchema }
export type Pools = Awaited<ReturnType<typeof getPoolsOriginal>>
export type GetPoolsArgs = GetApiInputFromOutput<(typeof PoolsApiSchema)['_input'], (typeof PoolsApiSchema)['_output']>

export const getPoolsUrl = (args?: GetPoolsArgs) => `${POOL_API}/api/v0${parseArgs(args)}`

export const getPools = async (args?: GetPoolsArgs): Promise<Pools> => {
  return fetch(getPoolsUrl(args)).then((data) => data.json())
}

export const usePools = (args?: GetPoolsArgs, shouldFetch = true) => {
  return useSWR<Pools>(shouldFetch ? getPoolsUrl(args) : null, async (url) => fetch(url).then((data) => data.json()))
}

export const usePoolsInfinite = (args?: GetPoolsArgs) => {
  return useSWRInfinite(
    (pageIndex, previousData) => {
      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return args

      // add the cursor to the API endpoint
      return { ...args, cursor: previousData?.[previousData.length - 1].id }
    },
    (args) => getPools(args)
  )
}
