import type * as _ from '@prisma/client'

import type { ID } from 'sushi/types'
import { type PoolApiSchema } from '../../pure/pools/pool/schema'
import { getPoolsFromDB } from './pools'
import { getUnindexedPool } from './unindexedPool'

export async function getPoolFromDB(args: typeof PoolApiSchema._output) {
  const id = `${args.chainId}:${args.address.toLowerCase()}` as ID

  let pool: Awaited<ReturnType<typeof getPoolsFromDB>>[0] | undefined =
    undefined

  // Need to specify take, orderBy and orderDir to make TS happy
  try {
    const res = await getPoolsFromDB({
      ids: [id],
      take: 1,
      orderBy: 'liquidityUSD',
      orderDir: 'desc',
    })

    if (res[0]) {
      pool = res[0]
    }
  } catch (e) {
    console.error(e)
  }

  if (!pool) {
    pool = (await getUnindexedPool(id)) as any
  }

  if (!pool) {
    throw new Error('Failed to fetch pool')
  }

  return pool
}
