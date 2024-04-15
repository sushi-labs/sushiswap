import { Prisma } from '@sushiswap/database'
import { client } from 'src/lib/prisma'

/**
 * Filters token incentives to only include the ones that are new or have changed.
 * @param client
 * @param incentives
 * @returns
 */
export async function filterIncentives(
  incentives: Prisma.IncentiveCreateManyInput[],
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
    select: incentiveSelect,
  })

  const poolsFound = await client.sushiPool.findMany({
    where: { id: { in: incentives.map((incentive) => incentive.poolId) } },
    select: { id: true },
  })
  const foundPools = poolsFound.map((pool) => pool.id)

  const rewardTokensFound = await client.token.findMany({
    where: {
      id: { in: incentives.map((incentive) => incentive.rewardTokenId) },
    },
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
  if (missingPools)
    console.log(`Missing pools, skipping incentives: ${missingPools}`)
  if (missingTokens)
    console.log(`Missing tokens, skipping incentives: ${missingTokens}`)
  if (missingPools > 0) {
    Object.entries(missingPoolIds).forEach(([chainId, poolIds]) => {
      console.log(`Missing pools on chain ${chainId}, count: ${poolIds.length}`)
    })
  }
  let incentivesAlreadyUpToDate = 0
  const incentivesToUpdate = incentives.filter((incentive) => {
    const incentiveExists = incentiveFound.find((i) => i.id === incentive.id)
    if (!incentiveExists) {
      return false
    }
    if (
      incentive.apr !== incentiveExists.apr ||
      incentive.rewardPerDay !== incentiveExists.rewardPerDay
    ) {
      return true
    } else {
      incentivesAlreadyUpToDate++
    }
    return false
  })

  console.log(
    `TRANSFORM - Filtering incentives\n
    ${incentivesToCreate.length} incentives should be created.\n
    ${incentivesAlreadyUpToDate} incentives are already up to date.\n
    ${incentivesToUpdate.length} incentives should be updated.\n`,
  )

  return { incentivesToCreate, incentivesToUpdate }
}
