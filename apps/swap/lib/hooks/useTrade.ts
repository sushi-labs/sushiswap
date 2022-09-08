import { ChainId } from '@sushiswap/chain'
import { Amount, Token, Type as Currency, useCurrencyCombinations, WNATIVE } from '@sushiswap/currency'
import {
  ConstantProductPool,
  FACTORY_ADDRESS,
  Fee,
  findMultiRouteExactIn,
  findSingleRouteExactIn,
  Pair,
  Trade,
  TradeType,
  Version as TradeVersion,
} from '@sushiswap/exchange'
import { RouteStatus } from '@sushiswap/tines'
import {
  getConstantProductPoolFactoryContract,
  PairState,
  PoolState,
  useBentoBoxTotal,
  useConstantProductPools,
  usePairs,
} from '@sushiswap/wagmi'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useFeeData } from 'wagmi'

type UseTradePayload = {
  chainId: ChainId
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amountSpecified: Amount<Currency> | undefined
  mainCurrency: Currency | undefined
  otherCurrency: Currency | undefined
}

export type UseTradeOutput =
  | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>
  | undefined

type UseTrade = (payload: UseTradePayload) => UseTradeOutput

/**
 * Returns trade for a desired swap.
 * @param chainId
 * @param tradeType whether we request an exact output amount or we provide an exact input amount
 * @param amountSpecified the exact amount to swap in/out
 * @param mainCurrency the desired input/payment currency
 * @param otherCurrency the desired output/payment currency
 */
export const useTrade: UseTrade = ({ chainId, tradeType, amountSpecified, mainCurrency, otherCurrency }) => {
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

  // TODO all fee tiers and twap
  const currencyCombinationsWithFeeAndTwap = useMemo(() => {
    return currencyCombinations.reduce<[Token, Token, Fee, boolean][]>((acc, el) => {
      acc.push([el[0], el[1], Fee.DEFAULT, false])
      return acc
    }, [])
  }, [currencyCombinations])

  // Trident constant product pools
  const constantProductPools = useConstantProductPools(chainId, currencyCombinationsWithFeeAndTwap)

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

  return useMemo(() => {
    if (
      data &&
      data.gasPrice &&
      currencyIn &&
      currencyInRebase &&
      currencyOut &&
      currencyOutRebase &&
      currencyIn.wrapped.address !== currencyOut.wrapped.address &&
      chainId &&
      amountSpecified &&
      amountSpecified.greaterThan(0) &&
      otherCurrency &&
      filteredPools.length > 0
    ) {
      if (tradeType === TradeType.EXACT_INPUT) {
        if (chainId in FACTORY_ADDRESS && getConstantProductPoolFactoryContract(chainId).addressOrName) {
          const legacyRoute = findSingleRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(amountSpecified.quotient.toString()),
            filteredPools.filter((pool): pool is Pair => pool instanceof Pair),
            WNATIVE[amountSpecified.currency.chainId],
            data.gasPrice.toNumber()
          )

          const tridentRoute = findMultiRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(amountSpecified.toShare(currencyInRebase).quotient.toString()),
            filteredPools.filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool),
            WNATIVE[amountSpecified.currency.chainId],
            data.gasPrice.toNumber()
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
          data.gasPrice.toNumber()
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
          data.gasPrice.toNumber()
        )
        if (tridentRoute.status === RouteStatus.Success) {
          return Trade.exactIn(
            tridentRoute,
            amountSpecified,
            currencyOut,
            TradeVersion.V2,
            currencyInRebase,
            currencyOutRebase
          )
        }

        // TODO: Use best trade if both available
      } else if (tradeType === TradeType.EXACT_OUTPUT) {
        //
      }
    }
  }, [
    data,
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
