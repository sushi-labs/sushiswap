import {
  findMultiRouteExactIn,
  findSingleRouteExactIn,
  SushiSwapV2Pool,
  Trade,
  TradeType,
  TridentConstantPool,
  TridentStablePool,
  Version as TradeVersion,
} from '@sushiswap/amm'
import { BentoBoxChainId, isBentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Amount, Type as Currency, WNATIVE } from '@sushiswap/currency'
import { RouteProcessor3ChainId } from '@sushiswap/route-processor-sdk'
import { RouteStatus } from '@sushiswap/tines'
import {
  TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS,
  TRIDENT_STABLE_POOL_FACTORY_ADDRESS,
  TridentChainId,
} from '@sushiswap/trident-sdk'
import { isSushiSwapV2ChainId, SUSHISWAP_V2_FACTORY_ADDRESS, SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import {
  SushiSwapV2PoolState,
  TridentConstantPoolState,
  TridentStablePoolState,
  useBentoBoxTotal,
  useCurrencyCombinations,
  useFeeData,
  useGetTridentConstantPools,
  useGetTridentStablePools,
  useSushiSwapV2Pools,
} from '@sushiswap/wagmi'
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
  const { data: pairs } = useSushiSwapV2Pools(chainId as SushiSwapV2ChainId, currencyCombinations, {
    enabled: isSushiSwapV2ChainId(chainId),
  })

  // Trident constant product pools
  const { data: constantProductPools } = useGetTridentConstantPools(chainId as BentoBoxChainId, currencyCombinations, {
    enabled: isBentoBoxChainId(chainId),
  })

  // Trident constant product pools
  const { data: stablePools } = useGetTridentStablePools(chainId as BentoBoxChainId, currencyCombinations, {
    enabled: isBentoBoxChainId(chainId),
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
              | [SushiSwapV2PoolState.EXISTS, SushiSwapV2Pool]
              | [TridentConstantPoolState.EXISTS, TridentConstantPool]
              | [TridentStablePoolState.EXISTS, TridentStablePool] =>
              Boolean(result[0] === SushiSwapV2PoolState.EXISTS && result[1]) ||
              Boolean(result[0] === TridentConstantPoolState.EXISTS && result[1]) ||
              Boolean(result[0] === TridentStablePoolState.EXISTS && result[1])
          )
          .map(([, pair]) => pair)
      ),
    [pools]
  )

  const currencyInRebase = useBentoBoxTotal(chainId as BentoBoxChainId, currencyIn, {
    enabled: isBentoBoxChainId(chainId),
  })
  const currencyOutRebase = useBentoBoxTotal(chainId as BentoBoxChainId, currencyOut, {
    enabled: isBentoBoxChainId(chainId),
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
          (chainId in TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS || chainId in TRIDENT_STABLE_POOL_FACTORY_ADDRESS)
        ) {
          const legacyRoute = findSingleRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            amountSpecified.quotient,
            filteredPools.filter((pool): pool is SushiSwapV2Pool => pool instanceof SushiSwapV2Pool),
            WNATIVE[amountSpecified.currency.chainId],
            Number(data.gasPrice)
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
            amountSpecified.toShare(currencyInRebase).quotient,
            [
              ...filteredPools.filter((pool): pool is TridentConstantPool => pool instanceof TridentConstantPool),
              ...filteredPools.filter((pool): pool is TridentStablePool => pool instanceof TridentStablePool),
            ],
            WNATIVE[amountSpecified.currency.chainId],
            Number(data.gasPrice)
          )

          const useLegacy = Amount.fromRawAmount(currencyOut.wrapped, legacyRoute.amountOutBI.toString()).greaterThan(
            Amount.fromShare(currencyOut.wrapped, tridentRoute.amountOutBI.toString(), currencyOutRebase)
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
          amountSpecified.quotient,
          filteredPools.filter((pool): pool is SushiSwapV2Pool => pool instanceof SushiSwapV2Pool),
          WNATIVE[amountSpecified.currency.chainId],
          Number(data.gasPrice)
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
          amountSpecified.toShare(currencyInRebase).quotient,
          [
            ...filteredPools.filter((pool): pool is TridentConstantPool => pool instanceof TridentConstantPool),
            ...filteredPools.filter((pool): pool is TridentStablePool => pool instanceof TridentStablePool),
          ],
          WNATIVE[amountSpecified.currency.chainId],
          Number(data.gasPrice)
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
