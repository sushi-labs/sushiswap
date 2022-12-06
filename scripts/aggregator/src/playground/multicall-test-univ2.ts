import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { readContracts } from '@wagmi/core'
import { performance } from 'perf_hooks'

import '../lib/wagmi.js'
import IUniswapV2PairArtifact from '@uniswap/v2-core/build/IUniswapV2Pair.json' assert { type: 'json' }

const prisma = new PrismaClient()

async function main() {
  const chainId = ChainId.ETHEREUM
  const pairs = await loadPairs(chainId)
  console.log(pairs.length)
  const reserves = await getReserves(chainId, pairs)
  // console.log(reserves.reserves)
}

async function loadPairs(chainId: ChainId) {
  const startTime = performance.now()
  const r1 = prisma.pool.findMany({
    take: 200,
    select: {
      address: true,
    },
    where: {
      AND: {
        chainId: chainId.toString(),
        protocol: 'UniSwap',
        version: 'V2',
      },
    },
  })
  // const r2 = prisma.pool.findMany({
  //   take: 100000,
  //   skip: 100000,
  //   select: {
  //     address: true,
  //   },
  //   where: {
  //     AND: {
  //       chainId: chainId.toString(),
  //       protocol: 'UniSwap',
  //       version: 'V2',
  //     },
  //   },
  // })
  const pairs = (await Promise.all([r1].flat())).flat()

  const endTime = performance.now()

  console.log(`Load ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
  return pairs
}

async function getReserves(chainId: ChainId, pairs: { address: string }[]) {
  const contracts = pairs.map((pair) => ({
    address: pair.address,
    chainId: chainId,
    abi: IUniswapV2PairArtifact.abi,
    functionName: 'getReserves',
  }))
  const startTime = performance.now()
  const data = await readContracts({
    contracts,
  })
  const endTime = performance.now()
  console.log(`get reserves ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
  return data
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
