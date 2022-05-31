import { ChainId } from '@sushiswap/core-sdk'
import { toAmount } from 'app/functions'
import { GRAPH_HOST } from 'app/services/graph/constants'
import { getTokenSubset } from 'app/services/graph/fetchers'
import { kashiPairsQuery } from 'app/services/graph/queries/kashi'

import { getBentoTokens } from './bentobox'
import { pager } from './pager'

export const KASHI = {
  [ChainId.ETHEREUM]: 'lufycz/kashi',
  [ChainId.ARBITRUM]: 'matthewlilley/kashi-arbitrum',
}

// @ts-ignore TYPE NEEDS FIXING
const fetcher = async (chainId = ChainId.ETHEREUM, query, variables = undefined) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${KASHI[chainId]}`, query, variables)

export const getKashiPairs = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const { kashiPairs } = await fetcher(chainId, kashiPairsQuery, variables)

  const tokenAddresses = Array.from(
    kashiPairs.reduce(
      // @ts-ignore TYPE NEEDS FIXING
      (previousValue, currentValue) => previousValue.add(currentValue.asset, currentValue.collateral),
      new Set() // use set to avoid duplicates
    )
  )

  const bentoBoxTokens = await getBentoTokens(chainId, {
    tokenAddresses,
  })

  const exchangeTokens = await getTokenSubset(chainId, {
    tokenAddresses,
  })

  try {
    // @ts-ignore TYPE NEEDS FIXING
    return kashiPairs.map((pair) => {
      // @ts-ignore TYPE NEEDS FIXING
      const asset = bentoBoxTokens.find((token) => token.id === pair.asset)
      // @ts-ignore TYPE NEEDS FIXING
      const collateral = bentoBoxTokens.find((token) => token.id === pair.collateral)
      return {
        ...pair,
        asset: {
          ...pair.asset,
          // @ts-ignore TYPE NEEDS FIXING
          ...bentoBoxTokens.find((token) => token.id === pair.asset),
          // @ts-ignore TYPE NEEDS FIXING
          ...exchangeTokens.find((token) => token.id === pair.asset),
        },
        collateral: {
          ...pair.collateral,
          // @ts-ignore TYPE NEEDS FIXING
          ...bentoBoxTokens.find((token) => token.id === pair.collateral),
          // @ts-ignore TYPE NEEDS FIXING
          ...exchangeTokens.find((token) => token.id === pair.collateral),
        },
        token0: {
          ...pair.asset,
          // @ts-ignore TYPE NEEDS FIXING
          ...bentoBoxTokens.find((token) => token.id === pair.asset),
          // @ts-ignore TYPE NEEDS FIXING
          ...exchangeTokens.find((token) => token.id === pair.asset),
        },
        token1: {
          ...pair.collateral,
          // @ts-ignore TYPE NEEDS FIXING
          ...bentoBoxTokens.find((token) => token.id === pair.collateral),
          // @ts-ignore TYPE NEEDS FIXING
          ...exchangeTokens.find((token) => token.id === pair.collateral),
        },
        assetAmount: Math.floor(
          pair.totalAssetBase /
            (pair.totalAssetBase /
              (Number(pair.totalAssetElastic) + (pair.totalBorrowElastic * asset.rebase.base) / asset.rebase.elastic))
        ).toString(),
        borrowedAmount: toAmount(
          {
            elastic: pair.totalBorrowElastic.toBigNumber(0),
            base: pair.totalBorrowBase.toBigNumber(0),
          },
          pair.totalBorrowElastic.toBigNumber(0)
        ).toString(),
        collateralAmount: toAmount(
          {
            elastic: collateral.rebase.elastic.toBigNumber(0),
            base: collateral.rebase.base.toBigNumber(0),
          },
          pair.totalCollateralShare.toBigNumber(0)
        ).toString(),
      }
    })
  } catch (error) {
    console.log(error)
  }
}
