import {
  ConstantProductPool,
  FACTORY_ADDRESS,
  findMultiRouteExactIn,
  findSingleRouteExactIn,
  Pair,
  StablePool,
  Trade,
  TradeType,
  Version as TradeVersion,
} from '@sushiswap/amm'
import { Amount, Type as Currency, useCurrencyCombinations, WNATIVE } from '@sushiswap/currency'
import { MultiRoute, RouteStatus } from '@sushiswap/tines'
import { PairState, useBentoBoxTotals, useGetConstantProductPools, useGetStablePools, usePairs } from '@sushiswap/wagmi'
import {
  AMM_ENABLED_NETWORKS,
  CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS,
  STABLE_POOL_FACTORY_ADDRESS,
  TRIDENT_ENABLED_NETWORKS,
} from 'config'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useFeeData } from 'wagmi'

import { ConstantProductPoolState } from './useConstantProductPools'
import { StablePoolState } from './useStablePools'

export type UseTradeOutput = {
  trade:
    | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>
    | undefined
  route: MultiRoute | undefined
}

/**
 * Returns trade for a desired swap.
 * @param chainId
 * @param tradeType whether we request an exact output amount or we provide an exact input amount
 * @param amountSpecified the exact amount to swap in/out
 * @param mainCurrency the desired input/payment currency
 * @param otherCurrency the desired output/payment currency
 */
