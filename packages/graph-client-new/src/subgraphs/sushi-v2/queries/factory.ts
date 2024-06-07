import type { VariablesOf } from 'gql.tada'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

import { FetchError } from 'src/lib/fetch-error'
import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import { type RequestOptions, request } from 'src/lib/request'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV2FactoriesQuery = graphql(`
  query Factories {
    factories: uniswapFactories(first: 1) {
      id
      totalLiquidityUSD
      untrackedVolumeUSD
      totalVolumeUSD
      poolCount: pairCount
    }
  }
`)

export type GetSushiV2Factory = VariablesOf<typeof SushiV2FactoriesQuery> &
  ChainIdVariable<SushiSwapV2ChainId>

export async function getSushiV2Factory(
  { chainId, ...variables }: GetSushiV2Factory,
  options?: RequestOptions,
) {
  const url = `https://${SUSHISWAP_V2_SUBGRAPH_URL[chainId]}`

  const result = await request(
    {
      url,
      document: SushiV2FactoriesQuery,
      variables,
    },
    options,
  )

  if (result.factories[0]) {
    return convertIdToMultichainId(
      copyIdToAddress(addChainId(chainId, result.factories[0])),
    )
  }

  throw new FetchError(chainId, 'Failed to fetch factory')
}

export type SushiV2Factory = Awaited<ReturnType<typeof getSushiV2Factory>>
