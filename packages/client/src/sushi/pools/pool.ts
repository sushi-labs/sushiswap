import type { getPool as getPoolOriginal } from '@sushiswap/pools-api/lib/api'
import { PoolApiSchema } from '@sushiswap/pools-api/lib/schemas'
import { fetch } from '@whatwg-node/fetch'
import type { GetApiInputFromOutput } from 'src/types'

import { POOL_API } from '.'

export { PoolApiSchema }
export type Pool = Awaited<ReturnType<typeof getPoolOriginal>>
export type GetPoolArgs = GetApiInputFromOutput<(typeof PoolApiSchema)['_input'], (typeof PoolApiSchema)['_output']>

export const getPool = async (args: GetPoolArgs): Promise<Pool> =>
  fetch(`${POOL_API}/api/v0/${args.chainId}/${args.address}`).then((data) => data.json())
