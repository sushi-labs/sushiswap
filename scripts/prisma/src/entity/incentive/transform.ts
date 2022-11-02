import { Prisma, PrismaClient } from '@prisma/client'

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

  const incentivesToCreate = incentives.filter((incentive) => {
    const incentiveExists = incentiveFound.find((i) => i.id === incentive.id)
    if (!incentiveExists) {
      return true
    }
    return false
  })

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
