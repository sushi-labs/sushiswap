'use client'

import {
  type FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { XSwapSupportedChainId } from 'src/config'
import { nativeFromChainId, newToken } from 'src/lib/currency-from-chain-id'
import { useCrossChainTradeRoutes as _useCrossChainTradeRoutes } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import type {
  CrossChainRoute,
  CrossChainRouteOrder,
} from 'src/lib/swap/cross-chain'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { useAccount } from 'src/lib/wallet'
import { Amount, Percent, getNativeAddress } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import type { SvmAddress } from 'sushi/svm'
import {
  type XSwapFormMutators,
  type XSwapFormStateValues,
  useXSwapForm,
} from './xswap-form-provider'

type NewTokenInput = Parameters<typeof newToken>[0]

interface State<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> {
  mutate: XSwapFormMutators<TChainId0, TChainId1> & {
    setSelectedBridge(bridge: string | undefined): void
    setRouteOrder(order: CrossChainRouteOrder): void
  }
  state: Omit<
    XSwapFormStateValues<TChainId0, TChainId1>,
    'token0Param' | 'token1Param'
  > & {
    token0: CurrencyFor<TChainId0> | undefined
    token1: CurrencyFor<TChainId1> | undefined
    swapAmount: Amount<CurrencyFor<TChainId0>> | undefined
    recipient: AddressFor<TChainId1> | undefined
    selectedBridge: string | undefined
    routeOrder: CrossChainRouteOrder
  }
  isLoading: boolean
  isToken0Loading: boolean
  isToken1Loading: boolean
}

const LifiXSwapContext = createContext<State>({} as State)

interface LifiXSwapProviderProps {
  children: React.ReactNode
}

/* Parses the URL and provides the chainId, token0, and token1 globally.
 * URL example:
 * /swap?chainId1=2token0=NATIVE&token1=0x6b3595068778dd592e39a122f4f5a5cf09c90fe2
 *
 * If no chainId is provided, it defaults to current connected chainId or Ethereum if wallet is not connected.
 */
const LifiXSwapProvider: FC<
  LifiXSwapProviderProps
> = ({ children }) => {
  const {
    chainId0,
    chainId1,
    token0Param,
    token1Param,
    swapAmountString,
    tradeId,
    setTradeId,
    setChainId0,
    setChainId1,
    setToken0,
    setToken1,
    setTokens,
    setSwapAmount,
    switchTokens,
  } = useXSwapForm()

  const [selectedBridge, setSelectedBridge] = useState<string | undefined>(
    undefined,
  )
  const [routeOrder, setRouteOrder] = useState<CrossChainRouteOrder>('CHEAPEST')

  // Derive token0
  const { data: token0, isInitialLoading: token0Loading } = useTokenWithCache({
    chainId: chainId0,
    address: token0Param as EvmAddress | SvmAddress,
    keepPreviousData: false,
  })

  // Derive token1
  const { data: token1, isInitialLoading: token1Loading } = useTokenWithCache({
    chainId: chainId1,
    address: token1Param as EvmAddress | SvmAddress,
    keepPreviousData: false,
  })

  const [_token0, _token1] = useMemo(
    () => [
      token0Param === 'NATIVE' ? nativeFromChainId(chainId0) : token0,
      token1Param === 'NATIVE' ? nativeFromChainId(chainId1) : token1,
    ],
    [token0Param, token1Param, chainId0, chainId1, token0, token1],
  )

  const swapAmount = useMemo(
    () =>
      _token0 ? Amount.tryFromHuman(_token0, swapAmountString) : undefined,
    [_token0, swapAmountString],
  )

  const recipient = useAccount(chainId1)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSelectedBridge(undefined)
  }, [swapAmount, routeOrder])

  return (
    <LifiXSwapContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setChainId0,
            setChainId1,
            setToken0,
            setToken1,
            setTokens,
            setTradeId,
            switchTokens,
            setSwapAmount,
            setSelectedBridge,
            setRouteOrder,
          },
          state: {
            tradeId,
            recipient,
            chainId0,
            chainId1,
            swapAmountString,
            swapAmount,
            token0: _token0,
            token1: _token1,
            selectedBridge,
            routeOrder,
          },
          isLoading: token0Loading || token1Loading,
          isToken0Loading: token0Loading,
          isToken1Loading: token1Loading,
        }
      }, [
        chainId0,
        chainId1,
        setChainId0,
        setChainId1,
        setSwapAmount,
        setToken0,
        setToken1,
        setTokens,
        setTradeId,
        switchTokens,
        swapAmount,
        swapAmountString,
        _token0,
        token0Loading,
        _token1,
        token1Loading,
        tradeId,
        selectedBridge,
        routeOrder,
        recipient,
      ])}
    >
      {children}
    </LifiXSwapContext.Provider>
  )
}

