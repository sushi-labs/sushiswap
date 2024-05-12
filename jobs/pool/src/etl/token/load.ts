import { Prisma } from '@sushiswap/database'
import { client } from 'src/lib/prisma'
import { ChainId } from 'sushi'
import { Address } from 'viem'

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

export async function getMissingTokens(
  tokens: { chainId: ChainId; address: Address }[],
) {
  if (tokens.length === 0) {
    return []
  }
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

  return tokens
    .filter(
      (token) =>
        !tokensFound.find(
          (createdToken) =>
            createdToken.id ===
            `${token.chainId}:${token.address.toLowerCase()}`,
        ),
    )
    .map((token) => ({
      address: token.address,
      chainId: token.chainId,
    }))
}
