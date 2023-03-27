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
import { BridgeBento, CLRPool, UniV3Pool } from '@sushiswap/tines'
import { BridgeBentoState, getBridgeBentoPools } from './getBridgeBentoPools'
import { Type } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { getV3Pools, V3PoolState } from './getV3Pools'

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
  // const _totals = isBentoBoxV1ChainId(chainId) ? await getBentoboxTotals(chainId, _tokensUnique) : null

  // const totalsMap: Map<
  //   string,
  //   {
  //     elastic: BigNumber
  //     base: BigNumber
  //   }
  // > = new Map()
  // _totals?.forEach((total, index) => {
  //   totalsMap.set(_tokensUnique[index].wrapped.address, total)
  // })
  
  // const [pairs, constantProductPools, stablePools, bridgeBentoPools] = await Promise.all([
  //   isUniswapV2Router02ChainId(chainId) ? getPairs(chainId, currencyCombinations) : Promise.resolve([]),
  //   isConstantProductPoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId)
  //     ? getConstantProductPools(chainId, currencyCombinations)
  //     : Promise.resolve([]),
  //   isStablePoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId)
  //     ? getStablePools(chainId, currencyCombinations, totalsMap)
  //     : Promise.resolve([]),
  //   isBentoBoxV1ChainId(chainId) && withBentoPools
  //     ? getBridgeBentoPools(chainId, _tokensUnique, totalsMap)
  //     : Promise.resolve([]),
  // ])
  // const filteredCurrencyCombinations = currencyCombinations.filter(([a, b]) =>  a === currencyA || b === currencyA || a === currencyB || b === currencyB)
  const v3Pools = await getV3Pools(chainId, currencyCombinations)
  console.log({v3Pools})

  return {
    // pairs,
    // constantProductPools,
    // stablePools,
    // bridgeBentoPools,
    pairs: [] as Pair[],
    constantProductPools: [] as ConstantProductPool[],
    stablePools: [] as StablePool[],
    bridgeBentoPools: [] as BridgeBento[],
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
    // pairs: Object.values(
    //   data.pairs
    //     .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
    //     .map(([, pair]) => pair as Pair)
    // ),
    // constantProductPools: Object.values(
    //   data.constantProductPools
    //     .filter((result): result is [ConstantProductPoolState.EXISTS, ConstantProductPool] =>
    //       Boolean(result[0] === ConstantProductPoolState.EXISTS && result[1])
    //     )
    //     .map(([, pair]) => pair as ConstantProductPool)
    // ),
    // stablePools: Object.values(
    //   data.stablePools
    //     .filter((result): result is [StablePoolState.EXISTS, StablePool] =>
    //       Boolean(result[0] === StablePoolState.EXISTS && result[1])
    //     )
    //     .map(([, pair]) => pair as StablePool)
    // ),
    // bridgeBentoPools: Object.values(
    //   data.bridgeBentoPools
    //     .filter((result): result is [BridgeBentoState.EXISTS, BridgeBento] =>
    //       Boolean(result[0] === BridgeBentoState.EXISTS && result[1])
    //     )
    //     .map(([, pair]) => pair as BridgeBento)
    // ),
    pairs: [],
    constantProductPools: [],
    stablePools: [],
    bridgeBentoPools: [],
    v3Pools: Object.values(
      data.v3Pools
        .filter((result): result is [V3PoolState.EXISTS, UniV3Pool] =>
          Boolean(result[0] === V3PoolState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as UniV3Pool)
    ),
  }
}
