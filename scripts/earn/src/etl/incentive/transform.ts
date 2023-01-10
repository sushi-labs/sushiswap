import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'

/**
 * Filters token incentives to only include the ones that are new or have changed.
 * @param client
 * @param incentives
 * @returns
 */
export async function filterIncentives(
  client: PrismaClient,
  incentives: Prisma.IncentiveCreateManyInput[]
): Promise<{
  incentivesToCreate: Prisma.IncentiveCreateManyInput[]
  incentivesToUpdate: Prisma.IncentiveCreateManyInput[]
}> {
  const incentiveSelect = Prisma.validator<Prisma.IncentiveSelect>()({
    id: true,
    apr: true,
    rewardPerDay: true,
  })

  const incentiveFound = await client.incentive.findMany({
    where: {
      id: { in: incentives.map((incentive) => incentive.id) },
    },
    select: incentiveSelect,
  })

  const poolsFound = await client.pool.findMany({
    where: { id: { in: incentives.map((incentive) => incentive.poolId) } },
    select: { id: true },
  })
  const foundPools = poolsFound.map((pool) => pool.id)

  const rewardTokensFound = await client.token.findMany({
    where: { id: { in: incentives.map((incentive) => incentive.rewardTokenId) } },
    select: { id: true },
  })
  const foundRewardTokens = rewardTokensFound.map((token) => token.id)

  let missingTokens = 0
  const missingPoolIds: Record<string, string[]> = {}
  let missingPools = 0
  const incentivesToCreate = incentives.filter((incentive) => {
    const incentiveExists = incentiveFound.find((i) => i.id === incentive.id)
    if (!foundRewardTokens.includes(incentive.rewardTokenId)) {
      missingTokens += 1
      return false
    }
    if (!incentiveExists) {
      if (!foundPools.includes(incentive.poolId)) {
        missingPools += 1
        if (!missingPoolIds[incentive.chainId]) {
          missingPoolIds[incentive.chainId] = []
        }
        missingPoolIds[incentive.chainId].push(incentive.poolId)
        return false
      }

      return true
    }

    return false
  })
  if (missingPools) console.log(`Missing pools, skipping incentives: ${missingPools}`)
  if (missingTokens) console.log(`Missing tokens, skipping incentives: ${missingTokens}`)
  if (missingPools > 0) {
    Object.entries(missingPoolIds).forEach(([chainId, poolIds]) => {
      console.log(`Missing pools on chain ${chainId}, count: ${poolIds.length}`)
    })
  }

  const incentivesToUpdate = incentives.filter((incentive) => {
    const incentiveExists = incentiveFound.find((i) => i.id === incentive.id)
    if (!incentiveExists) {
      return false
    }
    if (incentive.apr != incentiveExists.apr || incentive.rewardPerDay != incentiveExists.rewardPerDay) {
      return true
    }
    return false
  })
  console.log(
    `TRANSFORM - Filtering incentives, ${incentivesToCreate.length} incentives should be created and ${incentivesToUpdate.length} incentives should be updated.`
  )
  return { incentivesToCreate, incentivesToUpdate }
}
