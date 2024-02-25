import type * as _ from '@prisma/client'

import { type PoolApiSchema } from '../../pure/pools/pool/schema'
import { getPoolsFromDB } from './pools'
import { getUnindexedPool } from './unindexedPool'

export async function getPoolFromDB(args: typeof PoolApiSchema._output) {
  const id = `${args.chainId}:${args.address.toLowerCase()}`

  // Need to specify take, orderBy and orderDir to make TS happy
  let [pool] = await getPoolsFromDB({
    ids: [id],
    take: 1,
    orderBy: 'liquidityUSD',
    orderDir: 'desc',
  })

  if (!pool) {
    pool = (await getUnindexedPool(id)) as any
  }

  if (!pool) throw new Error('Pool not found.')

  return pool
}
