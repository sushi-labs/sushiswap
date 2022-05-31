import { ChainId, CurrencyAmount, JSBI, Token } from '@sushiswap/core-sdk'
import { aprToApy, toAmountCurrencyAmount } from 'app/functions'
import { GRAPH_HOST } from 'app/services/graph/constants'
import {
  bentoBoxQuery,
  bentoStrategiesQuery,
  bentoTokensQuery,
  bentoUserTokensQuery,
  clonesQuery,
} from 'app/services/graph/queries/bentobox'

import { pager } from './pager'

export const BENTOBOX = {
  [ChainId.ETHEREUM]: 'matthewlilley/bentobox-ethereum',
  [ChainId.XDAI]: 'matthewlilley/bentobox-gnosis',
  [ChainId.MATIC]: 'matthewlilley/bentobox-polygon',
  [ChainId.FANTOM]: 'matthewlilley/bentobox-fantom',
  [ChainId.BSC]: 'matthewlilley/bentobox-bsc',
  [ChainId.ARBITRUM]: 'matthewlilley/bentobox-arbitrum',
  [ChainId.AVALANCHE]: 'matthewlilley/bentobox-avalanche',
  [ChainId.MOONBEAM]: 'matthewlilley/bentobox-moonbeam',
  [ChainId.MOONRIVER]: 'matthewlilley/bentobox-moonriver',
  [ChainId.CELO]: 'matthewlilley/bentobox-celo',
}

// @ts-ignore TYPE NEEDS FIXING
const fetcher = async (chainId = ChainId.ETHEREUM, query, variables = undefined) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${BENTOBOX[chainId]}`, query, variables)

export const getClones = async (chainId = ChainId.ETHEREUM) => {
  const { clones } = await fetcher(chainId, clonesQuery)
  return clones
}

// @ts-ignore TYPE NEEDS FIXING
export const getBentoUserTokens = async (chainId = ChainId.ETHEREUM, variables): Promise<CurrencyAmount<Token>[]> => {
  const { userTokens } = await fetcher(chainId, bentoUserTokensQuery, variables)
  return (userTokens || []).map(
    // @ts-ignore TYPE NEEDS FIXING
    ({ share, token: { decimals, id, name, symbol, rebase } }) => {
      return toAmountCurrencyAmount(
        {
          elastic: JSBI.BigInt(rebase.elastic),
          base: JSBI.BigInt(rebase.base),
        },
        CurrencyAmount.fromRawAmount(new Token(chainId, id, Number(decimals), symbol, name), JSBI.BigInt(share))
      )
    }
  )
}

// @ts-ignore TYPE NEEDS FIXING
export const getBentoBox = async (chainId = ChainId.ETHEREUM, variables) => {
  const { bentoBoxes } = await fetcher(chainId, bentoBoxQuery, variables)

  return bentoBoxes[0]
}

// @ts-ignore TYPE NEEDS FIXING
export const getBentoStrategies = async (chainId = ChainId.ETHEREUM, variables) => {
  const { strategies } = await fetcher(chainId, bentoStrategiesQuery, variables)

  const SECONDS_IN_YEAR = 60 * 60 * 24 * 365

  // @ts-ignore TYPE NEEDS FIXING
  return strategies?.map((strategy) => {
    // @ts-ignore TYPE NEEDS FIXING
    const apys = strategy.harvests?.reduce((apys, _, i) => {
      const [lastHarvest, previousHarvest] = [strategy.harvests?.[i], strategy.harvests?.[i + 1]]

      if (!previousHarvest) return apys

      const profitPerYear =
        ((SECONDS_IN_YEAR / (lastHarvest.timestamp - previousHarvest.timestamp)) * lastHarvest.profit) /
        10 ** strategy.token.decimals

      const [tvl, tvlPrevious] = [
        lastHarvest?.tokenElastic / 10 ** strategy.token.decimals,
        previousHarvest?.tokenElastic / 10 ** strategy.token.decimals,
      ]

      return [...apys, (profitPerYear / ((tvl + tvlPrevious) / 2)) * 100]
    }, [])

    // @ts-ignore TYPE NEEDS FIXING
    const apy = apys.reduce((apyAcc, apy) => apyAcc + apy, 0) / apys.length

    return {
      token: strategy.token.id,
      apy: !isNaN(apy) ? aprToApy(apy, 365) : 0,
      targetPercentage: Number(strategy.token.strategyTargetPercentage ?? 0),
      utilization:
        (Number(strategy.balance / Math.pow(10, strategy.token.decimals)) / Number(strategy.token.rebase.elastic)) *
        100,
    }
  })
}

// @ts-ignore TYPE NEEDS FIXING
export const getBentoTokens = async (chainId = ChainId.ETHEREUM, variables) => {
  const { tokens } = await fetcher(chainId, bentoTokensQuery, variables)

  return tokens
}
