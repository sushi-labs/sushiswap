import { SushiSwapV2Pool, TradeType, TridentConstantPool, TridentStablePool } from '@sushiswap/amm'
import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Type } from '@sushiswap/currency'
import { getCurrencyCombinations } from '@sushiswap/router'
import { BridgeBento, UniV3Pool } from '@sushiswap/tines'
import { isTridentConstantPoolFactoryChainId, isTridentStablePoolFactoryChainId } from '@sushiswap/trident-sdk'
import { isSushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { isSushiSwapV3ChainId } from '@sushiswap/v3-sdk'

import { getBentoboxTotalsMap } from '../../bentobox'
import { UsePoolsParams, UsePoolsReturn } from '../types'
import { BridgeBentoState, getBridgeBentoPools } from './getBridgeBentoPools'
import { getSushiSwapV2Pools, PairState } from './getSushiSwapV2Pools'
import { getTridentConstantPools, TridentConstantPoolState } from './getTridentConstantPools'
import { getTridentStablePools, TridentStablePoolState } from './getTridentStablePools'
import { getV3Pools, V3PoolState } from './getV3Pools'
import { pairsUnique, tokensUnique } from './utils'

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
    isSushiSwapV2ChainId(chainId) ? getSushiSwapV2Pools(chainId, currencyCombinations) : Promise.resolve([]),
    isTridentConstantPoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId)
      ? getTridentConstantPools(chainId, currencyCombinations)
      : Promise.resolve([]),
    isTridentStablePoolFactoryChainId(chainId) && isBentoBoxV1ChainId(chainId) && totalsMap
      ? getTridentStablePools(chainId, currencyCombinations, totalsMap)
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
      sushiSwapV2Pools: [],
      tridentConstantPools: [],
      tridentStablePools: [],
      bridgeBentoPools: [],
      sushiSwapV3Pools: [],
    }
  }
  const data = await queryFn(variables)
  return {
    sushiSwapV2Pools: Object.values(
      data.pairs
        .filter((result): result is [PairState.EXISTS, SushiSwapV2Pool] =>
          Boolean(result[0] === PairState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as SushiSwapV2Pool)
    ),
    tridentConstantPools: Object.values(
      data.constantProductPools
        .filter((result): result is [TridentConstantPoolState.EXISTS, TridentConstantPool] =>
          Boolean(result[0] === TridentConstantPoolState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as TridentConstantPool)
    ),
    tridentStablePools: Object.values(
      data.stablePools
        .filter((result): result is [TridentStablePoolState.EXISTS, TridentStablePool] =>
          Boolean(result[0] === TridentStablePoolState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as TridentStablePool)
    ),
    bridgeBentoPools: Object.values(
      data.bridgeBentoPools
        .filter((result): result is [BridgeBentoState.EXISTS, BridgeBento] =>
          Boolean(result[0] === BridgeBentoState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as BridgeBento)
    ),
    sushiSwapV3Pools: Object.values(
      data.v3Pools
        .filter((result): result is [V3PoolState.EXISTS, UniV3Pool] =>
          Boolean(result[0] === V3PoolState.EXISTS && result[1])
        )
        .map(([, pair]) => pair as UniV3Pool)
    ),
  }
}
