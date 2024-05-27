import { SUSHISWAP_V3_SUBGRAPH_URL } from 'sushi/config/subgraph'
import { Query, QueryResolvers } from '../../.graphclient/index.js'

const MAX_FIRST = 1000

export const poolsByTokenPair: QueryResolvers['poolsByTokenPair'] = async (
  root,
  args,
  context,
  info,
): Promise<Query['poolsByTokenPair']> => {
  const [chainId, tokenAddress0] = args.tokenId0.split(':')
  const [, tokenAddress1] = args.tokenId1.split(':')

  // Sorted on the factory contract
  const tokenAddresses = [tokenAddress0, tokenAddress1].sort()

  const fetch = (lastId: string) =>
    context.SushiSwapV3.Query.SUSHISWAP_V3_pools({
      root,
      args: {
        first: MAX_FIRST,
        where: {
          id_gt: lastId,
          token0: tokenAddresses[0],
          token1: tokenAddresses[1],
        },
        orderBy: 'id',
        orderDirection: 'asc',
      },
      context: {
        ...context,
        chainId: Number(chainId),
        url: SUSHISWAP_V3_SUBGRAPH_URL[chainId],
      },
      info,
    })

  const data = []
  let lastId = ''
  for (;;) {
    const newData = await fetch(lastId)
    data.push(...newData)

    if (newData.length < MAX_FIRST) break

    lastId = newData[newData.length - 1].id
  }

  return data
}
