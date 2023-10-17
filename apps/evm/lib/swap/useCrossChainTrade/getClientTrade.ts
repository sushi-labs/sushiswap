import { RouteStatus } from '@sushiswap/tines'
import { isTridentChainId } from '@sushiswap/trident-sdk'
import { SUSHISWAP_V2_FACTORY_ADDRESS } from '@sushiswap/v2-sdk'
import { ChainId } from 'sushi/chain'
import { Amount, Currency, Type, WNATIVE } from 'sushi/currency'
import { TradeType, Version as TradeVersion } from 'sushi/dex'
import { FetchFeeDataResult } from 'wagmi/actions'
import { findMultiRouteExactIn } from './findMultiRouteExactIn'
import { findSingleRouteExactIn } from './findSingleRouteExactIn'
import { Trade } from './trade'
import { UsePoolsReturn } from '@sushiswap/wagmi/future/hooks/pools'

export interface GetTradeParams {
  chainId: ChainId
  tradeType?: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amount: Amount<Currency> | undefined
  fromToken: Type | undefined
  toToken: Type | undefined
  enabled?: boolean
  pools: UsePoolsReturn | undefined
  feeData: FetchFeeDataResult | undefined
  rebases: { base: bigint; elastic: bigint }[] | null | undefined
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
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT
      ? [fromToken, toToken]
      : [toToken, fromToken]

  const [currencyInRebase, currencyOutRebase] = totals
    ? totals
    : [undefined, undefined]

  if (
    feeData?.gasPrice &&
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
        isTridentChainId(chainId)
      ) {
        const legacyRoute = findSingleRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          amount.quotient,
          pools.sushiSwapV2Pools || [],
          WNATIVE[amount.currency.chainId],
          Number(feeData.gasPrice),
        )

        const tridentRoute = findMultiRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          amount.toShare(currencyInRebase).quotient,
          [
            ...(pools.tridentConstantPools || []),
            ...(pools.tridentStablePools || []),
          ],
          WNATIVE[amount.currency.chainId],
          Number(feeData.gasPrice),
        )

        const useLegacy = Amount.fromRawAmount(
          currencyOut.wrapped,
          legacyRoute.amountOutBI.toString(),
        ).greaterThan(
          Amount.fromShare(
            currencyOut.wrapped,
            tridentRoute.amountOutBI.toString(),
            currencyOutRebase,
          ),
        )

        if (
          legacyRoute.status === RouteStatus.Success ||
          tridentRoute.status === RouteStatus.Success
        ) {
          console.debug(
            `Found ${useLegacy ? 'Legacy' : 'Trident'} route`,
            useLegacy ? legacyRoute : tridentRoute,
          )
          return Trade.exactIn(
            useLegacy ? legacyRoute : tridentRoute,
            amount,
            currencyOut,
            useLegacy ? TradeVersion.V1 : TradeVersion.V2,
            !useLegacy ? currencyInRebase : undefined,
            !useLegacy ? currencyOutRebase : undefined,
          )
        } else {
          console.debug('No legacy or trident route', legacyRoute, tridentRoute)
        }
      }

      const legacyRoute = findSingleRouteExactIn(
        currencyIn.wrapped,
        currencyOut.wrapped,
        amount.quotient,
        pools.sushiSwapV2Pools || [],
        WNATIVE[amount.currency.chainId],
        Number(feeData.gasPrice),
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
        amount.toShare(currencyInRebase).quotient,
        [
          ...(pools.tridentConstantPools || []),
          ...(pools.tridentStablePools || []),
        ],
        WNATIVE[amount.currency.chainId],
        Number(feeData.gasPrice),
      )
      if (tridentRoute.status === RouteStatus.Success) {
        console.debug('Found trident route', tridentRoute)
        return Trade.exactIn(
          tridentRoute,
          amount,
          currencyOut,
          TradeVersion.V2,
          currencyInRebase,
          currencyOutRebase,
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
