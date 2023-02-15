import { useQuery } from '@tanstack/react-query'
import { getConstantProductPools } from './getConstantProductPools'
import { ChainId } from '@sushiswap/chain'
import { getCurrencyCombinations } from '@sushiswap/router'
import { Amount, Type as Currency, Type, WNATIVE } from '@sushiswap/currency'
import { getStablePools } from './getStablePools'
import { getPairs } from './getPairs'
import { ConstantProductPoolState, PairState, StablePoolState, useBentoBoxTotal } from '@sushiswap/wagmi'
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
import { getBentoboxTotals } from './getBentoboxTotals'
import { BigNumber } from 'ethers'
import { RouteStatus } from '@sushiswap/tines'
import { CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS, STABLE_POOL_FACTORY_ADDRESS } from '../useClientTrade'
import { fetchFeeData } from 'wagmi/actions'

interface UseTradeParams {
  chainId: ChainId
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amountSpecified: Amount<Currency> | undefined
  currencyA: Type | undefined
  currencyB: Type | undefined
  enabled?: boolean
}

export const getTrade = async ({ chainId, tradeType, amountSpecified, currencyA, currencyB }: UseTradeParams) => {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT ? [currencyA, currencyB] : [currencyB, currencyA]

  const currencyCombinations =
    currencyIn && currencyOut && chainId ? getCurrencyCombinations(chainId, currencyIn, currencyOut) : []

  const [data, pairs, constantProductPools, stablePools, totals] = await Promise.all([
    fetchFeeData({ chainId }),
    getPairs(chainId, currencyCombinations),
    getConstantProductPools(chainId, currencyCombinations),
    getStablePools(chainId, currencyCombinations),
    getBentoboxTotals(chainId, [currencyA, currencyB]),
  ])

  const pools = [...pairs, ...constantProductPools, ...stablePools]

  const filteredPools = Object.values(
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
  )

  const currencyInRebase = currencyA && totals ? totals[currencyA.wrapped.address] : undefined
  const currencyOutRebase = currencyB && totals ? totals[currencyB.wrapped.address] : undefined

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
    filteredPools.length > 0
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
          filteredPools.filter((pool): pool is Pair => pool instanceof Pair),
          WNATIVE[amountSpecified.currency.chainId],
          data.gasPrice.toNumber()
        )

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
}
