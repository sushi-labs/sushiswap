import type { VariablesOf } from 'gql.tada'

import { BONDS_SUBGRAPH_URL, type BondChainId } from '@sushiswap/bonds-sdk'
import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import type { RequestOptions } from 'src/lib/request'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import type { Hex } from 'src/lib/types/hex'
import { graphql } from '../graphql'

export const BondMarketsQuery = graphql(
  `
  query Markets($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Market_orderBy, $orderDirection: OrderDirection, $where: Market_filter) {
    markets(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      chainId
      type
      auctioneer
      teller
      marketId
      owner
      capacity
      capacityInQuote
      minPrice
      scale
      start
      conclusion
      payoutToken {
        id: address
        symbol
        decimals
        name
      }
      quoteToken {
        id: address
        symbol
        decimals
        name
      }
      vesting
      vestingType
      isInstantSwap
      hasClosed
      totalBondedAmount
      totalPayoutAmount
      averageBondPrice
      bondsIssued
    }
  }
`,
)

export type GetBondMarkets = VariablesOf<typeof BondMarketsQuery> &
  ChainIdVariable<BondChainId>

export async function getBondMarkets(
  { chainId, ...variables }: GetBondMarkets,
  options?: RequestOptions,
) {
  const url = `https://${BONDS_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: BondMarketsQuery,
    variables,
    options,
  })

  return result.markets.map((market) => {
    const quoteToken = convertIdToMultichainId(
      copyIdToAddress(
        addChainId(
          chainId,
          market.quoteToken as typeof market.quoteToken & { id: Hex },
        ),
      ),
    )

    const payoutToken = convertIdToMultichainId(
      copyIdToAddress(
        addChainId(
          chainId,
          market.payoutToken as typeof market.payoutToken & { id: Hex },
        ),
      ),
    )

    return {
      ...market,
      quoteToken,
      payoutToken,
    }
  })
}

export type BondMarkets = Awaited<ReturnType<typeof getBondMarkets>>
