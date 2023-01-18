import prisma from '@sushiswap/database'

export async function getIncentivesByChainId(chainId: number) {
  const incentives = await prisma.incentive.findMany({
    select: {
      id: true,
      chainId: true,
      pid: true,
      type: true,
      apr: true,
      rewardPerDay: true,
      poolId: true,
      rewarderAddress: true,
      rewarderType: true,
      rewardToken: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
    },
    where: { chainId },
  })
  await prisma.$disconnect()
  return incentives ? incentives : []
}

export async function getIncentives() {
  const incentives = await prisma.incentive.findMany({
    select: {
      id: true,
      chainId: true,
      pid: true,
      type: true,
      apr: true,
      rewardPerDay: true,
      poolId: true,
      rewarderAddress: true,
      rewarderType: true,
      rewardToken: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
    },
  })
  await prisma.$disconnect()
  return incentives ? incentives : []
}

export async function getIncentivesByPoolId(chainId: number, address: string) {
  const poolId = `${chainId}:${address.toLowerCase()}`
  const incentives = await prisma.incentive.findMany({
    select: {
      id: true,
      chainId: true,
      pid: true,
      type: true,
      apr: true,
      rewardPerDay: true,
      poolId: true,
      rewarderAddress: true,
      rewarderType: true,
      rewardToken: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
    },
    where: { poolId },
  })
  await prisma.$disconnect()
  return incentives ? incentives : []
}
