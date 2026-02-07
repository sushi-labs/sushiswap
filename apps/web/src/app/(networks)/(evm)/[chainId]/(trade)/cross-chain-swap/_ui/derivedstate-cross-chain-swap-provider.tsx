'use client'

import { nanoid } from 'nanoid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  type SupportedChainId,
  type XSwapSupportedChainId,
  isXSwapSupportedChainId,
} from 'src/config'
import { nativeFromChainId, newToken } from 'src/lib/currency-from-chain-id'
import { useCrossChainTradeRoutes as _useCrossChainTradeRoutes } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { replaceNetworkSlug } from 'src/lib/network'
import type {
  CrossChainRoute,
  CrossChainRouteOrder,
} from 'src/lib/swap/cross-chain'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { useAccount } from 'src/lib/wallet'
import { Amount, Percent, getChainById, getNativeAddress } from 'sushi'
import { type EvmAddress, EvmChainId } from 'sushi/evm'
import type { SvmAddress } from 'sushi/svm'
import {
  getDefaultCurrency,
  getQuoteCurrency,
  getTokenAsString,
} from '../../_ui/derivedstate-swap-helpers'

type NewTokenInput = Parameters<typeof newToken>[0]

interface State<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> {
  mutate: {
    setChainId0(chainId: TChainId0): void
    setChainId1(chainId: TChainId1): void
    setToken0(token0: CurrencyFor<TChainId0> | string): void
    setToken1(token1: CurrencyFor<TChainId1> | string): void
    setTokens(
      token0: CurrencyFor<TChainId0> | string,
      token1: CurrencyFor<TChainId1> | string,
    ): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    setTradeId: Dispatch<SetStateAction<string>>
    setSelectedBridge(bridge: string | undefined): void
    setRouteOrder(order: CrossChainRouteOrder): void
  }
  state: {
    tradeId: string
    token0: CurrencyFor<TChainId0> | undefined
    token1: CurrencyFor<TChainId1> | undefined
    chainId0: TChainId0
    chainId1: TChainId1
    swapAmountString: string
    swapAmount: Amount<CurrencyFor<TChainId0>> | undefined
    recipient: AddressFor<TChainId1> | undefined
    selectedBridge: string | undefined
    routeOrder: CrossChainRouteOrder
  }
  isLoading: boolean
  isToken0Loading: boolean
  isToken1Loading: boolean
}

const DerivedStateCrossChainSwapContext = createContext<State>({} as State)

interface DerivedStateCrossChainSwapProviderProps {
  children: React.ReactNode
  defaultChainId: XSwapSupportedChainId
}

/* Parses the URL and provides the chainId, token0, and token1 globally.
 * URL example:
 * /swap?chainId1=2token0=NATIVE&token1=0x6b3595068778dd592e39a122f4f5a5cf09c90fe2
 *
 * If no chainId is provided, it defaults to current connected chainId or Ethereum if wallet is not connected.
 */
const DerivedstateCrossChainSwapProvider: FC<
  DerivedStateCrossChainSwapProviderProps
