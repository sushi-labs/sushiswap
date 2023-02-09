import type { getPoolCount as getPoolCountOriginal } from '@sushiswap/pools-api/lib/api'
import { PoolCountApiSchema } from '@sushiswap/pools-api/lib/schemas'
import { fetch } from '@whatwg-node/fetch'
import { parseArgs } from 'src/functions'
import type { GetApiInputFromOutput } from 'src/types'
import useSWR from 'swr'

import { POOL_API } from '.'

export { PoolCountApiSchema }
export type PoolCount = Awaited<ReturnType<typeof getPoolCountOriginal>>
export type GetPoolCountArgs = GetApiInputFromOutput<
  (typeof PoolCountApiSchema)['_input'],
  (typeof PoolCountApiSchema)['_output']
>

// For SWR
export const getPoolCountUrl = (args?: GetPoolCountArgs) => `${POOL_API}/api/v0/count${parseArgs(args)}`

export const getPoolCount = async (args?: GetPoolCountArgs): Promise<PoolCount> =>
  fetch(getPoolCountUrl(args))
    .then((data) => data.json())
    .then((data) => data.count)

export const usePoolCount = (args?: GetPoolCountArgs, shouldFetch = true) => {
  return useSWR<PoolCount>(shouldFetch ? getPoolCountUrl(args) : null, async (url) =>
    fetch(url)
      .then((data) => data.json())
      .then((data) => data.count)
  )
}
