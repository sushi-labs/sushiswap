import 'dotenv/config'
import './lib/wagmi'

import { MINICHEF_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import { PrismaClient } from '@prisma/client'
import { getMasterChefV1, getMasterChefV2, getMinichef } from './lib'

import { ChainId } from '@sushiswap/chain'
import { performance } from 'perf_hooks'

const client = new PrismaClient()

async function main() {
  const startTime = performance.now()
  console.log(`Preparing to load farms`)

  // EXTRACT
  const farms = await extract()
  console.log(`EXTRACT - Extracted ${farms.length} farms`)

  // TRANSFORM
  // const { tokens, pricesToCreate, pricesToUpdate } = await transform(exchanges)

  // // LOAD
  // await createTokens(client, tokens)
  // await mergePrices(client, PROTOCOL, VERSION, pricesToCreate, pricesToUpdate)

  const endTime = performance.now()
  console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}

async function extract() {
  const minichefsP = Object.keys(MINICHEF_SUBGRAPH_NAME).map((chainId) => getMinichef(Number(chainId)))
  const masterChefV1P = getMasterChefV1()
  const masterChefV2P = getMasterChefV2()

  const [masterChefV1, masterChefV2, ...minichefs] = await Promise.all([masterChefV1P, masterChefV2P, ...minichefsP])
  return [
    {
      chainId: ChainId.ETHEREUM,
      farms: { ...masterChefV1.farms, ...masterChefV2.farms },
    },
    ...minichefs,
  ]
}

main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
