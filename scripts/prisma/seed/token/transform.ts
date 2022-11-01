import { Prisma, PrismaClient } from '@prisma/client'

export async function filterTokens(
  client: PrismaClient,
  tokens: Prisma.TokenCreateManyInput[]
): Promise<Prisma.TokenCreateManyInput[]> {
  const uniqueIds: Set<string> = new Set()
  const uniqueTokens = tokens.filter((token) => {
    if (!uniqueIds.has(token.id)) {
      uniqueIds.add(token.id)
      return true
    }
    return false
  })

  const tokensFound = await client.token.findMany({
    where: {
      id: { in: uniqueTokens.map((token) => token.id) },
    },
    select: {
      id: true,
    },
  })

  return uniqueTokens.filter((token) => !tokensFound.find((t) => t.id === token.id))
}
