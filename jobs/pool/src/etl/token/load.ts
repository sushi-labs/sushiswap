import { Prisma, createClient } from '@sushiswap/database'

export async function createTokens(tokens: Prisma.TokenCreateManyInput[]) {
  if (tokens.length === 0) {
    return
  }
  const client = await createClient()
  const created = await client.token.createMany({
    data: tokens,
    skipDuplicates: true,
  })
  if (created.count > 0) {
    console.log(`LOAD - Created ${created.count} tokens. `)
  }

  await client.$disconnect()
}

export async function getMissingTokens(
  tokens: { chainId: number; address: string }[],
) {
  if (tokens.length === 0) {
    return []
  }
  const client = await createClient()
  const tokensFound = await client.token.findMany({
    select: {
      id: true,
      name: true,
      symbol: true,
    },
    where: {
      id: {
        in: tokens.map(
          (token) => `${token.chainId}:${token.address.toLowerCase()}`,
        ),
      },
    },
  })

  await client.$disconnect()

  return tokens.filter(
    (token) =>
      !tokensFound.find(
        (createdToken) =>
          createdToken.id === `${token.chainId}:${token.address.toLowerCase()}`,
      ),
  )
}
