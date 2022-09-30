import { ChainId } from '@sushiswap/chain'
import { Amount, Type as Currency, useCurrencyCombinations, WNATIVE } from '@sushiswap/currency'
import {
  ConstantProductPool,
  FACTORY_ADDRESS,
  findMultiRouteExactIn,
  findSingleRouteExactIn,
  Pair,
  Trade,
  TradeType,
  Version as TradeVersion,
} from '@sushiswap/exchange'
import { RouteStatus } from '@sushiswap/tines'
import { PairState, PoolState, useBentoBoxTotal, usePairs } from '@sushiswap/wagmi'
import { CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS } from 'config'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useFeeData } from 'wagmi'

import { useConstantProductPools } from './useConstantProductPools'

export type UseTradeOutput =
  | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>
  | undefined

/**
 * Returns trade for a desired swap.
 * @param chainId
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
  const {
    data: feeData,
    isError,
    error,
  } = useFeeData({
    chainId,
  })

  const [currencyIn, currencyOut] = useMemo(
    () => (tradeType === TradeType.EXACT_INPUT ? [mainCurrency, otherCurrency] : [otherCurrency, mainCurrency]),
    [tradeType, mainCurrency, otherCurrency]
  )

  // Generate currency combinations of input and output token based on configured bases
  const currencyCombinations = useCurrencyCombinations(chainId, currencyIn, currencyOut)

  // Legacy SushiSwap pairs
  const { data: pairs } = usePairs(chainId, currencyCombinations)

  // Trident constant product pools
  // const { data: constantProductPools } = useGetAllConstantProductPools(chainId, currencyCombinations)
  const constantProductPools = useConstantProductPools(chainId, currencyCombinations)

  // Combined legacy and trident pools
  const pools = useMemo(() => [...pairs, ...constantProductPools], [pairs, constantProductPools])

  // Filter legacy and trident pools by existance
  const filteredPools = useMemo(
    () =>
      Object.values(
        pools
          // filter out invalid pools
          .filter(
            (result): result is [PairState.EXISTS, Pair] | [PoolState.EXISTS, ConstantProductPool] =>
              Boolean(result[0] === PairState.EXISTS && result[1]) ||
              Boolean(result[0] === PoolState.EXISTS && result[1])
          )
          .map(([, pair]) => pair)
      ),
    [pools]
  )

  const currencyInRebase = useBentoBoxTotal(chainId, currencyIn)
  const currencyOutRebase = useBentoBoxTotal(chainId, currencyOut)

  // console.debug('Found legacy route', [
  //   feeData,
  //   feeData?.gasPrice,
  //   error,
  //   currencyIn,
  //   currencyInRebase,
  //   currencyOut,
  //   currencyOutRebase,
  //   currencyIn?.wrapped.chainId === currencyOut?.wrapped.chainId,
  //   currencyIn?.wrapped.chainId === chainId,
  //   currencyOut?.wrapped.chainId === chainId,
  //   currencyIn?.wrapped.address !== currencyOut?.wrapped.address,
  //   chainId,
  //   amountSpecified,
  //   amountSpecified?.greaterThan(0),
  //   otherCurrency,
  //   filteredPools.length > 0,
  // ])

  return useMemo(() => {
    if (
      feeData &&
      feeData.gasPrice &&
      currencyIn &&
      currencyInRebase &&
      currencyOut &&
      currencyOutRebase &&
      currencyIn.wrapped.chainId === currencyOut.wrapped.chainId &&
      currencyIn.wrapped.chainId === chainId &&
      currencyOut.wrapped.chainId === chainId &&
      currencyIn.wrapped.address !== currencyOut.wrapped.address &&
      chainId &&
      amountSpecified &&
      amountSpecified.greaterThan(0) &&
      otherCurrency &&
      filteredPools.length > 0
    ) {
      if (tradeType === TradeType.EXACT_INPUT) {
        if (chainId in FACTORY_ADDRESS && chainId in CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS) {
          const legacyRoute = findSingleRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(amountSpecified.quotient.toString()),
            filteredPools.filter((pool): pool is Pair => pool instanceof Pair),
            WNATIVE[amountSpecified.currency.chainId],
            feeData.gasPrice.toNumber()
          )

          // console.log([
          //   currencyIn.wrapped,
          //   currencyOut.wrapped,
          //   BigNumber.from(amountSpecified.toShare(currencyInRebase).quotient.toString()).toString(),
          //   filteredPools
          //     .filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool)
          //     .map((pool) => [pool.liquidityToken.address, pool.reserve0.toExact(), pool.reserve1.toExact()]),
          //   WNATIVE[amountSpecified.currency.chainId],
          //   data.gasPrice.toNumber(),
          // ])

          const tridentRoute = findMultiRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(amountSpecified.toShare(currencyInRebase).quotient.toString()),
            filteredPools.filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool),
            WNATIVE[amountSpecified.currency.chainId],
            feeData.gasPrice.toNumber()
          )

          const useLegacy = Amount.fromRawAmount(currencyOut.wrapped, legacyRoute.amountOutBN.toString()).greaterThan(
            Amount.fromShare(currencyOut.wrapped, tridentRoute.amountOutBN.toString(), currencyOutRebase)
          )

          return Trade.exactIn(
            useLegacy ? legacyRoute : tridentRoute,
            amountSpecified,
            currencyOut,
            useLegacy ? TradeVersion.V1 : TradeVersion.V2,
            !useLegacy ? currencyInRebase : undefined,
            !useLegacy ? currencyOutRebase : undefined
          )
        }

        const legacyRoute = findSingleRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          filteredPools.filter((pool): pool is ConstantProductPool => pool instanceof Pair),
          WNATIVE[amountSpecified.currency.chainId],
          feeData.gasPrice.toNumber()
        )

        if (legacyRoute.status === RouteStatus.Success) {
          // console.debug('Found legacy route', legacyRoute)
          return Trade.exactIn(legacyRoute, amountSpecified, currencyOut, TradeVersion.V1)
        } else {
          // console.debug('No legacy route', legacyRoute)
        }

        // TODO: Switch to shares
        const tridentRoute = findMultiRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.toShare(currencyInRebase).quotient.toString()),
          filteredPools.filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool),
          WNATIVE[amountSpecified.currency.chainId],
          feeData.gasPrice.toNumber()
        )
        if (tridentRoute.status === RouteStatus.Success) {
          // console.debug('Found trident route', tridentRoute)
          return Trade.exactIn(
            tridentRoute,
            amountSpecified,
            currencyOut,
            TradeVersion.V2,
            currencyInRebase,
            currencyOutRebase
          )
        } else {
          // console.debug('No trident route', tridentRoute)
        }

        // TODO: Use best trade if both available
      } else if (tradeType === TradeType.EXACT_OUTPUT) {
        //
      }
    }
  }, [
    feeData,
    currencyIn,
    currencyInRebase,
    currencyOut,
    currencyOutRebase,
    chainId,
    amountSpecified,
    otherCurrency,
    filteredPools,
    tradeType,
  ])
}
