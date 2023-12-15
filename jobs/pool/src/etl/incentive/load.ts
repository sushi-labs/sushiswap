import { Prisma, createClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

/**
 * Merges(Create/Update) incentives.
 * Using this wrapper function because createMany() has better performance than upsert(), speeds up the initial seeding.
 * @param client
 * @param incentives
 */
export async function mergeIncentives(
  incentivesToCreate: Prisma.IncentiveCreateManyInput[],
  incentivesToUpdate: Prisma.IncentiveCreateManyInput[],
) {
  const incentivesAlreadyExist = await hasIncentives()
  if (incentivesAlreadyExist) {
    await updateIncentives(incentivesToUpdate)
    await createIncentives(incentivesToCreate)
  } else {
    await createIncentives(incentivesToCreate)
  }
}

async function updateIncentives(incentives: Prisma.IncentiveCreateManyInput[]) {
  if (incentives.length === 0) {
    return
  }
  console.log(`LOAD - Preparing to update ${incentives.length} incentives`)

  const client = await createClient()
  const incentivesToUpdate = incentives.map((incentive) => {
    return client.incentive.update({
      select: {
        id: true,
      },
      where: {
        id: incentive.id,
      },
      data: {
        apr: incentive.apr,
        rewardPerDay: incentive.rewardPerDay,
      },
    })
  })

  const startTime = performance.now()
  const updatedIncentives = await Promise.all(incentivesToUpdate)
  const endTime = performance.now()

  await client.$disconnect()

  console.log(
    `LOAD - Updated ${updatedIncentives.length} incentives. (${(
      (endTime - startTime) /
      1000
    ).toFixed(1)}s) `,
  )
}

async function createIncentives(incentives: Prisma.IncentiveCreateManyInput[]) {
  if (incentives.length === 0) {
    return
  }

  let count = 0
  const batchSize = 500
  const startTime = performance.now()

  const client = await createClient()

  for (let i = 0; i < incentives.length; i += batchSize) {
    const created = await client.incentive.createMany({
      data: incentives.slice(i, i + batchSize),
      skipDuplicates: true,
    })
    console.log(`LOAD - Batched and created ${created.count} incentives`)
    count += created.count
  }
  const endTime = performance.now()
  console.log(
    `LOAD - Created ${count} incentives. (${(
      (endTime - startTime) /
      1000
    ).toFixed(1)}s)`,
  )
}

async function hasIncentives() {
  const client = await createClient()
  const count = await client.incentive.count()
  await client.$disconnect()
  return count > 0
}
