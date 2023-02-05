import type { getPools as getPoolsOriginal } from '@sushiswap/pools-api/lib/api'
import { PoolsApiSchema } from '@sushiswap/pools-api/lib/schemas'
import { fetch } from '@whatwg-node/fetch'
import { parseArgs } from 'src/functions'
import type { GetApiInputFromOutput } from 'src/types'

import { POOL_API } from '.'

export { PoolsApiSchema }
export type Pools = Awaited<ReturnType<typeof getPoolsOriginal>>
export type GetPoolsArgs = GetApiInputFromOutput<(typeof PoolsApiSchema)['_input'], (typeof PoolsApiSchema)['_output']>

export const getPools = async (args?: GetPoolsArgs): Promise<Pools> =>
  fetch(`${POOL_API}/api/v0${parseArgs(args)}`).then((data) => data.json())
