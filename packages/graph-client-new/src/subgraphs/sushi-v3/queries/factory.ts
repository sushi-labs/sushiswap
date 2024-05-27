import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { SUSHISWAP_V3_SUBGRAPH_URL } from 'sushi/config/subgraph'

import { FetchError } from 'src/lib/fetch-error'
import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import type { Hex } from 'src/lib/types/hex'
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

  if (result.factories[0]) {
    const factory = result.factories[0]

    return convertIdToMultichainId(
      copyIdToAddress(
        addChainId(chainId, factory as typeof factory & { id: Hex }),
      ),
    )
  }

  throw new FetchError(chainId, 'Failed to fetch factory')
}

export type SushiV3Factory = Awaited<ReturnType<typeof getSushiV3Factory>>
