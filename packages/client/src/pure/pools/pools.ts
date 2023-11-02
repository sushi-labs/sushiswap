import type {} from '@sushiswap/database'
// biome-ignore lint/correctness/noUnusedVariables: it's fine 😀
import type { getEarnPools as getEarnPoolsOriginal } from '@sushiswap/pools-api/lib/api/index'
import { PoolsApiSchema } from '@sushiswap/pools-api/lib/schemas/pools'

import { POOL_API } from '../../constants.js'
import { parseArgs } from '../../functions.js'
import type { GetApiInputFromOutput } from '../../types.js'

export { PoolsApiSchema }
export type Pools = Awaited<ReturnType<typeof getEarnPoolsOriginal>>
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
