'use client'

import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useCrossChainTradeRoutes as _useCrossChainTradeRoutes } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import type {
  CrossChainRoute,
  CrossChainRouteOrder,
} from 'src/lib/swap/cross-chain'
import type { EvmChainId } from 'sushi/chain'
import { Amount, Native, Token, type Type } from 'sushi/currency'
import { Percent } from 'sushi/math'
import { type Address, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'

interface State {
  mutate: {
    setChainId0(chainId: number): void
    setChainId1(chainId: number): void
    setToken0(token0: Type | string): void
    setToken1(token1: Type | string): void
    setTokens(token0: Type | string, token1: Type | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    setTradeId: Dispatch<SetStateAction<string>>
    setSelectedBridge(bridge: string | undefined): void
    setRouteOrder(order: CrossChainRouteOrder): void
  }
  state: {
    tradeId: string
    token0: Type | undefined
    token1: Type | undefined
    chainId0: EvmChainId
    chainId1: EvmChainId
    swapAmountString: string
    swapAmount: Amount<Type> | undefined
    recipient: Address | undefined
    selectedBridge: string | undefined
    routeOrder: CrossChainRouteOrder
  }
  isLoading: boolean
  isToken0Loading: boolean
  isToken1Loading: boolean
}

const DerivedStateCrossChainSwapContext = createContext<State>({} as State)

const useDerivedStateCrossChainSwap = () => {
  const context = useContext(DerivedStateCrossChainSwapContext)
  if (!context) {
    throw new Error(
      'Hook can only be used inside CrossChain Swap Derived State Context',
    )
  }

  return context
}

const useCrossChainTradeRoutes = () => {
  const {
    state: { token1, swapAmount, selectedBridge, routeOrder },
    mutate: { setSelectedBridge },
  } = useDerivedStateCrossChainSwap()

  const [slippagePercent] = useSlippageTolerance()
  const { address } = useAccount()

  const query = _useCrossChainTradeRoutes({
    fromAmount: swapAmount,
    toToken: token1,
    slippage: slippagePercent,
    fromAddress: address,
    order: routeOrder,
  })

  useEffect(() => {
    if (
      query.data?.length &&
      (typeof selectedBridge === 'undefined' ||
        !query.data.find((route) => route.step.tool === selectedBridge))
    ) {
      setSelectedBridge(query.data[0].step.tool)
    }
  }, [query.data, selectedBridge, setSelectedBridge])

  return query
}

export interface UseSelectedCrossChainTradeRouteReturn extends CrossChainRoute {
  tokenIn: Type
  tokenOut: Type
  amountIn?: Amount<Type>
  amountOut?: Amount<Type>
  amountOutMin?: Amount<Type>
  priceImpact?: Percent
}

const useSelectedCrossChainTradeRoute = () => {
  const routesQuery = useCrossChainTradeRoutes()

  const {
    state: { selectedBridge },
  } = useDerivedStateCrossChainSwap()

  const route: UseSelectedCrossChainTradeRouteReturn | undefined =
    useMemo(() => {
      const route = routesQuery.data?.find(
        (route) => route.step.tool === selectedBridge,
      )

      if (!route) return undefined

      const tokenIn =
        route.fromToken.address === zeroAddress
          ? Native.onChain(route.fromToken.chainId)
          : new Token(route.fromToken)

      const tokenOut =
        route.toToken.address === zeroAddress
          ? Native.onChain(route.toToken.chainId)
          : new Token(route.toToken)

      const amountIn = Amount.fromRawAmount(tokenIn, route.fromAmount)
      const amountOut = Amount.fromRawAmount(tokenOut, route.toAmount)
      const amountOutMin = Amount.fromRawAmount(tokenOut, route.toAmountMin)

      const fromAmountUSD =
        (Number(route.fromToken.priceUSD) * Number(amountIn.quotient)) /
        10 ** tokenIn.decimals

      const toAmountUSD =
        (Number(route.toToken.priceUSD) * Number(amountOut.quotient)) /
        10 ** tokenOut.decimals

      const priceImpact = new Percent(
        Math.floor((fromAmountUSD / toAmountUSD - 1) * 10_000),
        10_000,
      )

      return {
        ...route,
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        amountOutMin,
        priceImpact,
      }
    }, [routesQuery.data, selectedBridge])

  return useMemo(
    () => ({
      ...routesQuery,
      data: route,
    }),
    [routesQuery, route],
  )
}

export {
  useCrossChainTradeRoutes,
  useSelectedCrossChainTradeRoute,
  useDerivedStateCrossChainSwap,
  DerivedStateCrossChainSwapContext,
}
