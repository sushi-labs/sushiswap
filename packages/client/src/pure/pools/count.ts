import type { getEarnPoolCount as getEarnPoolCountOriginal } from '@sushiswap/pools-api/lib/api/index.js'
import { PoolCountApiSchema } from '@sushiswap/pools-api/lib/schemas/count'
import { fetch } from '@whatwg-node/fetch'

import { POOL_API } from '../../constants.js'
import { parseArgs } from '../../functions.js'
import type { GetApiInputFromOutput } from '../../types.js'

export { PoolCountApiSchema }
export type PoolCount = Awaited<ReturnType<typeof getEarnPoolCountOriginal>>
export type GetPoolCountArgs =
  | GetApiInputFromOutput<
      typeof PoolCountApiSchema['_input'],
      typeof PoolCountApiSchema['_output']
    >
  | undefined

export const getPoolCountUrl = (args: GetPoolCountArgs) => {
  return `${POOL_API}/api/v0/count${parseArgs(args)}`
}

export const getPoolCount = async (
  args: GetPoolCountArgs,
): Promise<PoolCount> => {
  return fetch(getPoolCountUrl(args)).then((data) => data.json())
}
