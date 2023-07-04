import {
  ConstantProductPool,
  findMultiRouteExactIn,
  findSingleRouteExactIn,
  Pair,
  StablePool,
  Trade,
  TradeType,
  Version as TradeVersion,
} from '@sushiswap/amm'
import { BentoBoxV1ChainId, isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Amount, Type as Currency, WNATIVE } from '@sushiswap/currency'
import { RouteProcessor3ChainId } from '@sushiswap/route-processor'
import { RouteStatus } from '@sushiswap/tines'
import {
  CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS,
  STABLE_POOL_FACTORY_ADDRESS,
  TridentChainId,
} from '@sushiswap/trident-sdk'
import { isSushiSwapV2ChainId, SUSHISWAP_V2_FACTORY_ADDRESS, SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import {
  ConstantProductPoolState,
  PairState,
  StablePoolState,
  useBentoBoxTotal,
  useCurrencyCombinations,
  useFeeData,
  useGetConstantProductPools,
  useGetStablePools,
  usePairs,
} from '@sushiswap/wagmi'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'

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
  chainId: SushiSwapV2ChainId | TridentChainId | RouteProcessor3ChainId,
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
  const { data: pairs } = usePairs(chainId as SushiSwapV2ChainId, currencyCombinations, {
    enabled: isSushiSwapV2ChainId(chainId),
  })

  // Trident constant product pools
  const { data: constantProductPools } = useGetConstantProductPools(
    chainId as BentoBoxV1ChainId,
    currencyCombinations,
    { enabled: isBentoBoxV1ChainId(chainId) }
  )

  // Trident constant product pools
  const { data: stablePools } = useGetStablePools(chainId as BentoBoxV1ChainId, currencyCombinations, {
    enabled: isBentoBoxV1ChainId(chainId),
  })

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

  const currencyInRebase = useBentoBoxTotal(chainId as BentoBoxV1ChainId, currencyIn, {
    enabled: isBentoBoxV1ChainId(chainId),
  })
  const currencyOutRebase = useBentoBoxTotal(chainId as BentoBoxV1ChainId, currencyOut, {
    enabled: isBentoBoxV1ChainId(chainId),
  })

  return useMemo(() => {
    if (
      data?.gasPrice &&
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
        if (
          chainId in SUSHISWAP_V2_FACTORY_ADDRESS &&
          (chainId in CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS || chainId in STABLE_POOL_FACTORY_ADDRESS)
        ) {
          const legacyRoute = findSingleRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(amountSpecified.quotient.toString()),
            filteredPools.filter((pool): pool is Pair => pool instanceof Pair),
            WNATIVE[amountSpecified.currency.chainId],
            data.gasPrice.toNumber()
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
            [
              ...filteredPools.filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool),
              ...filteredPools.filter((pool): pool is StablePool => pool instanceof StablePool),
            ],
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
          filteredPools.filter((pool): pool is Pair => pool instanceof Pair),
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
          BigNumber.from(amountSpecified.toShare(currencyInRebase).quotient.toString()),
          [
            ...filteredPools.filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool),
            ...filteredPools.filter((pool): pool is StablePool => pool instanceof StablePool),
          ],
          WNATIVE[amountSpecified.currency.chainId],
          data.gasPrice.toNumber()
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
