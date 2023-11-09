import {
  type DecimalToString,
  type Prisma,
  createClient,
} from '@sushiswap/database'
import { isPromiseFulfilled } from 'sushi/validate'

import { type PoolsApiSchema } from '../../../pure/pools/pools/schema'
import { parsePoolArgs } from '../parse'
import { SushiPoolSelect } from './select'

export async function getPoolsFromDB(args: typeof PoolsApiSchema._output) {
  const take = args.take
  const orderBy: Prisma.SushiPoolOrderByWithRelationInput = {
    [args.orderBy]: args.orderDir,
  }
  const where: Prisma.SushiPoolWhereInput = parsePoolArgs(args)

  let skip = 0
  let cursor: { cursor: Prisma.SushiPoolWhereUniqueInput } | object = {}

  if (args.cursor) {
    skip = 1
    cursor = { cursor: { id: args.cursor } }
  }

  const client = await createClient()
  const pools = await client.sushiPool.findMany({
    take,
    skip,
    ...cursor,
    where,
    orderBy,
    select: SushiPoolSelect,
  })

  const poolsRetyped = pools as unknown as DecimalToString<typeof pools>

  if (args.ids && args.ids.length > poolsRetyped.length) {
    const fetchedPoolIds = poolsRetyped.map((pool) => pool.id)
    const unfetchedPoolIds = args.ids.filter(
      (id) => !fetchedPoolIds.includes(id),
    )

    const { getUnindexedPool } = await import('../unindexedPool')

    const unindexedPoolsResults = await Promise.allSettled(
      unfetchedPoolIds.map((id) => getUnindexedPool(id)),
    )
    const unindexedPools = unindexedPoolsResults.flatMap((res) =>
      isPromiseFulfilled(res) ? [res.value] : [],
    )

    poolsRetyped.push(...unindexedPools)
  }

  await client.$disconnect()
  return poolsRetyped
}