function useLifiXSwap<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>() {
  const Ctx = LifiXSwapContext as unknown as React.Context<
    State<TChainId0, TChainId1>
  >

  const context = useContext(Ctx)
  if (!context) {
    throw new Error(
      'Hook can only be used inside CrossChain Swap Derived State Context',
    )
  }

  return context
}

function useLifiXSwapTradeRoutes<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>() {
  const {
    state: {
      chainId0,
      token1,
      swapAmount,
      selectedBridge,
      routeOrder,
      recipient,
    },
    mutate: { setSelectedBridge },
  } = useLifiXSwap<TChainId0, TChainId1>()

  const [slippagePercent] = useSlippageTolerance()
  const address = useAccount(chainId0)

  const query = _useCrossChainTradeRoutes<TChainId0, TChainId1>({
    fromAmount: swapAmount,
    toToken: token1,
    slippage: slippagePercent,
    fromAddress: address,
    order: routeOrder,
    toAddress: recipient,
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

export type UseLifiXSwapSelectedTradeRouteReturn<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
> = NonNullable<
  ReturnType<
    typeof useLifiXSwapSelectedTradeRoute<TChainId0, TChainId1>
  >['data']
>

function useLifiXSwapSelectedTradeRoute<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>() {
  const routesQuery = useLifiXSwapTradeRoutes<TChainId0, TChainId1>()

  const {
    state: { selectedBridge },
  } = useLifiXSwap<TChainId0, TChainId1>()

  const route = useMemo(() => {
    const route = routesQuery.data?.find(
      (route) => route.step.tool === selectedBridge,
    )

    if (!route) return undefined

    const tokenIn = (
      getNativeAddress(route.fromToken.chainId) === route.fromToken.address
        ? nativeFromChainId(route.fromToken.chainId)
        : newToken(route.fromToken as NewTokenInput)
    ) as CurrencyFor<TChainId0>

    const tokenOut = (
      getNativeAddress(route.toToken.chainId) === route.toToken.address
        ? nativeFromChainId(route.toToken.chainId)
        : newToken(route.toToken as NewTokenInput)
    ) as CurrencyFor<TChainId1>

    const amountIn = new Amount(tokenIn, route.fromAmount)
    const amountOut = new Amount(tokenOut, route.toAmount)
    const amountOutMin = new Amount(tokenOut, route.toAmountMin)

    const fromAmountUSD =
      (Number(route.fromToken.priceUSD) * Number(amountIn.amount)) /
      10 ** tokenIn.decimals

    const toAmountUSD =
      (Number(route.toToken.priceUSD) * Number(amountOut.amount)) /
      10 ** tokenOut.decimals

    const priceImpact = new Percent({
      numerator: Math.floor((fromAmountUSD / toAmountUSD - 1) * 10_000),
      denominator: 10_000,
    })

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
  LifiXSwapProvider,
  useLifiXSwapTradeRoutes,
  useLifiXSwapSelectedTradeRoute,
  useLifiXSwap,
}
