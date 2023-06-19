import { ChainId } from '@sushiswap/chain'
import { Amount, Type as Currency, Type, WNATIVE } from '@sushiswap/currency'
import {
  findMultiRouteExactIn,
  findSingleRouteExactIn,
  Trade,
  TradeType,
  Version as TradeVersion,
} from '@sushiswap/amm'
import {   SUSHISWAP_V2_FACTORY_ADDRESS} from '@sushiswap/v2-sdk'
import { BigNumber } from 'ethers'
import { RouteStatus } from '@sushiswap/tines'
import { FetchFeeDataResult } from 'wagmi/actions'
import { JSBI } from '@sushiswap/math'
import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident-core'
import { UsePoolsReturn } from '../../pools'

export interface GetTradeParams {
  chainId: ChainId
  tradeType?: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amount: Amount<Currency> | undefined
  fromToken: Type | undefined
  toToken: Type | undefined
  enabled?: boolean
  pools: UsePoolsReturn | undefined
  feeData: FetchFeeDataResult | undefined
  rebases: { base: JSBI; elastic: JSBI }[] | null | undefined
}

export const getClientTrade = async ({
  chainId,
  amount,
  fromToken,
  toToken,
  tradeType = TradeType.EXACT_INPUT,
  pools,
  feeData,
  rebases: totals,
}: GetTradeParams) => {
  const [currencyIn, currencyOut] = tradeType === TradeType.EXACT_INPUT ? [fromToken, toToken] : [toToken, fromToken]

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
    amount &&
    amount.greaterThan(0) &&
    pools
  ) {
    if (tradeType === TradeType.EXACT_INPUT) {
      if (
        chainId in SUSHISWAP_V2_FACTORY_ADDRESS &&
        (isConstantProductPoolFactoryChainId(chainId) || isStablePoolFactoryChainId(chainId))
      ) {
        const legacyRoute = findSingleRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amount.quotient.toString()),
          pools.pairs || [],
          WNATIVE[amount.currency.chainId],
          feeData.gasPrice.toNumber()
        )

        const tridentRoute = findMultiRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amount.toShare(currencyInRebase).quotient.toString()),
          [...(pools.constantProductPools || []), ...(pools.stablePools || [])],
          WNATIVE[amount.currency.chainId],
          feeData.gasPrice.toNumber()
        )

        const useLegacy = Amount.fromRawAmount(currencyOut.wrapped, legacyRoute.amountOutBN.toString()).greaterThan(
          Amount.fromShare(currencyOut.wrapped, tridentRoute.amountOutBN.toString(), currencyOutRebase)
        )

        if (legacyRoute.status === RouteStatus.Success || tridentRoute.status === RouteStatus.Success) {
          console.debug(`Found ${useLegacy ? 'Legacy' : 'Trident'} route`, useLegacy ? legacyRoute : tridentRoute)
          return Trade.exactIn(
            useLegacy ? legacyRoute : tridentRoute,
            amount,
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
        BigNumber.from(amount.quotient.toString()),
        pools.pairs || [],
        WNATIVE[amount.currency.chainId],
        feeData.gasPrice.toNumber()
      )

      if (legacyRoute.status === RouteStatus.Success) {
        console.debug('Found legacy route', legacyRoute)
        return Trade.exactIn(legacyRoute, amount, currencyOut, TradeVersion.V1)
      } else {
        console.debug('No legacy route', legacyRoute)
      }

      // TODO: Switch to shares
      const tridentRoute = findMultiRouteExactIn(
        currencyIn.wrapped,
        currencyOut.wrapped,
        BigNumber.from(amount.toShare(currencyInRebase).quotient.toString()),
        [...(pools.constantProductPools || []), ...(pools.stablePools || [])],
        WNATIVE[amount.currency.chainId],
        feeData.gasPrice.toNumber()
      )
      if (tridentRoute.status === RouteStatus.Success) {
        console.debug('Found trident route', tridentRoute)
        return Trade.exactIn(tridentRoute, amount, currencyOut, TradeVersion.V2, currencyInRebase, currencyOutRebase)
      } else {
        console.debug('No trident route', tridentRoute)
      }

      // TODO: Use best trade if both available
    } else if (tradeType === TradeType.EXACT_OUTPUT) {
      //
    }
  }
}
