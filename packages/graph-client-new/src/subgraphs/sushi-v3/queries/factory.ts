import {
  SUSHISWAP_V3_SUBGRAPH_URL,
  type SushiSwapV3ChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'
import request from 'graphql-request'

import type { ChainIdVariable } from 'src/chainId'
import { graphql } from '../graphql'

export const SushiV3FactoriesQuery = graphql(`
  query Factories {
    factories(first: 1) {
      id
      totalValueLockedUSD
      totalVolumeUSD
      poolCount
    }
  }
`)

export type GetSushiV3Factory = VariablesOf<typeof SushiV3FactoriesQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3Factory({
  chainId,
  ...variables
}: GetSushiV3Factory) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await request({
    url,
    document: SushiV3FactoriesQuery,
    variables,
  })

  if (result) {
    return result.factories[0]!
  }

  throw new Error('Failed to fetch factory')
}

export type SushiV3Factory = NonNullable<
  ResultOf<typeof SushiV3FactoriesQuery>
>['factories'][number]
