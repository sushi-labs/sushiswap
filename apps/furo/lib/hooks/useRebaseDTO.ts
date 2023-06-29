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
  address: string | undefined
  enabled?: boolean
}

export const queryRebaseDTO = async ({ chainId, address }: Omit<UseRebaseDTO, 'enabled'>) => {
  if (!address || !isSupportedChainId(chainId)) return null

  const sdk = getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })

  const data = await sdk.bentoBoxRebase({
    id: address === AddressZero ? Native.onChain(chainId).wrapped.address.toLowerCase() : address,
  })

  return data?.rebase ?? null
}

export const useRebaseDTO = ({ chainId, address, enabled = true }: UseRebaseDTO) => {
  return useQuery({
    queryKey: ['useRebaseDTO', { chainId, address }],
    queryFn: async () => await queryRebaseDTO({ chainId, address }),
    enabled: Boolean(enabled && address),
  })
}
