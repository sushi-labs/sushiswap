import { Prisma, PrismaClient } from "@prisma/client"

export async function createTokens(client: PrismaClient, tokens: Prisma.TokenCreateManyInput[]) {
    if (tokens.length === 0) {
      console.log(`LOAD - Not updating any tokens, all tokens seem to be created. `)
      return
    }
    let count = 0
    const batchSize = 500
    for (let i = 0; i < tokens.length; i += batchSize) {
      const created = await client.token.createMany({
        data: tokens.slice(i, i + batchSize),
        skipDuplicates: true,
      })
      console.log(`LOAD - Batched and created ${created.count} tokens`)
      count += created.count
    }
    console.log(`LOAD - Created ${count} tokens. `)
  }