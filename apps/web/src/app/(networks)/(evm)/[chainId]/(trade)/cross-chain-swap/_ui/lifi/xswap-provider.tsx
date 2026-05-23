'use client'

import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  type LifiXSwapSupportedChainId,
  type SupportedChainId,
  isLifiXSwapSupportedChainId,
} from 'src/config'
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
import { type EvmAddress, EvmChainId } from 'sushi/evm'
import type { SvmAddress } from 'sushi/svm'
import {
  getDefaultCurrency,
  getQuoteCurrency,
  getTokenAsString,
} from '../../../_ui/derivedstate-swap-helpers'
import {
  type XSwapFormMutators,
  type XSwapFormStateValues,
  useXSwapForm,
} from '../xswap-form-provider'

type NewTokenInput = Parameters<typeof newToken>[0]

interface State<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> {
  mutate: Omit<
    XSwapFormMutators<TChainId0, TChainId1>,
    'setToken0Param' | 'setToken1Param' | 'setTokenParams'
  > & {
    setToken0(token0: CurrencyFor<TChainId0> | string): void
    setToken1(token1: CurrencyFor<TChainId1> | string): void
    setTokens(
      token0: CurrencyFor<TChainId0> | string,
      token1: CurrencyFor<TChainId1> | string,
    ): void
    setSelectedBridge(bridge: string | undefined): void
    setRouteOrder(order: CrossChainRouteOrder): void
  }
  state: Omit<
    XSwapFormStateValues<TChainId0, TChainId1>,
    'token0Param' | 'token1Param' | 'chainId1'
  > & {
    chainId1: TChainId1
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

const defaultChainId1For = (
  chainId0: LifiXSwapSupportedChainId,
): LifiXSwapSupportedChainId =>
  chainId0 === EvmChainId.ARBITRUM ? EvmChainId.ETHEREUM : EvmChainId.ARBITRUM

/* Layers LiFi-specific concerns (token resolution, bridge selection, route
 * order, chainId1/token defaulting) on top of the chain-agnostic
 * XSwapFormProvider.
 */
const LifiXSwapProvider: FC<LifiXSwapProviderProps> = ({ children }) => {
  const form = useXSwapForm()

  const chainId0 = form.chainId0 as LifiXSwapSupportedChainId
  const chainId1: LifiXSwapSupportedChainId =
    form.chainId1 && isLifiXSwapSupportedChainId(form.chainId1)
      ? form.chainId1
      : defaultChainId1For(chainId0)

  const token0Param = form.token0Param ?? getDefaultCurrency(chainId0)
  const token1Param = form.token1Param ?? getQuoteCurrency(chainId1)

  // Persist the synchronously-resolved defaults back to the URL so the URL
  // stays consistent with what consumers see.
  useEffect(() => {
    if (!form.chainId1) {
      form.setChainId1(defaultChainId1For(chainId0))
    }
  }, [form.chainId1, form.setChainId1, chainId0])

  useEffect(() => {
    if (form.token0Param === undefined) {
      form.setToken0Param(getDefaultCurrency(chainId0))
    }
  }, [form.token0Param, form.setToken0Param, chainId0])

  useEffect(() => {
    if (
      form.token1Param === undefined &&
      form.chainId1 &&
      isLifiXSwapSupportedChainId(form.chainId1)
    ) {
      form.setToken1Param(getQuoteCurrency(form.chainId1))
    }
  }, [form.token1Param, form.chainId1, form.setToken1Param])

  const setToken0 = useCallback(
    (token: CurrencyFor<LifiXSwapSupportedChainId> | string) => {
      form.setToken0Param(
        typeof token === 'string' ? token : getTokenAsString(chainId0, token),
      )
    },
    [form.setToken0Param, chainId0],
  )

  const setToken1 = useCallback(
    (token: CurrencyFor<LifiXSwapSupportedChainId> | string) => {
      form.setToken1Param(
        typeof token === 'string' ? token : getTokenAsString(chainId1, token),
      )
    },
    [form.setToken1Param, chainId1],
  )

  const setTokens = useCallback(
    (
      token0: CurrencyFor<LifiXSwapSupportedChainId> | string,
      token1: CurrencyFor<LifiXSwapSupportedChainId> | string,
    ) => {
      form.setTokenParams(
        typeof token0 === 'string'
          ? token0
          : getTokenAsString(chainId0, token0),
        typeof token1 === 'string'
          ? token1
          : getTokenAsString(chainId1, token1),
      )
    },
    [form.setTokenParams, chainId0, chainId1],
  )

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
      _token0 ? Amount.tryFromHuman(_token0, form.swapAmountString) : undefined,
    [_token0, form.swapAmountString],
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
            setChainId0: form.setChainId0,
            setChainId1: form.setChainId1,
            setToken0,
            setToken1,
            setTokens,
            setTradeId: form.setTradeId,
            switchTokens: form.switchTokens,
            setSwapAmount: form.setSwapAmount,
            setSelectedBridge,
            setRouteOrder,
          },
          state: {
            tradeId: form.tradeId,
            recipient,
            chainId0,
            chainId1,
            swapAmountString: form.swapAmountString,
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
        form.setChainId0,
        form.setChainId1,
        form.setSwapAmount,
        setToken0,
        setToken1,
        setTokens,
        form.switchTokens,
        swapAmount,
        form.swapAmountString,
        _token0,
        token0Loading,
        _token1,
        token1Loading,
        form.tradeId,
        form.setTradeId,
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
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
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
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
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
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> = NonNullable<
  ReturnType<
    typeof useLifiXSwapSelectedTradeRoute<TChainId0, TChainId1>
  >['data']
>

function useLifiXSwapSelectedTradeRoute<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
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
