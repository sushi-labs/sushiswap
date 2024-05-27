import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'

import { FetchError } from 'src/lib/fetch-error'
import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV2FactoriesQuery = graphql(`
  query Factories {
    factories(first: 1) {
      id
      liquidityUSD
      volumeUSD
      poolCount: pairCount
    }
  }
`)

export type GetSushiV2Factory = VariablesOf<typeof SushiV2FactoriesQuery> &
  ChainIdVariable<SushiSwapChainId>

export async function getSushiV2Factory({
  chainId,
  ...variables
}: GetSushiV2Factory) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await request({
    url,
    document: SushiV2FactoriesQuery,
    variables,
  })

  if (result.factories[0]) {
    return convertIdToMultichainId(
      copyIdToAddress(addChainId(chainId, result.factories[0])),
    )
  }

  throw new FetchError(chainId, 'Failed to fetch factory')
}

export type SushiV2Factory = Awaited<ReturnType<typeof getSushiV2Factory>>
