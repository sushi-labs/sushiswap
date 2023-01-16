import prisma from '@sushiswap/database'

export async function getIncentivesByChainId(chainId: number) {
  const incentives = await prisma.incentive.findMany({
    include: {
      rewardToken: true,
    },
    where: { chainId },
  })
  await prisma.$disconnect()
  return incentives ? incentives : []
}

export async function getIncentives() {
  const incentives = await prisma.incentive.findMany({
    include: {
      rewardToken: true,
    },
  })
  await prisma.$disconnect()
  return incentives ? incentives : []
}


export async function getIncentivesByPoolId(chainId: number, address: string) {
  const poolId = `${chainId}:${address.toLowerCase()}`
  const incentives = await prisma.incentive.findMany({
    include: {
      rewardToken: true,
    },
    where: { poolId },
  })
  await prisma.$disconnect()
  return incentives ? incentives : []
}
