import { client, Prisma } from '@sushiswap/database'

/**
 * Filters pools to only include the ones that are new or have changed.
 * @param client
 * @param pools
 * @returns
 */
export async function filterPools(
  pools: Prisma.SushiPoolCreateManyInput[]
): Promise<Prisma.SushiPoolCreateManyInput[]> {
  const poolSelect = Prisma.validator<Prisma.SushiPoolSelect>()({
    id: true,
    address: true,
    reserve0: true,
    reserve1: true,
    totalSupply: true,
    liquidityUSD: true,
    volumeUSD: true,
    token0Price: true,
    token1Price: true,
    feeApr: true,
    incentiveApr: true,
    totalApr: true,
  })

  let poolsToCreate = 0
  let poolsToUpdate = 0
  const poolsToUpsert: Prisma.SushiPoolCreateManyInput[] = []

  const poolsFound = await client.sushiPool.findMany({
    where: {
      address: { in: pools.map((pool) => pool.address) },
    },
    select: poolSelect,
  })

  const filteredPools = pools.filter((pool) => {
    const poolExists = poolsFound.find((p) => p.id === pool.id)
    if (!poolExists) {
      poolsToCreate++
      return true
    }
    if (
      pool.reserve0 !== poolExists.reserve0 ||
      pool.reserve1 !== poolExists.reserve1 ||
      pool.totalSupply !== poolExists.totalSupply ||
      Number(pool.liquidityUSD).toFixed(2) !== poolExists.liquidityUSD.toFixed(2).toString() ||
      Number(pool.volumeUSD).toFixed(2) !== poolExists.volumeUSD.toFixed(2).toString() ||
      pool.token0Price !== poolExists.token0Price ||
      pool.token1Price !== poolExists.token1Price ||
      pool.feeApr !== poolExists.feeApr
    ) {
      poolsToUpdate++
      pool.totalApr = Number(pool.feeApr ?? 0) + Number(poolExists.incentiveApr ?? 0)
      return true
    }
    return false
  })
  poolsToUpsert.push(...filteredPools)

  console.log(
    `TRANSFORM - Filtering pools, ${poolsToCreate} pools should be created and ${poolsToUpdate} pools should be updated.`
  )
  return poolsToUpsert
}
