import { ChainId } from '@sushiswap/chain'
import { Amount, Type as Currency, useCurrencyCombinations, WNATIVE } from '@sushiswap/currency'
import {
  ConstantProductPool,
  convertTinesSingleRouteToRouteV1,
  findMultiRouteExactIn,
  findSingleRouteExactIn,
  Pair,
  TradeV1,
  TradeV2,
  Type as TradeType,
} from '@sushiswap/exchange'
import { RouteStatus } from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'

import { PoolState, useGetAllExistedPools } from './useConstantProductPools'
import { PairState, usePairs } from './usePairs'

export type UseTradeOutput =
  | TradeV1<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
  | TradeV2<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
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
  // const { data: feeData } = useFeeData({
  //   chainId,
  // })
  // console.log('fee data', feeData)

  const data = useMemo(
    () => ({
      gasPrice: BigNumber.from(1000000),
      // gasPrice: parseUnits('1', 'wei'),
    }),
    []
  )

  const [currencyIn, currencyOut] = useMemo(
    () => (tradeType === TradeType.EXACT_INPUT ? [mainCurrency, otherCurrency] : [otherCurrency, mainCurrency]),
    [tradeType, mainCurrency, otherCurrency]
  )

  const currencyCombinations = useCurrencyCombinations(chainId, currencyIn, currencyOut)

  const pairs = usePairs(chainId, currencyCombinations)

  // console.log('USE TRADE', chainId, pairs)

  const constantProductPools = useGetAllExistedPools(chainId, currencyCombinations)

  // const constantProductPools = useConstantProductPools(chainId, currencyCombinations)

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

  const pools = useMemo(() => [...pairs, ...constantProductPools], [pairs, constantProductPools])

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
          return TradeV2.bestTradeExactIn(tridentRoute, amountSpecified, currencyOut)
        } else {
          console.debug('No trident route', tridentRoute)
        }

        const legacyRoute = findSingleRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          filteredPools,
          WNATIVE[amountSpecified.currency.chainId],
          data.gasPrice.toNumber()
        )

        if (legacyRoute.status === RouteStatus.Success) {
          console.debug('Found legacy route', legacyRoute)
          try {
            return TradeV1.exactIn(
              convertTinesSingleRouteToRouteV1(
                legacyRoute,
                filteredPools.filter((pair) => pair instanceof Pair) as Pair[],
                currencyIn,
                currencyOut
              ),
              amountSpecified
            )
          } catch (error) {
            console.debug('error converting tines single route to legacy route')
          }
        } else {
          console.debug('No legacy route', legacyRoute)
        }
      } else if (tradeType === TradeType.EXACT_OUTPUT) {
        //
      }
    }
  }, [data, currencyIn, currencyOut, chainId, amountSpecified, otherCurrency, filteredPools, tradeType])
}
