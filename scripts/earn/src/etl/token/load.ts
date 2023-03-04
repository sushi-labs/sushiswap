import { client, Prisma } from '@sushiswap/database'

export async function createTokens(tokens: Prisma.TokenCreateManyInput[]) {
  if (tokens.length === 0) {
    return
  }
  const created = await client.token.createMany({
    data: tokens,
    skipDuplicates: true,
  })
  if (created.count > 0) {
    console.log(`LOAD - Created ${created.count} tokens. `)
  }
}
