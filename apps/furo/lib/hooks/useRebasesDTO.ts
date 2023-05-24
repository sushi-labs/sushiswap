import { useQuery } from '@tanstack/react-query'
import { isSupportedChainId } from '../../config'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { AddressZero } from '@ethersproject/constants'
import { Native } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '../../.graphclient'

const GRAPH_HOST = 'api.thegraph.com'

interface UseRebaseDTO {
  chainId: ChainId
  addresses: string[] | undefined
  enabled?: boolean
}

export const queryRebasesDTO = async ({ chainId, addresses }: Omit<UseRebaseDTO, 'enabled'>) => {
  if (!addresses || !isSupportedChainId(chainId)) return null

  const sdk = getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })

  const data = await sdk.bentoBoxRebases({
    where: {
      token_in: addresses.map((token) =>
        token === AddressZero ? Native.onChain(chainId).wrapped.address.toLowerCase() : token
      ),
    },
  })

  return data?.rebases ?? null
}

export const useRebasesDTO = ({ chainId, addresses, enabled = true }: UseRebaseDTO) => {
  return useQuery({
    queryKey: ['useRebasesDTO', { chainId, addresses }],
    queryFn: async () => await queryRebasesDTO({ chainId, addresses }),
    enabled: Boolean(enabled && addresses),
  })
}
