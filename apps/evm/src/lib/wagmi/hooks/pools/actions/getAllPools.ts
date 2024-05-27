import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/config'
import { Type } from 'sushi/currency'
import { TradeType } from 'sushi/dex'
import { SushiSwapV2Pool } from 'sushi/pool'
import { getCurrencyCombinations } from 'sushi/router'
import { UniV3Pool } from 'sushi/tines'
import { UsePoolsParams, UsePoolsReturn } from '../types'
import { PairState, getSushiSwapV2Pools } from './getSushiSwapV2Pools'
import { V3PoolState, getV3Pools } from './getV3Pools'

const queryFn = async ({
  chainId,
  currencyA,
  currencyB,
  tradeType = TradeType.EXACT_INPUT,
  withCombinations = true,
  config,
}: UsePoolsParams) => {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT
      ? [currencyA, currencyB]
      : [currencyB, currencyA]

  let currencyCombinations: [Type | undefined, Type | undefined][] = [
    [currencyIn, currencyOut],
  ]
  if (withCombinations && currencyIn && currencyOut && chainId) {
    currencyCombinations = getCurrencyCombinations(
      chainId,
      currencyIn,
      currencyOut,
    )
  }

  // let v3CurrencyCombinations: [Type | undefined, Type | undefined][] = [[currencyIn, currencyOut]]
  // if (withCombinations && currencyIn && currencyOut && chainId) {
  //   v3CurrencyCombinations = getV3CurrencyCombinations(chainId, currencyIn, currencyOut)
  // }

  const [pairs, v3Pools] = await Promise.all([
    isSushiSwapV2ChainId(chainId)
      ? getSushiSwapV2Pools(chainId, currencyCombinations, config)
      : Promise.resolve([]),
    isSushiSwapV3ChainId(chainId)
      ? getV3Pools(chainId, currencyCombinations, config)
      : Promise.resolve([]),
  ])
  // const filteredCurrencyCombinations = currencyCombinations.filter(([a, b]) =>  a === currencyA || b === currencyA || a === currencyB || b === currencyB)
  // const v3Pools = await getV3Pools(chainId, v3CurrencyCombinations)

  return {
    pairs,
    v3Pools,
  }
}

export const getAllPools = async (
  variables: Omit<UsePoolsParams, 'enabled'> & { asMap?: boolean },
): Promise<UsePoolsReturn> => {
  if (!variables.currencyA || !variables.currencyB) {
    return {
      sushiSwapV2Pools: [],
      sushiSwapV3Pools: [],
    }
  }
  const data = await queryFn(variables)
  return {
    sushiSwapV2Pools: Object.values(
      data.pairs
        .filter((result): result is [PairState.EXISTS, SushiSwapV2Pool] =>
          Boolean(result[0] === PairState.EXISTS && result[1]),
        )
        .map(([, pair]) => pair as SushiSwapV2Pool),
    ),
    sushiSwapV3Pools: Object.values(
      data.v3Pools
        .filter((result): result is [V3PoolState.EXISTS, UniV3Pool] =>
          Boolean(result[0] === V3PoolState.EXISTS && result[1]),
        )
        .map(([, pair]) => pair as UniV3Pool),
    ),
  }
}