> = ({ children, defaultChainId }) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tradeId, setTradeId] = useState(nanoid())
  const [chainId, setChainId] = useState<XSwapSupportedChainId>(defaultChainId)
  const [selectedBridge, setSelectedBridge] = useState<string | undefined>(
    undefined,
  )
  const [routeOrder, setRouteOrder] = useState<CrossChainRouteOrder>('CHEAPEST')

  const chainId0 = isXSwapSupportedChainId(chainId)
    ? chainId
    : EvmChainId.ETHEREUM
  type TChainId0 = typeof chainId0

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))

    if (!params.has('chainId1'))
      params.set(
        'chainId1',
        chainId0 === EvmChainId.ARBITRUM
          ? EvmChainId.ETHEREUM.toString()
          : EvmChainId.ARBITRUM.toString(),
      )
    if (!params.has('token0'))
      params.set('token0', getDefaultCurrency(chainId0 as SupportedChainId))
    if (!params.has('token1'))
      params.set(
        'token1',
        getQuoteCurrency(Number(params.get('chainId1')) as SupportedChainId),
      )

    return params
  }, [chainId0, searchParams])

  // Derive chainId from defaultedParams
  const chainId1 = Number(
    defaultedParams.get('chainId1'),
  ) as XSwapSupportedChainId
  type TChainId1 = typeof chainId1

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(defaultedParams)
      values.forEach(({ name, value }) => {
        if (value === null) {
          params.delete(name)
        } else {
          params.set(name, value)
        }
      })
      return params.toString()
    },
    [defaultedParams],
  )

  // Switch token0 and token1
  const switchTokens = useCallback(() => {
    const params = new URLSearchParams(defaultedParams)
    const chainId1Param = +(params.get('chainId1') || 0)
    const token0 = params.get('token0')
    const token1 = params.get('token1')

    if (!isXSwapSupportedChainId(chainId1Param)) {
      console.error('Invalid chainId1:', chainId1Param)
      return
    }

    const pathSegments = pathname.split('/')
    pathSegments[1] = getChainById(chainId1Param).key

    // Can safely cast as defaultedParams are always defined
    history.pushState(
      null,
      '',
      `${replaceNetworkSlug(chainId1Param, pathname)}?${createQueryString([
        { name: 'swapAmount', value: null },
        { name: 'token0', value: token1 as string },
        { name: 'token1', value: token0 as string },
        { name: 'chainId1', value: chainId0.toString() },
      ])}`,
    )

    setChainId(chainId1Param)
  }, [pathname, defaultedParams, chainId0, createQueryString])

  // Update the URL with new from chainId
  const setChainId0 = useCallback(
    (chainId: XSwapSupportedChainId) => {
      if (defaultedParams.get('chainId1') === chainId.toString()) {
        switchTokens()
      } else {
        history.pushState(
          null,
          '',
          `${replaceNetworkSlug(chainId, pathname)}?${createQueryString([
            { name: 'swapAmount', value: null },
            {
              name: 'token0',
              value: getDefaultCurrency(chainId0 as SupportedChainId),
            },
          ])}`,
        )

        setChainId(chainId)
      }
    },
    [createQueryString, defaultedParams, pathname, switchTokens, chainId0],
  )

  // Update the URL with new to chainId
  const setChainId1 = useCallback(
    (chainId: XSwapSupportedChainId) => {
      if (chainId0 === chainId) {
        switchTokens()
      } else {
        push(
          `${pathname}?${createQueryString([
            { name: 'swapAmount', value: null },
            { name: 'chainId1', value: chainId.toString() },
            {
              name: 'token1',
              value: getQuoteCurrency(chainId as SupportedChainId),
            },
          ])}`,
          { scroll: false },
        )
      }
    },
    [createQueryString, pathname, push, switchTokens, chainId0],
  )

  // Update the URL with a new token0
  const setToken0 = useCallback(
    (_token0: string | CurrencyFor<TChainId0>) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(chainId0 as SupportedChainId, _token0)
      push(
        `${pathname}?${createQueryString([{ name: 'token0', value: token0 }])}`,
        { scroll: false },
      )
    },
    [chainId0, createQueryString, pathname, push],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback(
    (_token1: string | CurrencyFor<TChainId1>) => {
      // If entity is provided, parse it to a string
      const token1 = getTokenAsString(chainId1 as SupportedChainId, _token1)
      push(
        `${pathname}?${createQueryString([{ name: 'token1', value: token1 }])}`,
        { scroll: false },
      )
    },
    [chainId1, createQueryString, pathname, push],
  )

  // Update the URL with both tokens
  const setTokens = useCallback(
    (
      _token0: string | CurrencyFor<TChainId0>,
      _token1: string | CurrencyFor<TChainId1>,
    ) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(chainId0 as SupportedChainId, _token0)
      const token1 = getTokenAsString(chainId1 as SupportedChainId, _token1)

      push(
        `${pathname}?${createQueryString([
          { name: 'token0', value: token0 },
          { name: 'token1', value: token1 },
        ])}`,
        { scroll: false },
      )
    },
    [chainId0, chainId1, createQueryString, pathname, push],
  )

  // Update the URL with a new swapAmount
  const setSwapAmount = useCallback(
    (swapAmount: string) => {
      push(
        `${pathname}?${createQueryString([
          { name: 'swapAmount', value: swapAmount },
        ])}`,
        { scroll: false },
      )
    },
    [createQueryString, pathname, push],
  )

  const token0Param = defaultedParams.get('token0') as string
  const token1Param = defaultedParams.get('token1') as string

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

  const swapAmountString = defaultedParams.get('swapAmount') || ''

  const [_token0, _token1] = useMemo(
    () => [
      defaultedParams.get('token0') === 'NATIVE'
        ? nativeFromChainId(chainId0)
        : token0,
      defaultedParams.get('token1') === 'NATIVE'
        ? nativeFromChainId(chainId1)
        : token1,
    ],
    [defaultedParams, chainId0, chainId1, token0, token1],
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
    <DerivedStateCrossChainSwapContext.Provider
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
    </DerivedStateCrossChainSwapContext.Provider>
  )
}

function useDerivedStateCrossChainSwap<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>() {
  const Ctx = DerivedStateCrossChainSwapContext as unknown as React.Context<
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

function useCrossChainTradeRoutes<
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
  } = useDerivedStateCrossChainSwap<TChainId0, TChainId1>()

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

export interface UseSelectedCrossChainTradeRouteReturn<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
> extends CrossChainRoute<TChainId0, TChainId1> {
  tokenIn: CurrencyFor<TChainId0>
  tokenOut: CurrencyFor<TChainId1>
  amountIn?: Amount<CurrencyFor<TChainId0>>
  amountOut?: Amount<CurrencyFor<TChainId1>>
  amountOutMin?: Amount<CurrencyFor<TChainId1>>
  priceImpact?: Percent
}

function useSelectedCrossChainTradeRoute<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>() {
  const routesQuery = useCrossChainTradeRoutes<TChainId0, TChainId1>()

  const {
    state: { selectedBridge },
  } = useDerivedStateCrossChainSwap<TChainId0, TChainId1>()

  const route:
    | UseSelectedCrossChainTradeRouteReturn<TChainId0, TChainId1>
    | undefined = useMemo(() => {
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
  DerivedstateCrossChainSwapProvider,
  useCrossChainTradeRoutes,
  useSelectedCrossChainTradeRoute,
  useDerivedStateCrossChainSwap,
}
