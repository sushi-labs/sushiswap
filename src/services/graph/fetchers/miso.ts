import { ChainId } from '@sushiswap/core-sdk'
import { pager } from 'app/services/graph'
import { misoCommitmentsQuery } from 'app/services/graph/queries/miso'

import { GRAPH_HOST } from '../constants'

export const MISO = {
  [ChainId.KOVAN]: 'sushiswap/kovan-miso',
  [ChainId.HARMONY]: 'sushiswap/miso',
  [ChainId.MATIC]: 'sushiswap/miso-polygon',
  [ChainId.ETHEREUM]: 'sushiswap/miso-ethereum',
  [ChainId.FANTOM]: 'sushiswap/miso-fantom',
  [ChainId.BSC]: 'sushiswap/miso-bsc',
  [ChainId.AVALANCHE]: 'sushiswap/miso-avalanche',
  [ChainId.ARBITRUM]: 'sushiswap/miso-arbitrum',
  [ChainId.MOONBEAM]: 'sushiswap/miso-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/miso-moonriver',
}

// @ts-ignore TYPE NEEDS FIXING
export const miso = async (chainId = ChainId.ETHEREUM, query, variables = {}) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${MISO[chainId]}`, query, variables)

// @ts-ignore TYPE NEEDS FIXING
export const getMisoCommitments = async (chainId, variables) => {
  return miso(chainId, misoCommitmentsQuery, variables)
}
