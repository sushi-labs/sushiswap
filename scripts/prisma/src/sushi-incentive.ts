import 'dotenv/config'
import './lib/wagmi'

import { MINICHEF_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import { Prisma, PrismaClient } from '@prisma/client'
import { getMasterChefV1, getMasterChefV2, getMinichef } from './lib'

import { ChainId, chainName } from '@sushiswap/chain'
import { performance } from 'perf_hooks'
import { mergeIncentives } from './entity/incentive/load'
import { filterIncentives } from './entity/incentive/transform'
import { createTokens } from './entity/token/load'
import { filterTokens } from './entity/token/transform'
import { Farm } from './lib/types'

const client = new PrismaClient()

async function main() {
  console.log(`Preparing to load farms`)
  const startTime = performance.now()

  // EXTRACT
  const farms = await extract()
  console.log(`EXTRACT - Extracted ${farms.length} farms`)

  // TRANSFORM
  const { incentivesToCreate, incentivesToUpdate, tokens } = await transform(farms)

  const poolsFound = [incentivesToCreate.map(incentive => incentive.poolAddress).concat(incentivesToUpdate.map(incentive => incentive.poolAddress))].flat()
  const result = await client.pool.findMany({
    where: {
      id: {
        in: poolsFound
      }
    },
    select: {
      id: true,
    }
  })
  console.log(`f ${poolsFound.length} r ${result.length}`)

  // // LOAD
  await createTokens(client, tokens)
  await mergeIncentives(client, incentivesToCreate, incentivesToUpdate)
  
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

async function transform(data: { chainId: ChainId; farms: Record<string, Farm> }[]): Promise<{
  incentivesToCreate: Prisma.IncentiveCreateManyInput[]
  incentivesToUpdate: Prisma.IncentiveCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const incentives = data
    .map((farm) => {
      const chainId = farm.chainId
      return Object.entries(farm.farms)
        .map(([poolAddress, farm]) => {
          return farm.incentives
            .map((incentive) => {
              tokens.push(
                Prisma.validator<Prisma.TokenCreateManyInput>()({
                  id: chainId.toString().concat('_').concat(incentive.rewardToken.address.toLowerCase()),
                  address: incentive.rewardToken.address.toLowerCase(),
                  network: chainName[chainId],
                  chainId: chainId.toString(),
                  name: 'TODO',
                  symbol: incentive.rewardToken.symbol,
                  decimals: incentive.rewardToken.decimals,
                })
              )
              return Prisma.validator<Prisma.IncentiveCreateManyInput>()({
                id: poolAddress.concat('_').concat(incentive.rewarder.address),
                chainId: chainId.toString(),
                type: farm.chefType,
                apr: isNaN(incentive.apr) || incentive.apr === Infinity ? 0 : incentive.apr,
                rewardTokenId: incentive.rewardToken.address.toLowerCase(),
                rewardPerDay: incentive.rewardPerDay,
                rewarderAddress: incentive.rewarder.address.toLowerCase(),
                poolAddress: poolAddress.toLowerCase(),
              })
            })
            .flat()
        })
        .flat()
    })
    .flat()

  const filteredTokens = await filterTokens(client, tokens)
  console.log(`TEST, token needed: ${filteredTokens.length}`)
  const { incentivesToCreate, incentivesToUpdate } = await filterIncentives(client, incentives)

  return { incentivesToCreate, incentivesToUpdate, tokens: filteredTokens }
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
