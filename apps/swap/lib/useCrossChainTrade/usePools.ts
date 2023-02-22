import { useQuery } from '@tanstack/react-query'
import { ChainId } from '@sushiswap/chain'
import { getPairs } from './getPairs'
import { getConstantProductPools } from './getConstantProductPools'
import { getStablePools } from './getStablePools'
import { Type } from '@sushiswap/currency'
import { getCurrencyCombinations } from '@sushiswap/router'
import { ConstantProductPool, Pair, StablePool, TradeType } from '@sushiswap/amm'
import { ConstantProductPoolState, PairState, StablePoolState } from '@sushiswap/wagmi'
import { TRIDENT_ENABLED_NETWORKS } from '../../config'

interface UsePoolsParams {
  chainId: ChainId
  currencyA: Type | undefined
  currencyB: Type | undefined
  tradeType?: TradeType
  enabled?: boolean
}

export type UsePoolsReturn = {
  pairs: Pair[] | undefined
  constantProductPools: ConstantProductPool[] | undefined
  stablePools: StablePool[] | undefined
}

const queryFn = async ({ currencyA, currencyB, chainId, tradeType = TradeType.EXACT_INPUT }: UsePoolsParams) => {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT ? [currencyA, currencyB] : [currencyB, currencyA]

  const currencyCombinations =
    currencyIn && currencyOut && chainId ? getCurrencyCombinations(chainId, currencyIn, currencyOut) : []

  const [pairs, constantProductPools, stablePools] = await Promise.all([
    getPairs(chainId, currencyCombinations),
    TRIDENT_ENABLED_NETWORKS.includes(chainId as number) ? getConstantProductPools(chainId, currencyCombinations) : [],
    TRIDENT_ENABLED_NETWORKS.includes(chainId as number) ? getStablePools(chainId, currencyCombinations) : [],
  ])

  return {
    pairs,
    constantProductPools,
    stablePools,
  }
}

export const getPools = async (variables: UsePoolsParams) => {
  if (!variables.currencyA || !variables.currencyB) {
    return {
      pairs: [],
      constantProductPools: [],
      stablePools: [],
    }
  }

  const data = await queryFn(variables)
  return {
    pairs: Object.values(
      data.pairs
        .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
        .map(([, pair]) => pair)
    ),
    constantProductPools: Object.values(
      data.constantProductPools
        .filter((result): result is [ConstantProductPoolState.EXISTS, ConstantProductPool] =>
          Boolean(result[0] === ConstantProductPoolState.EXISTS && result[1])
        )
        .map(([, pair]) => pair)
    ),
    stablePools: Object.values(
      data.stablePools
        .filter((result): result is [StablePoolState.EXISTS, StablePool] =>
          Boolean(result[0] === StablePoolState.EXISTS && result[1])
        )
        .map(([, pair]) => pair)
    ),
  }
}

export const usePools = (variables: UsePoolsParams) => {
  return useQuery({
    queryKey: [
      'NoCache',
      'usePools',
      { chainId: variables.chainId, currencyA: variables.currencyA, currencyB: variables.currencyB },
    ],
    queryFn: async () => await getPools(variables),
    refetchInterval: 10000,
    enabled: Boolean(variables.enabled || true),
  })
}
