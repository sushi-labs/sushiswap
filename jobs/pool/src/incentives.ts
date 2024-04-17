import 'dotenv/config'
import './lib/wagmi.js'

import { Prisma, createDirectClient } from '@sushiswap/database'
import { MINICHEF_SUBGRAPH_URL } from '@sushiswap/graph-config'
import { performance } from 'perf_hooks'
import { ChainId } from 'sushi/chain'

import { filterIncentives } from './etl/incentive/index.js'
import { mergeIncentives } from './etl/incentive/load.js'
import { updatePoolsWithIncentivesTotalApr } from './etl/pool/index.js'
import { createTokens } from './etl/token/load.js'
import { getMasterChefV1, getMasterChefV2, getMinichef } from './lib/index.js'
import { ChefReturn } from './lib/types.js'

export async function execute() {
  try {
    console.log('Preparing to load farms/incentives')
    const startTime = performance.now()

    // EXTRACT
    const farms = await extract()
    console.log(`EXTRACT - Extracted farms from ${farms.length} chains.`)

    // TRANSFORM
    const { incentivesToCreate, incentivesToUpdate, tokens } =
      await transform(farms)

    // // LOAD
    await createTokens(tokens)
    await mergeIncentives(incentivesToCreate, incentivesToUpdate)
    await updatePoolsWithIncentivesTotalApr()

    const endTime = performance.now()
    console.log(
      `COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(
        1,
      )} seconds. `,
    )
  } catch (e) {
    console.error(e)
    await (await createDirectClient()).$disconnect()
  } finally {
    await (await createDirectClient()).$disconnect()
  }
}

async function extract() {
  const minichefsP = Object.keys(MINICHEF_SUBGRAPH_URL).map((chainId) =>
    getMinichef(Number(chainId) as keyof typeof MINICHEF_SUBGRAPH_URL),
  )
  const masterChefV1P = getMasterChefV1()
  const masterChefV2P = getMasterChefV2()

  const [masterChefV1, masterChefV2, ...minichefs] = await Promise.all([
    masterChefV1P,
    masterChefV2P,
    ...minichefsP,
  ])
  const combined = [
    {
      chainId: ChainId.ETHEREUM,
      farms: { ...masterChefV1.farms, ...masterChefV2.farms },
    },
    ...minichefs,
  ]

  const totalFarms = combined.reduce(
    (acc, { farms }) => acc + (farms ? Object.keys(farms).length : 0),
    0,
  )
  let totalIncentives = 0
  for (const combination of combined) {
    if (combination.farms) {
      const incentiveCount = Object.entries(combination.farms).reduce(
        (acc, [, farm]) => acc + farm.incentives.length,
        0,
      )
      totalIncentives += incentiveCount
      console.log(
        `Chain ID: ${combination.chainId}. Farms: ${
          Object.keys(combination.farms).length
        }, incentives: ${incentiveCount}`,
      )
    } else {
      console.error(`Chain ID: ${combination.chainId}. Error.`)
    }
  }
  console.log(
    `Total farms: ${totalFarms}, total incentives: ${totalIncentives}`,
  )
  return combined
}

async function transform(data: ChefReturn[]): Promise<{
  incentivesToCreate: Prisma.IncentiveCreateManyInput[]
  incentivesToUpdate: Prisma.IncentiveCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const incentives = data.flatMap((farm) => {
    const chainId = farm.chainId
    return Object.entries(farm.farms ?? []).flatMap(([poolAddress, farm]) => {
      return farm.incentives.flatMap((incentive) => {
        tokens.push(
          Prisma.validator<Prisma.TokenCreateManyInput>()({
            id: chainId
              .toString()
              .concat(':')
              .concat(incentive.rewardToken.address.toLowerCase()),
            address: incentive.rewardToken.address.toLowerCase(),
            chainId: chainId,
            name: incentive.rewardToken.name,
            symbol: incentive.rewardToken.symbol,
            decimals: incentive.rewardToken.decimals,
          }),
        )
        return Prisma.validator<Prisma.IncentiveCreateManyInput>()({
          id: poolAddress.concat(':').concat(incentive.rewarder.address),
          chainId: chainId,
          chefType: farm.chefType,
          apr:
            Number.isNaN(incentive.apr) || incentive.apr === Infinity
              ? 0
              : incentive.apr,
          rewardTokenId: chainId
            .toString()
            .concat(':')
            .concat(incentive.rewardToken.address.toLowerCase()),
          rewardPerDay: incentive.rewardPerDay,
          poolId: chainId
            .toString()
            .concat(':')
            .concat(poolAddress.toLowerCase()),
          pid: farm.id,
          rewarderAddress: incentive.rewarder.address.toLowerCase(),
          rewarderType: incentive.rewarder.type,
        })
      })
    })
  })

  const { incentivesToCreate, incentivesToUpdate } =
    await filterIncentives(incentives)

  return { incentivesToCreate, incentivesToUpdate, tokens }
}
