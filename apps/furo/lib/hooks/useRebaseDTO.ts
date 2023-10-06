import { AddressZero } from '@ethersproject/constants'
import { ChainId } from 'sushi/chain'
import { Native } from 'sushi/currency'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { useQuery } from '@tanstack/react-query'

import { getBuiltGraphSDK } from '../../.graphclient'
import { isSupportedChainId } from '../../config'

const GRAPH_HOST = 'api.thegraph.com'

interface UseRebaseDTO {
  chainId: ChainId
  address: string | undefined
  enabled?: boolean
}

export const queryRebaseDTO = async ({
  chainId,
  address,
}: Omit<UseRebaseDTO, 'enabled'>) => {
  if (!address || !isSupportedChainId(chainId)) return null

  const sdk = getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })

  const data = await sdk.bentoBoxRebase({
    id:
      address === AddressZero
        ? Native.onChain(chainId).wrapped.address.toLowerCase()
        : address,
  })

  return data?.rebase ?? null
}

export const useRebaseDTO = ({
  chainId,
  address,
  enabled = true,
}: UseRebaseDTO) => {
  return useQuery({
    queryKey: ['useRebaseDTO', { chainId, address }],
    queryFn: async () => await queryRebaseDTO({ chainId, address }),
    enabled: Boolean(enabled && address),
  })
}
