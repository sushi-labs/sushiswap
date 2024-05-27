import { SUSHISWAP_ENABLED_NETWORKS } from '@sushiswap/graph-config'
import type { ChainIdsInsteadOfChainId } from 'src/lib/types/chainId'
import { fetchMultichain } from 'src/multichain/fetch-multichain'
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
