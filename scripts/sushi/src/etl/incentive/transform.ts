import { Prisma, PrismaClient } from '@prisma/client'
import { id } from 'date-fns/locale'

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
    where: { address: { in: incentives.map((incentive) => incentive.poolAddress) } },
    select: { address: true },
  })
  const foundPools = poolsFound.map((pool) => pool.address)

  const rewardTokensFound = await client.token.findMany({
    where: { id: { in: incentives.map((incentive) => incentive.chainId.concat('_').concat(incentive.rewardTokenId)) } },
    select: { address: true },
  })
  const foundRewardTokens = rewardTokensFound.map((token) => token.address)

  let missingTokens = 0
  let missingPools = 0
  const incentivesToCreate = incentives.filter((incentive) => {
    const incentiveExists = incentiveFound.find((i) => i.id === incentive.id)
    if (!foundRewardTokens.includes(incentive.rewardTokenId)) {
      // console.log(
      //   `SKIP: incentive with id ${incentive.id} missing token: ${incentive.poolAddress} ${incentive.rewardTokenId}`
      // )
      missingTokens += 1
      return false
    }
    if (!incentiveExists) {
      if (!foundPools.includes(incentive.poolAddress)) {
        console.log(
          `SKIP: incentive with id ${incentive.id} missing pool: ${incentive.chainId} ${incentive.poolAddress}`
        )
        missingPools += 1
        return false
      }

      return true
    }

    return false
  })
  if (missingPools) console.log(`Missing pools, skipping incentives: ${missingPools}`)
  if (missingTokens) console.log(`Missing tokens, skipping incentives: ${missingTokens}`)

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
