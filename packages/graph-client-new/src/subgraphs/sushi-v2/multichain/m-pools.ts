import { SUSHISWAP_ENABLED_NETWORKS } from '@sushiswap/graph-config'
import { fetchMultichain } from 'src/lib/fetch-multichain'
import type { ChainIdsInsteadOfChainId } from 'src/lib/types/chainId'
import { type GetSushiV2Pools, getSushiV2Pools } from '..'

export type GetSushiV2MPools = ChainIdsInsteadOfChainId<GetSushiV2Pools>

export async function getSushiV2MPools({
  chainIds = [...SUSHISWAP_ENABLED_NETWORKS],
  ...variables
}: GetSushiV2MPools) {
  return fetchMultichain({
    chainIds,
    fetch: getSushiV2Pools,
    variables,
  })
}
