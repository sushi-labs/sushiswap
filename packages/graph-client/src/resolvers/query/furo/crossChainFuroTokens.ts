import { chainName, chainShortName } from '@sushiswap/chain'
import { FURO_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'

import { FuroToken, getBuiltGraphSDK, QueryResolvers } from '../../../../.graphclient'
import { page } from '../../../page'

export const crossChainFuroTokens: QueryResolvers['crossChainFuroTokens'] = async (root, args, context, info) => {
  const filteredChainIds = args.chainIds.filter((chainId) => Object.keys(FURO_SUBGRAPH_NAME).includes(String(chainId)))

  const fetcher = async () => {
    return Promise.all(
      filteredChainIds.map((chainId) => {
        const sdk = getBuiltGraphSDK({
          subgraphName: FURO_SUBGRAPH_NAME[chainId],
          //@ts-ignore
          subgraphHost: SUBGRAPH_HOST[chainId],
        })

        return sdk
          .FuroRebases({ where: { token_not: '0x0000000000000000000000000000000000000000' } })
          .then(({ rebases }) =>
            rebases.map((rebase) => ({
              ...rebase,
              id: `${chainShortName[chainId]}:${rebase.id}`,
              address: rebase.id,
              chainId,
              chainName: chainName[chainId],
              chainShortName: chainShortName[chainId],
            }))
          )
      })
    ).then((tokens) => tokens.flat())
  }

  const rebases = await fetcher()

  console.log(rebases[0])

  const tokens = rebases.map((rebase) => ({
    ...rebase.token,
    liquidityElastic: (
      (BigInt(rebase.token.liquidityShares) * BigInt(rebase.elastic)) /
      BigInt(rebase.base ?? 1)
    ).toString(),
  })) as unknown as FuroToken[]

  return page(tokens, args.pagination)
}
