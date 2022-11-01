import { Prisma, PrismaClient } from '@prisma/client'
import { performance } from 'perf_hooks'

/**
 * Merges(Create/Update) pools. 
 * Using this wrapper function because createMany() has better performance than upsert(), speeds up the initial seeding.
 * @param client
 * @param pools
 */
export async function mergePools(
  client: PrismaClient,
  protocol: string,
  version: string,
  pools: Prisma.PoolCreateManyInput[]
) {
  const containsProtocolPools = await alreadyContainsProtocol(client, protocol, version)
  if (containsProtocolPools) {
    await upsertPools(client, pools)
  } else {
    await createPools(client, pools)
  }
}

async function upsertPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[]) {
  console.log(`LOAD - Preparing to update ${pools.length} pools`)
  const upsertManyPools = pools.map((pool) => {
    return client.pool.upsert({
      where: { id: pool.id },
      update: {
        reserve0: pool.reserve0,
        reserve1: pool.reserve1,
        totalSupply: pool.totalSupply,
        liquidityUSD: pool.liquidityUSD,
        liquidityNative: pool.liquidityNative,
        volumeUSD: pool.volumeUSD,
        volumeNative: pool.volumeNative,
        token0Price: pool.token0Price,
        token1Price: pool.token1Price,
      },
      create: pool,
    })
  })

  const poolBatchSize = 20
  const startTime = performance.now()
  // let count = 0
  // for (let i = 0; i < upsertManyPools.length; i += poolBatchSize) {
  //   const updatedPools = await client.$transaction([...upsertManyPools.slice(i, i + poolBatchSize)])
  //   count += updatedPools.length
  // }
  
  const updatedPools = await Promise.all(upsertManyPools)
  const endTime = performance.now()
  console.log(`LOAD - Updated ${updatedPools.length} pools. (${((endTime-startTime)/1000).toFixed(1)}s) `)
}

async function createPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[]) {
  let count = 0
  const batchSize = 500
  const startTime = performance.now()
  for (let i = 0; i < pools.length; i += batchSize) {
    const created = await client.pool.createMany({
      data: pools.slice(i, i + batchSize),
      skipDuplicates: true,
    })
    console.log(`LOAD - Batched and created ${created.count} pools`)
    count += created.count
  }
  const endTime = performance.now()
  console.log(`LOAD - Created ${count} pools. (${((endTime-startTime)/1000).toFixed(1)}s) `)
}

async function alreadyContainsProtocol(client: PrismaClient, protocol: string, version: string) {
  const count = await client.pool.count({
    where: {
      protocol,
      version,
    },
  })
  return count > 0
}
