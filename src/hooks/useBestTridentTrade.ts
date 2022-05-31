import { BigNumber } from '@ethersproject/bignumber'
import {
  ChainId,
  Currency,
  CurrencyAmount,
  JSBI,
  Pair,
  Trade as LegacyTrade,
  TradeType,
  WNATIVE,
} from '@sushiswap/core-sdk'
import {
  ConstantProductPool,
  convertTinesSingleRouteToLegacyRoute,
  findMultiRouteExactIn,
  findMultiRouteExactOut,
  findSingleRouteExactIn,
  findSingleRouteExactOut,
  MultiRoute,
  PoolState,
  RouteStatus,
  Trade,
} from '@sushiswap/trident-sdk'
import { PoolUnion } from 'app/features/trident/types'
import { toAmountJSBI, toShareCurrencyAmount } from 'app/functions'
import { useBentoRebase } from 'app/hooks/useBentoRebases'
import { PairState, useV2Pairs } from 'app/hooks/useV2Pairs'
import useBlockNumber from 'app/lib/hooks/useBlockNumber'
import { useActiveWeb3React } from 'app/services/web3'
import { TradeUnion } from 'app/types'
import { useEffect, useMemo, useState } from 'react'

// import { atom, useSetRecoilState } from 'recoil'
import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { useGetAllExistedPools } from './useConstantProductPools'

