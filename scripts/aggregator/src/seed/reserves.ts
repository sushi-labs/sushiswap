import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { readContracts } from '@wagmi/core'
import { performance } from 'perf_hooks'

import IUniswapV2PairArtifact from '@uniswap/v2-core/build/IUniswapV2Pair.json' assert { type: 'json' }
import '../lib/wagmi.js'
import { ProtocolName, ProtocolVersion } from '../config.js'

const prisma = new PrismaClient()

async function main() {
  // TODO: pass in params, e.g. chainId, protocol, version
  // Hardcoded for now.
  // const chainId = ChainId.BSC
  // const protocol = ProtocolName.PANCAKESWAP
  const chainId = ChainId.POLYGON
  const protocol = ProtocolName.QUICKSWAP
  const version = ProtocolVersion.V2
  const pools = await getPoolAddresses(chainId, protocol, version)
  const poolWithReserves = await getReserves(chainId, pools)
  // await updatePoolsWithReserve(chainId, poolWithReserves)
}

async function getPoolAddresses(chainId: ChainId, protocol: string, version: string) {
  const startTime = performance.now()
  const count = await prisma.pool.count({
    where: {
      chainId,
      protocol,
      version,
    },
  })

  // const batchSize = 10000
  const batchSize = 8000
  // const requestCount = Math.ceil(count / batchSize)
  const requestCount = 1

  const requests = [...Array(requestCount).keys()].map((i) =>
    prisma.pool.findMany({
      select: {
        address: true,
      },
      where: {
        chainId,
        protocol,
        version,
      },
      take: batchSize,
      skip: i * batchSize,
    })
  )

  const responses = await Promise.all(requests)
  const poolAddresses = responses.flat().map((pool) => pool.address)

  const endTime = performance.now()

  console.log(`Fetched ${poolAddresses.length} pool addresses (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  return poolAddresses
}

async function getReserves(chainId: ChainId, poolAddresses: string[]): Promise<PoolWithReserve[]> {
  const contracts = poolAddresses.map((address) => ({
    address,
    chainId,
    abi: IUniswapV2PairArtifact.abi,
    functionName: 'getReserves',
    allowFailure: true,
  }))
  const requests = []
  const startTime = performance.now()
  const contractsPerRequest = 1000

  for (let i = 0; i < contracts.length; i+= contractsPerRequest) {
    const to = i + contractsPerRequest < contracts.length ? i + contractsPerRequest : contracts.length
    const batch = contracts.slice(i, to)
    requests.push(
      readContracts({
        contracts: batch,
      })
    )
  }

  const data = []
  // run concurrent requests
  const concurrent = requests.length > 5 ? 5 : requests.length

  for (let i = 0; i < requests.length; i += concurrent) {
    const max = i + concurrent < requests.length ? i + concurrent : i + requests.length % concurrent
    const batch = requests.slice(i, max)
    const responses = await Promise.all(batch)
    data.push(responses.flat())
  }

  const reserves: any = data.flat()

  let failures = 0
  const mappedPools = poolAddresses.reduce<PoolWithReserve[]>((prev, address, i) => {
    if (!reserves[i] || !reserves[i].reserve0 || !reserves[i].reserve1) {
      failures++
      return prev
    }
    return [
      ...prev,
      {
        address,
        reserve0: reserves[i].reserve0.toString() as string,
        reserve1: reserves[i].reserve1.toString() as string,
      },
    ]
  }, [])

  const endTime = performance.now()
  if (failures > 0) {
    console.log(`Failed to fetch reserves for ${failures} pools.`)
  }
  console.log(`Fetched reserves for ${mappedPools.length} pools (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  return mappedPools
}

async function updatePoolsWithReserve(chainId: ChainId, pools: PoolWithReserve[]) {
  const startTime = performance.now()
  const batchSize = 250
  let updatedCount = 0

  for (let i = 0; i < pools.length; i += batchSize) {
    const batch = pools.slice(i, i + batchSize)
    const requests = batch.map((pool) => {
      const id = chainId.toString().concat(':').concat(pool.address.toLowerCase())
      return prisma.pool.update({
        select: { id: true }, // select only the `id` field, otherwise it returns everything and we don't use the data after updating.
        where: { id },
        data: {
          reserve0: pool.reserve0,
          reserve1: pool.reserve1,
        },
      })
    })
    const responses = await Promise.all(requests)
    console.log(`Updated ${responses.length} pools.`)
    updatedCount += responses.length
  }
  const endTime = performance.now()
  console.log(`Updated ${updatedCount} pools (${((endTime - startTime) / 1000).toFixed(1)}s). `)
}

interface PoolWithReserve {
  address: string
  reserve0: string
  reserve1: string
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
