import { Prisma, PrismaClient } from '@prisma/client'

/**
 * Filters pools to only include the ones that are new or have changed.
 * @param client
 * @param pools
 * @returns
 */
export async function filterPools(
  client: PrismaClient,
  pools: Prisma.PoolCreateManyInput[]
): Promise<Prisma.PoolCreateManyInput[]> {
  const poolSelect = Prisma.validator<Prisma.PoolSelect>()({
    id: true,
    address: true,
    reserve0: true,
    reserve1: true,
    totalSupply: true,
    liquidityUSD: true,
    liquidityNative: true,
    volumeUSD: true,
    volumeNative: true,
    token0Price: true,
    token1Price: true,
    apr: true,
    totalApr: true
  })

  const poolsFound = await client.pool.findMany({
    where: {
      address: { in: pools.map((pool) => pool.address) },
    },
    select: poolSelect,
  })

  let poolsToCreate = 0
  let poolsToUpdate = 0
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
      pool.liquidityUSD !== poolExists.liquidityUSD ||
      pool.liquidityNative !== poolExists.liquidityNative ||
      pool.volumeUSD !== poolExists.volumeUSD ||
      pool.volumeNative !== poolExists.volumeNative ||
      pool.token0Price !== poolExists.token0Price ||
      pool.token1Price !== poolExists.token1Price ||
      pool.apr !== poolExists.apr
    ) {
      poolsToUpdate++
      return true
    }
    return false
  })
  console.log(`TRANSFORM - Filtering pools, ${poolsToCreate} pools should be created and ${poolsToUpdate} pools should be updated.`)
  return filteredPools
}