export function useAllCommonPools(currencyA?: Currency, currencyB?: Currency): (PoolUnion | Pair)[] {
  const currencyCombinations = useAllCurrencyCombinations(currencyA, currencyB)
  const constantProductPools = useGetAllExistedPools(currencyCombinations)
  // const constantProductPools = useConstantProductPoolsPermutations(currencyCombinations)
  const allPairs = useV2Pairs(currencyCombinations)
  const pools = useMemo(() => [...constantProductPools, ...allPairs], [allPairs, constantProductPools])
  return useMemo(
    () => [
      ...Object.values(
        pools.reduce<(PoolUnion | Pair)[]>((acc, result) => {
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
}

export type UseBestTridentTradeOutput = {
  trade?: TradeUnion
  priceImpact?: number
}

export type RoutingInfo = {
  chainId?: ChainId
  allowedPools?: (PoolUnion | Pair)[]
  mode?: 'single' | 'multiple'
  route?: MultiRoute
}

// export const routingInfo = atom<RoutingInfo | undefined>({
//   key: 'routingInfo',
//   default: undefined,
// })

/**
 * Returns best trident trade for a desired swap.
 * @param tradeType whether we request an exact output amount or we provide an exact input amount
 * @param amountSpecified the exact amount to swap in/out
 * @param mainCurrency the desired input/payment currency
 * @param otherCurrency the desired output/payment currency
 */
export function useBestTridentTrade(
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT,
  amountSpecified?: CurrencyAmount<Currency>,
  mainCurrency?: Currency,
  otherCurrency?: Currency
): UseBestTridentTradeOutput {
  const { chainId, library } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  // const setRoutingInfo = useSetRecoilState(routingInfo)

  const [gasPrice, setGasPrice] = useState<number>()

  const [currencyIn, currencyOut] = useMemo(
    () => (tradeType === TradeType.EXACT_INPUT ? [mainCurrency, otherCurrency] : [otherCurrency, mainCurrency]),
    [tradeType, mainCurrency, otherCurrency]
  )

  const { rebase: currencyInRebase } = useBentoRebase(currencyIn)
  const { rebase: currencyOutRebase } = useBentoRebase(currencyOut)

  const allowedPools = useAllCommonPools(currencyIn, currencyOut)

  useEffect(() => {
    if (!library) return

    const main = async () => {
      const gas = await library.getGasPrice()
      return gas.toNumber()
    }

    main().then((gasPrice) => setGasPrice(gasPrice))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, library])

  return useMemo(() => {
    if (
      gasPrice &&
      currencyIn &&
      currencyOut &&
      currencyIn.wrapped.address !== currencyOut.wrapped.address &&
      chainId &&
      amountSpecified &&
      otherCurrency &&
      currencyInRebase &&
      currencyOutRebase &&
      allowedPools.length > 0
    ) {
      const shareSpecified = CurrencyAmount.fromRawAmount(
        amountSpecified.currency,
        toShareCurrencyAmount(currencyInRebase, amountSpecified.wrapped).quotient.toString()
      )
      const tridentPools = allowedPools.filter((pool) => pool instanceof ConstantProductPool) as ConstantProductPool[]
      const legacyPools = allowedPools.filter((pair) => pair instanceof Pair) as Pair[]

      if (tradeType === TradeType.EXACT_INPUT) {
        const tridentRoute = findMultiRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(shareSpecified.quotient.toString()),
          tridentPools,
          WNATIVE[shareSpecified.currency.chainId],
          gasPrice
        )

        const legacyRoute = findSingleRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          legacyPools,
          WNATIVE[amountSpecified.currency.chainId],
          gasPrice
        )

        const tridentAmountOutput = BigNumber.from(
          toAmountJSBI(currencyOutRebase, JSBI.BigInt(tridentRoute.amountOutBN.toString())).toString()
        )

        if (tridentAmountOutput.gt(legacyRoute.amountOutBN)) {
          if (tridentRoute.status === RouteStatus.Success) {
            const priceImpact = tridentRoute.priceImpact
            // setRoutingInfo({ chainId, allowedPools: tridentPools, route: tridentRoute, mode: 'multiple' })
            return {
              trade: Trade.bestTradeExactIn(tridentRoute, shareSpecified, currencyOut),
              priceImpact,
            }
          }
        } else {
          if (legacyRoute.status === RouteStatus.Success) {
            const priceImpact = legacyRoute.priceImpact
            // setRoutingInfo({ chainId, allowedPools: legacyPools, route: legacyRoute, mode: 'single' })
            const route = convertTinesSingleRouteToLegacyRoute(legacyRoute, legacyPools, currencyIn, currencyOut)

            try {
              return {
                trade: LegacyTrade.exactIn(route, amountSpecified),
                priceImpact,
              }
            } catch (error) {
              return { trade: undefined, priceImpact: undefined }
            }
          }
        }
      } else {
        const tridentRoute = findMultiRouteExactOut(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(shareSpecified.quotient.toString()),
          tridentPools,
          WNATIVE[shareSpecified.currency.chainId],
          gasPrice
        )

        const legacyRoute = findSingleRouteExactOut(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          legacyPools,
          WNATIVE[amountSpecified.currency.chainId],
          gasPrice
        )

        const tridentAmountOutput = BigNumber.from(
          toAmountJSBI(currencyOutRebase, JSBI.BigInt(tridentRoute.amountOut.toString())).toString()
        )

        if (tridentAmountOutput.lt(legacyRoute.amountInBN)) {
          if (tridentRoute.status === RouteStatus.Success) {
            const priceImpact = tridentRoute.priceImpact
            // setRoutingInfo({ chainId, allowedPools: tridentPools, route: tridentRoute, mode: 'multiple' })
            return {
              trade: Trade.bestTradeExactOut(tridentRoute, currencyIn, shareSpecified),
              priceImpact,
            }
          }
        } else {
          if (legacyRoute.status === RouteStatus.Success) {
            const priceImpact = legacyRoute.priceImpact
            // setRoutingInfo({ chainId, allowedPools: legacyPools, route: legacyRoute, mode: 'single' })
            const route = convertTinesSingleRouteToLegacyRoute(legacyRoute, legacyPools, currencyIn, currencyOut)
            try {
              return {
                trade: LegacyTrade.exactOut(route, amountSpecified),
                priceImpact,
              }
            } catch (error) {
              return { trade: undefined, priceImpact: undefined }
            }
          }
        }
      }
    }

    return {
      trade: undefined,
      priceImpact: undefined,
    }
  }, [
    allowedPools,
    amountSpecified,
    chainId,
    currencyIn,
    currencyOut,
    gasPrice,
    otherCurrency,
    currencyInRebase,
    currencyOutRebase,
    tradeType,
  ])
}
