import { ConstantProductPool, Pair, StablePool, TradeType } from '@sushiswap/amm'
import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { isUniswapV2Router02ChainId } from '@sushiswap/sushiswap'
import { getCurrencyCombinations } from '@sushiswap/router'
import { ConstantProductPoolState, getConstantProductPools } from './getConstantProductPools'
import { getStablePools, StablePoolState } from './getStablePools'
import { UsePoolsParams, UsePoolsReturn } from '../types'
import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident'
import { getPairs, PairState } from './getPairs'

const queryFn = async ({
  currencyA,
  currencyB,
  chainId,
  tradeType = TradeType.EXACT_INPUT,
  asRPool,
}: UsePoolsParams) => {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT ? [currencyA, currencyB] : [currencyB, currencyA]

  const currencyCombinations =
    currencyIn && currencyOut && chainId ? getCurrencyCombinations(chainId, currencyIn, currencyOut) : []

  const [pairs, constantProductPools, stablePools] = await Promise.all([
    isUniswapV2Router02ChainId(chainId) ? getPairs(chainId, currencyCombinations, asRPool) : Promise.resolve([]),
    isConstantProductPoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId)
      ? getConstantProductPools(chainId, currencyCombinations)
      : Promise.resolve([]),
    isStablePoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId)
      ? getStablePools(chainId, currencyCombinations)
      : Promise.resolve([]),
  ])

  return {
    pairs,
    constantProductPools,
    stablePools,
  }
}

export const getAllPools = async (variables: Omit<UsePoolsParams, 'enabled'>): Promise<UsePoolsReturn> => {
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
