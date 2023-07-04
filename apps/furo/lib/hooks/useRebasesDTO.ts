import { Token } from '@sushiswap/currency'
import { FuroStreamChainId } from '@sushiswap/furo/exports/exports'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { useQuery } from '@tanstack/react-query'

import { bentoBoxRebaseQuery, getBuiltGraphSDK } from '../../.graphclient'
import { SUPPORTED_CHAINS } from '../../config'

const GRAPH_HOST = 'api.thegraph.com'

interface UseRebaseDTO {
  tokens: Token[]
  enabled?: boolean
}

export const queryRebasesDTO = async ({ tokens }: Omit<UseRebaseDTO, 'enabled'>) => {
  const sdks = tokens.map((token) =>
    getBuiltGraphSDK({
      chainId: token.chainId,
      host: GRAPH_HOST,
      name: FURO_SUBGRAPH_NAME[token.chainId],
    })
  )

  const data: { chainId: FuroStreamChainId; data: NonNullable<bentoBoxRebaseQuery> }[] = []
  await Promise.allSettled(
    sdks.map((sdk, i) =>
      sdk.bentoBoxRebase({
        id: tokens[i].wrapped.address.toLowerCase(),
      })
    )
  ).then((results) => {
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        data.push({
          chainId: SUPPORTED_CHAINS[i],
          data: result.value as NonNullable<bentoBoxRebaseQuery>,
        })
      }
    })
  })

  return data
}

export const useRebasesDTO = ({ tokens, enabled = true }: UseRebaseDTO) => {
  return useQuery({
    queryKey: ['useRebasesDTO', { tokens }],
    queryFn: async () => await queryRebasesDTO({ tokens }),
    enabled: Boolean(enabled),
  })
}
