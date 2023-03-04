import type { Prisma, PrismaClient } from '@sushiswap/database'

export async function transform(client: PrismaClient, data: TokenResponse[]): Promise<Prisma.TokenUpdateArgs[]> {
  const existingTokens = await client.token.findMany({
    where: {
      id: {
        in: data.map((token) => token.chainId.toString().concat(':').concat(token.address.toLowerCase())),
      },
    },
  })
  let tokensToApproveCount = 0
  let tokensAlreadyApprovedCount = 0
  let tokensNotDiscoveredCount = 0

  const tokensToApprove: Prisma.TokenUpdateArgs[] = []
  for (const token of data) {
    const id = token.chainId.toString().concat(':').concat(token.address.toLowerCase())
    const existingToken = existingTokens.find((token) => token.id === id)
    if (existingToken) {
      if (existingToken.status !== 'APPROVED') {
        // if (existingToken.decimals !== token.decimals)
        // console.log(
        //   `Token ${id} ${token.symbol} decimals mismatch. DB: ${existingToken.decimals}, SOURCE: ${token.decimals}`
        // )
        tokensToApprove.push({
          where: {
            id: id,
          },
          data: {
            status: 'APPROVED',
          },
        })
        tokensToApproveCount += 1
      } else {
        tokensAlreadyApprovedCount += 1
      }
    } else {
      tokensNotDiscoveredCount += 1
    }
  }

  console.log(
    `${tokensToApproveCount} needs approval, ${tokensAlreadyApprovedCount} already approved, ${tokensNotDiscoveredCount} tokens are not discovered in any pools.`
  )

  return tokensToApprove
}

export interface TokenResponse {
  address: string
  chainId: number
  decimals: number
  logoURI: string
  name: string
  symbol: string
}
