import type {} from '@sushiswap/database'
import { getEarnPools } from '@sushiswap/pools-api/lib/api'
import { PoolsApiSchema } from '@sushiswap/pools-api/lib/schemas/pools'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { POOL_API } from '../../constants'
import { parseArgs } from '../../functions'
import type {
  GetApiInputFromOutput,
  InfiniteSWRHookConfig,
  SWRHookConfig,
} from '../../types'

export { PoolsApiSchema }
export type Pools = Awaited<ReturnType<typeof getEarnPools>>
export type GetPoolsArgs =
  | GetApiInputFromOutput<
      typeof PoolsApiSchema['_input'],
      typeof PoolsApiSchema['_output']
    >
  | undefined

export const getPoolsUrl = (args: GetPoolsArgs) => {
  return `${POOL_API}/api/v0${parseArgs(args)}`
}

export const getPools = async (args: GetPoolsArgs): Promise<Pools> => {
  return fetch(getPoolsUrl(args)).then((data) => data.json())
}

export const usePools = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetPoolsArgs>) => {
  return useSWR<Pools>(
    shouldFetch !== false ? getPoolsUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
export const usePoolsInfinite = ({
  args,
  shouldFetch,
}: InfiniteSWRHookConfig<GetPoolsArgs>) => {
  return useSWRInfinite<Pools>(
    (pageIndex, previousData) => {
      if (shouldFetch === false) return null

      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return getPoolsUrl(args)

      // add the cursor to the API endpoint
      return getPoolsUrl({
        ...args,
        cursor: previousData?.[previousData.length - 1]?.id,
      })
    },
    (url) => fetch(url).then((data) => data.json()),
  )
}
