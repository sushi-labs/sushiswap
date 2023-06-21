import { ConstantProductPool, StablePool, TradeType, Pair } from '@sushiswap/amm'
import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { isSushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { getCurrencyCombinations } from '@sushiswap/router'
import { ConstantProductPoolState, getConstantProductPools } from './getConstantProductPools'
import { getStablePools, StablePoolState } from './getStablePools'
import { UsePoolsParams, UsePoolsReturn } from '../types'
import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident-core'
import { getPairs, PairState } from './getPairs'
import { getBentoboxTotalsMap } from '../../bentobox'
import { pairsUnique, tokensUnique } from './utils'
import { BridgeBento, UniV3Pool } from '@sushiswap/tines'
import { BridgeBentoState, getBridgeBentoPools } from './getBridgeBentoPools'
import { Type } from '@sushiswap/currency'
import { getV3Pools, V3PoolState } from './getV3Pools'
import { isSushiSwapV3ChainId } from '@sushiswap/v3-sdk'

const queryFn = async ({
  chainId,
  currencyA,
  currencyB,
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

  // let v3CurrencyCombinations: [Type | undefined, Type | undefined][] = [[currencyIn, currencyOut]]
  // if (withCombinations && currencyIn && currencyOut && chainId) {
  //   v3CurrencyCombinations = getV3CurrencyCombinations(chainId, currencyIn, currencyOut)
  // }

  const _tokensUnique = tokensUnique(pairsUnique(currencyCombinations))
  const totalsMap = isBentoBoxV1ChainId(chainId) ? await getBentoboxTotalsMap(chainId, _tokensUnique) : null

  const [pairs, constantProductPools, stablePools, bridgeBentoPools, v3Pools] = await Promise.all([
    isSushiSwapV2ChainId(chainId) ? getPairs(chainId, currencyCombinations) : Promise.resolve([]),
    isConstantProductPoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId)
      ? getConstantProductPools(chainId, currencyCombinations)
      : Promise.resolve([]),
    isStablePoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId) && totalsMap
      ? getStablePools(chainId, currencyCombinations, totalsMap)
      : Promise.resolve([]),
    isBentoBoxV1ChainId(chainId) && withBentoPools && totalsMap
      ? getBridgeBentoPools(chainId, _tokensUnique, totalsMap)
      : Promise.resolve([]),
    isSushiSwapV3ChainId(chainId) ? getV3Pools(chainId, currencyCombinations) : Promise.resolve([]),
  ])
  // const filteredCurrencyCombinations = currencyCombinations.filter(([a, b]) =>  a === currencyA || b === currencyA || a === currencyB || b === currencyB)
  // const v3Pools = await getV3Pools(chainId, v3CurrencyCombinations)

  return {
    pairs,
    constantProductPools,
    stablePools,
    bridgeBentoPools,
    v3Pools,
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
      v3Pools: [],
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
    v3Pools: Object.values(
      data.v3Pools
        .filter((result): result is [V3PoolState.EXISTS, UniV3Pool] =>
          Boolean(result[0] === V3PoolState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as UniV3Pool)
    ),
  }
}
