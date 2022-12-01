import { Prisma, PrismaClient } from '@prisma/client'

export async function filterTokensToCreate(
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

  const batchSize = 500
  const tokensFound: { id: string }[] = []
  for (let i = 0; i < tokens.length; i += batchSize) {
    tokensFound.push(
      ...(await client.token.findMany({
        where: {
          id: { in: uniqueTokens.slice(i, i + batchSize).map((token) => token.id) },
        },
        select: {
          id: true,
        },
      }))
    )
  }

  const tokensToCreate =  uniqueTokens.filter((token) => !tokensFound.find((t) => t.id === token.id))
  console.log(
    `TRANSFORM - Filtered tokens, ${tokensToCreate.length} should be created.`
  )
  return tokensToCreate
}

/**
 * Filters tokens, return only the ones that are new or tokens that should have their usd price updated.
 * @param client
 * @param tokens
 * @returns
 */
export async function filterTokensByUsdPrice(
  client: PrismaClient,
  tokens: Prisma.TokenCreateManyInput[]
): Promise<{ tokensToCreate: Prisma.TokenCreateManyInput[]; tokensToUpdate: Prisma.TokenUpdateArgs[] }> {
  const tokenSelect = Prisma.validator<Prisma.TokenSelect>()({
    id: true,
    usdPrice: true,
  })

  const tokensFound = await client.token.findMany({
    where: {
      id: { in: tokens.map((token) => token.id) },
    },
    select: tokenSelect,
  })

  const tokensToCreate = tokens.filter((token) => {
    const tokenExists = tokensFound.find((t) => t.id === token.id)
    if (!tokenExists) {
      return true
    }
    return false
  })
  console.log(
    `TRANSFORM - Found ${tokensFound.length} tokens in the database, ${tokensToCreate.length} tokens should be created.`
  )

  const tokensToUpdate = tokens
    .filter((token) => {
      const tokenExists = tokensFound.find((t) => t.id === token.id)
      if (!tokenExists) {
        return false
      }
      if (token.usdPrice != tokenExists.usdPrice) {
        return true
      }
      return false
    })
    .map((token) =>
      Prisma.validator<Prisma.TokenUpdateArgs>()({
        where: {
          id: token.id,
        },
        data: {
          usdPrice: token.usdPrice,
        },
      })
    )
  console.log(
    `TRANSFORM - Filtering tokens, ${tokensToCreate.length} tokens should be created and ${tokensToUpdate.length} tokens should be updated.`
  )
  return { tokensToCreate, tokensToUpdate }
}
