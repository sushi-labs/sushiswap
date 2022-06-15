import { ChainId } from '@sushiswap/chain'
import { Amount, Type as Currency, useCurrencyCombinations, WNATIVE } from '@sushiswap/currency'
import {
  ConstantProductPool,
  findMultiRouteExactIn,
  findSingleRouteExactIn,
  Pair,
  Trade,
  TradeType,
  Version as TradeVersion,
} from '@sushiswap/exchange'
import { RouteStatus } from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useFeeData } from 'wagmi'

import { PoolState, useConstantProductPools } from './useConstantProductPools'
import { PairState, usePairs } from './usePairs'

export type UseTradeOutput =
  | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>
  | undefined

/**
 * Returns trade for a desired swap.
 * @param tradeType whether we request an exact output amount or we provide an exact input amount
 * @param amountSpecified the exact amount to swap in/out
 * @param mainCurrency the desired input/payment currency
 * @param otherCurrency the desired output/payment currency
 */
export function useTrade(
  chainId: ChainId,
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT,
  amountSpecified?: Amount<Currency>,
  mainCurrency?: Currency,
  otherCurrency?: Currency
): UseTradeOutput {
  const { data } = useFeeData({
    chainId,
  })

  const [currencyIn, currencyOut] = useMemo(
    () => (tradeType === TradeType.EXACT_INPUT ? [mainCurrency, otherCurrency] : [otherCurrency, mainCurrency]),
    [tradeType, mainCurrency, otherCurrency]
  )

  // Generate currency combinations of input and output token based on configured bases
  const currencyCombinations = useCurrencyCombinations(chainId, currencyIn, currencyOut)

  // Legacy SushiSwap pairs
  const pairs = usePairs(chainId, currencyCombinations)

  // Trident constant product pools
  const constantProductPools = useConstantProductPools(chainId, currencyCombinations)

  // const filteredPairs = useMemo(
  //   () =>
  //     Object.values(
  //       pairs
  //         // filter out invalid pairs
  //         .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
  //         .map(([, pair]) => pair),
  //     ),
  //   [pairs],
  // )

  // console.log('filteredPairs', filteredPairs, pairs)

  // Combined legacy and trident pools
  const pools = useMemo(() => [...pairs, ...constantProductPools], [pairs, constantProductPools])

  // Filter legacy and trident pools by existance
  const filteredPools = useMemo(
    () => [
      ...Object.values(
        pools.reduce<(ConstantProductPool | Pair)[]>((acc, result) => {
          if (!Array.isArray(result) && result.state === PoolState.EXISTS && result.pool) {
            acc.push(result.pool)
          }

          if (Array.isArray(result) && result[0] === PairState.EXISTS && result[1]) {
            acc.push(result[1])
          }

          return acc
        }, [])
      ),
    ],
    [pools]
  )

  return useMemo(() => {
    if (
      data &&
      data.gasPrice &&
      currencyIn &&
      currencyOut &&
      currencyIn.wrapped.address !== currencyOut.wrapped.address &&
      chainId &&
      amountSpecified &&
      amountSpecified.greaterThan(0) &&
      otherCurrency &&
      filteredPools.length > 0
    ) {
      if (tradeType === TradeType.EXACT_INPUT) {
        const legacyRoute = findSingleRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          filteredPools.filter((pool) => pool instanceof Pair) as Pair[],
          WNATIVE[amountSpecified.currency.chainId],
          data.gasPrice.toNumber()
        )

        if (legacyRoute.status === RouteStatus.Success) {
          console.debug('Found legacy route', legacyRoute)
          return Trade.exactIn(legacyRoute, amountSpecified, currencyOut, TradeVersion.V1)
        } else {
          console.debug('No legacy route', legacyRoute)
        }

        // TODO: Switch to shares
        const tridentRoute = findMultiRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          filteredPools.filter((pool) => pool instanceof ConstantProductPool) as ConstantProductPool[],
          WNATIVE[amountSpecified.currency.chainId],
          data.gasPrice.toNumber()
        )
        if (tridentRoute.status === RouteStatus.Success) {
          console.debug('Found trident route', tridentRoute)
          return Trade.exactIn(tridentRoute, amountSpecified, currencyOut, TradeVersion.V2)
        } else {
          console.debug('No trident route', tridentRoute)
        }

        // TODO: Use best trade if both available
      } else if (tradeType === TradeType.EXACT_OUTPUT) {
        //
      }
    }
  }, [data, currencyIn, currencyOut, chainId, amountSpecified, otherCurrency, filteredPools, tradeType])
}
