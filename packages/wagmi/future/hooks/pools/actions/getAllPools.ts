import { ConstantProductPool, Pair, StablePool, TradeType } from '@sushiswap/amm'
import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { isUniswapV2Router02ChainId } from '@sushiswap/sushiswap'
import { getCurrencyCombinations } from '@sushiswap/router'
import { ConstantProductPoolState, getConstantProductPools } from './getConstantProductPools'
import { getStablePools, StablePoolState } from './getStablePools'
import { UsePoolsParams, UsePoolsReturn } from '../types'
import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident'
import { getPairs, PairState } from './getPairs'
import { getBentoboxTotals } from '../../bentobox'
import { pairsUnique, tokensUnique } from './utils'
import { BridgeBento } from '@sushiswap/tines'
import { BridgeBentoState, getBridgeBentoPools } from './getBridgeBentoPools'
import { Type } from '@sushiswap/currency'

const queryFn = async ({
  currencyA,
  currencyB,
  chainId,
  tradeType = TradeType.EXACT_INPUT,
  withBentoPools = false,
  withCombinations = true,
}: UsePoolsParams) => {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT ? [currencyA, currencyB] : [currencyB, currencyA]

  let currencyCombinations: [Type | undefined, Type | undefined][] = [[currencyIn, currencyOut]]
  if (withCombinations && currencyIn && currencyOut && chainId) {
    currencyCombinations = getCurrencyCombinations(chainId, currencyIn, currencyOut)
  }

  const _tokensUnique = tokensUnique(pairsUnique(currencyCombinations))
  const totals = isBentoBoxV1ChainId(chainId) ? await getBentoboxTotals(chainId, _tokensUnique) : null

  const [pairs, constantProductPools, stablePools, bridgeBentoPools] = await Promise.all([
    isUniswapV2Router02ChainId(chainId) ? getPairs(chainId, currencyCombinations) : Promise.resolve([]),
    isConstantProductPoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId)
      ? getConstantProductPools(chainId, currencyCombinations)
      : Promise.resolve([]),
    isStablePoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId)
      ? getStablePools(chainId, currencyCombinations, totals)
      : Promise.resolve([]),
    isBentoBoxV1ChainId(chainId) && withBentoPools
      ? getBridgeBentoPools(chainId, _tokensUnique, totals)
      : Promise.resolve([]),
  ])

  return {
    pairs,
    constantProductPools,
    stablePools,
    bridgeBentoPools,
  }
}

export const getAllPools = async (
  variables: Omit<UsePoolsParams, 'enabled'> & { asMap?: boolean }
): Promise<UsePoolsReturn> => {
  if (!variables.currencyA || !variables.currencyB) {
    return {
      pairs: [],
      constantProductPools: [],
      stablePools: [],
      bridgeBentoPools: [],
    }
  }

  const data = await queryFn(variables)

  return {
    pairs: Object.values(
      data.pairs
        .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
        .map(([, pair]) => pair as Pair)
    ),
    constantProductPools: Object.values(
      data.constantProductPools
        .filter((result): result is [ConstantProductPoolState.EXISTS, ConstantProductPool] =>
          Boolean(result[0] === ConstantProductPoolState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as ConstantProductPool)
    ),
    stablePools: Object.values(
      data.stablePools
        .filter((result): result is [StablePoolState.EXISTS, StablePool] =>
          Boolean(result[0] === StablePoolState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as StablePool)
    ),
    bridgeBentoPools: Object.values(
      data.bridgeBentoPools
        .filter((result): result is [BridgeBentoState.EXISTS, BridgeBento] =>
          Boolean(result[0] === BridgeBentoState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as BridgeBento)
    ),
  }
}
