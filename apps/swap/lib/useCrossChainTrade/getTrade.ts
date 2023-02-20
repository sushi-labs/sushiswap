import { ChainId } from '@sushiswap/chain'
import { Amount, Type as Currency, Type, WNATIVE } from '@sushiswap/currency'
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
import { BigNumber } from 'ethers'
import { RouteStatus } from '@sushiswap/tines'
import { CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS, STABLE_POOL_FACTORY_ADDRESS } from '../useClientTrade'
import { UsePoolsReturn } from './usePools'
import { FetchFeeDataResult } from 'wagmi/actions'
import { JSBI } from '@sushiswap/math'

interface UseTradeParams {
  chainId: ChainId
  tradeType?: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amountSpecified: Amount<Currency> | undefined
  currencyA: Type | undefined
  currencyB: Type | undefined
  enabled?: boolean
  pools: UsePoolsReturn | undefined
  feeData: FetchFeeDataResult | undefined
  rebases: { base: JSBI; elastic: JSBI }[] | undefined
}

export const getTrade = async ({
  chainId,
  amountSpecified,
  currencyA,
  currencyB,
  pools,
  tradeType = TradeType.EXACT_INPUT,
  feeData,
  rebases: totals,
}: UseTradeParams) => {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT ? [currencyA, currencyB] : [currencyB, currencyA]

  const [currencyInRebase, currencyOutRebase] = totals ? totals : [undefined, undefined]

  if (
    feeData &&
    feeData.gasPrice &&
    currencyIn &&
    currencyInRebase &&
    currencyOut &&
    currencyOutRebase &&
    currencyIn.wrapped.address !== currencyOut.wrapped.address &&
    chainId &&
    amountSpecified &&
    amountSpecified.greaterThan(0) &&
    pools
  ) {
    if (tradeType === TradeType.EXACT_INPUT) {
      if (
        chainId in FACTORY_ADDRESS &&
        (chainId in CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS || chainId in STABLE_POOL_FACTORY_ADDRESS)
      ) {
        const legacyRoute = findSingleRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          pools.filter((pool): pool is Pair => pool instanceof Pair),
          WNATIVE[amountSpecified.currency.chainId],
          feeData.gasPrice.toNumber()
        )

        const tridentRoute = findMultiRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.toShare(currencyInRebase).quotient.toString()),
          [
            ...pools.filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool),
            ...pools.filter((pool): pool is StablePool => pool instanceof StablePool),
          ],
          WNATIVE[amountSpecified.currency.chainId],
          feeData.gasPrice.toNumber()
        )

        const useLegacy = Amount.fromRawAmount(currencyOut.wrapped, legacyRoute.amountOutBN.toString()).greaterThan(
          Amount.fromShare(currencyOut.wrapped, tridentRoute.amountOutBN.toString(), currencyOutRebase)
        )

        if (legacyRoute.status === RouteStatus.Success || tridentRoute.status === RouteStatus.Success) {
          console.debug(`Found ${useLegacy ? 'Legacy' : 'Trident'} route`, useLegacy ? legacyRoute : tridentRoute)
          return Trade.exactIn(
            useLegacy ? legacyRoute : tridentRoute,
            amountSpecified,
            currencyOut,
            useLegacy ? TradeVersion.V1 : TradeVersion.V2,
            !useLegacy ? currencyInRebase : undefined,
            !useLegacy ? currencyOutRebase : undefined
          )
        } else {
          console.debug('No legacy or trident route', legacyRoute, tridentRoute)
        }
      }

      const legacyRoute = findSingleRouteExactIn(
        currencyIn.wrapped,
        currencyOut.wrapped,
        BigNumber.from(amountSpecified.quotient.toString()),
        pools.filter((pool): pool is Pair => pool instanceof Pair),
        WNATIVE[amountSpecified.currency.chainId],
        feeData.gasPrice.toNumber()
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
          ...pools.filter((pool): pool is ConstantProductPool => pool instanceof ConstantProductPool),
          ...pools.filter((pool): pool is StablePool => pool instanceof StablePool),
        ],
        WNATIVE[amountSpecified.currency.chainId],
        feeData.gasPrice.toNumber()
      )
      if (tridentRoute.status === RouteStatus.Success) {
        console.debug('Found trident route', tridentRoute)
        return Trade.exactIn(
          tridentRoute,
          amountSpecified,
          currencyOut,
          TradeVersion.V2,
          currencyInRebase,
          currencyOutRebase
        )
      } else {
        console.debug('No trident route', tridentRoute)
      }

      // TODO: Use best trade if both available
    } else if (tradeType === TradeType.EXACT_OUTPUT) {
      //
    }
  }
}