export function useTrade(
  chainId: number | undefined,
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT,
  amountSpecified?: Amount<Currency>,
  mainCurrency?: Currency,
  otherCurrency?: Currency
): UseTradeOutput {
  const { data: feeData } = useFeeData({
    chainId,
  })

  const [currencyIn, currencyOut] = useMemo(
    () => (tradeType === TradeType.EXACT_INPUT ? [mainCurrency, otherCurrency] : [otherCurrency, mainCurrency]),
    [tradeType, mainCurrency, otherCurrency]
  )

  // Generate currency combinations of input and output token based on configured bases
  const currencyCombinations = useCurrencyCombinations(chainId, currencyIn, currencyOut)

  // Legacy SushiSwap pairs
  const { data: pairs } = usePairs(chainId, currencyCombinations, {
    enabled: Boolean(chainId && AMM_ENABLED_NETWORKS.includes(chainId)),
  })

  // Trident constant product pools
  const { data: constantProductPools } = useGetConstantProductPools(chainId, currencyCombinations)
  const { data: stablePools } = useGetStablePools(chainId, currencyCombinations)

  // Combined legacy and trident pools
  const pools = useMemo(
    () => [...pairs, ...constantProductPools, ...stablePools],
    [pairs, constantProductPools, stablePools]
  )

  // Filter legacy and trident pools by existance
  const filteredPools = useMemo(
    () =>
      Object.values(
        pools
          // filter out invalid pools
          .filter(
            (
              result
            ): result is
              | [PairState.EXISTS, Pair]
              | [ConstantProductPoolState.EXISTS, ConstantProductPool]
              | [StablePoolState.EXISTS, StablePool] =>
              Boolean(result[0] === PairState.EXISTS && result[1]) ||
              Boolean(result[0] === ConstantProductPoolState.EXISTS && result[1]) ||
              Boolean(result[0] === StablePoolState.EXISTS && result[1])
          )
          .map(([, pair]) => pair)
      ),
    [pools]
  )

  // console.log(
  //   filteredPools.reduce<any[]>((previousValue, currentValue) => {
  //     if (currentValue.token0.wrapped.address === '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1') {
  //       delete currentValue.token0['list']
  //       previousValue.push(currentValue)
  //     }
  //     if (currentValue.token1.wrapped.address === '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1') {
  //       delete currentValue.token1['list']
  //       previousValue.push(currentValue.token1)
  //     }
  //     return previousValue
  //   }, [])
  // )

  const totals = useBentoBoxTotals(
    chainId,
    useMemo(() => [currencyIn, currencyOut], [currencyIn, currencyOut])
  )

  // console.log([
  //   feeData,
  //   feeData && feeData.gasPrice,
  //   currencyIn,
  //   currencyOut,
  //   currencyIn && currencyOut && currencyIn.wrapped.chainId === currencyOut.wrapped.chainId,
  //   currencyIn && currencyIn.wrapped.chainId === chainId,
  //   currencyOut && currencyOut.wrapped.chainId === chainId,
  //   currencyIn && currencyOut && currencyIn.wrapped.address !== currencyOut.wrapped.address,
  //   chainId,
  //   amountSpecified,
  //   amountSpecified && amountSpecified.greaterThan(0),
  //   otherCurrency,
  //   filteredPools.length > 0,
  //   filteredPools,
  // ])

  return useMemo(() => {
    if (
      feeData &&
      feeData.gasPrice &&
      currencyIn &&
      currencyOut &&
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
        if (
          chainId in FACTORY_ADDRESS &&
          (chainId in CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS || chainId in STABLE_POOL_FACTORY_ADDRESS) &&
          TRIDENT_ENABLED_NETWORKS.includes(chainId) &&
          totals &&
          currencyIn.wrapped.address in totals &&
          currencyOut.wrapped.address in totals
        ) {
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
            BigNumber.from(amountSpecified.toShare(totals[currencyIn.wrapped.address]).quotient.toString()),
            [
              ...filteredPools.filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool),
              ...filteredPools.filter((pool): pool is StablePool => pool instanceof StablePool),
            ],
            WNATIVE[amountSpecified.currency.chainId],
            feeData.gasPrice.toNumber()
          )

          const useLegacy = Amount.fromRawAmount(currencyOut.wrapped, legacyRoute.amountOutBN.toString()).greaterThan(
            Amount.fromShare(
              currencyOut.wrapped,
              tridentRoute.amountOutBN.toString(),
              totals[currencyOut.wrapped.address]
            )
          )

          return {
            trade: Trade.exactIn(
              useLegacy ? legacyRoute : tridentRoute,
              amountSpecified,
              currencyOut,
              useLegacy ? TradeVersion.V1 : TradeVersion.V2,
              !useLegacy ? totals[currencyIn.wrapped.address] : undefined,
              !useLegacy ? totals[currencyOut.wrapped.address] : undefined
            ),
            route: useLegacy ? legacyRoute : tridentRoute,
          }
        }

        if (AMM_ENABLED_NETWORKS.includes(chainId)) {
          // console.debug('Legacy route input', [
          //   currencyIn.wrapped,
          //   currencyOut.wrapped,
          //   BigNumber.from(amountSpecified.quotient.toString()),
          //   filteredPools
          //     .filter((pool): pool is Pair => pool instanceof Pair)
          //     .map((pool) => ({
          //       address: pool.liquidityToken.address,
          //       name: `${pool.token0.wrapped.symbol}/${pool.token1.wrapped.symbol}`,
          //       reserve0: pool.reserve0.toExact(),
          //       reserve1: pool.reserve0.toExact(),
          //     })),
          //   WNATIVE[amountSpecified.currency.chainId],
          //   feeData.gasPrice.toNumber(),
          // ])
          const legacyRoute = findSingleRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(amountSpecified.quotient.toString()),
            filteredPools.filter((pool): pool is Pair => pool instanceof Pair),
            WNATIVE[amountSpecified.currency.chainId],
            feeData.gasPrice.toNumber()
          )

          if (legacyRoute.status === RouteStatus.Success) {
            console.debug('Found legacy route', legacyRoute)
            return {
              trade: Trade.exactIn(legacyRoute, amountSpecified, currencyOut, TradeVersion.V1),
              route: legacyRoute,
            }
          } else {
            console.debug('No legacy route', legacyRoute)
          }
        }

        if (
          TRIDENT_ENABLED_NETWORKS.includes(chainId) &&
          totals &&
          currencyIn.wrapped.address in totals &&
          currencyOut.wrapped.address in totals
        ) {
          const tridentRoute = findMultiRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(amountSpecified.toShare(totals[currencyIn.wrapped.address]).quotient.toString()),
            [
              ...filteredPools.filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool),
              ...filteredPools.filter((pool): pool is StablePool => pool instanceof StablePool),
            ],
            WNATIVE[amountSpecified.currency.chainId],
            feeData.gasPrice.toNumber()
          )
          if (tridentRoute.status === RouteStatus.Success) {
            console.debug('Found trident route', tridentRoute)
            return {
              trade: Trade.exactIn(
                tridentRoute,
                amountSpecified,
                currencyOut,
                TradeVersion.V2,
                totals[currencyIn.wrapped.address],
                totals[currencyOut.wrapped.address]
              ),
              route: tridentRoute,
            }
          } else {
            console.debug('No trident route', tridentRoute)
          }
        }

        // TODO: Use best trade if both available
      } else if (tradeType === TradeType.EXACT_OUTPUT) {
        //
      }
    }

    return {
      trade: undefined,
      route: undefined,
    }
  }, [amountSpecified, chainId, currencyIn, currencyOut, feeData, filteredPools, otherCurrency, totals, tradeType])
}
