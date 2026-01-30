'use client'

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type SupportedChainId, isSupportedChainId } from 'src/config'
import {
  useEvmTrade,
  useEvmTradeQuote,
  useSvmTradeQuote,
} from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { useCarbonOffset } from 'src/lib/swap/useCarbonOffset'
import { useAccount } from 'src/lib/wallet'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import {
  Amount,
  type Percent,
  ZERO,
  isWNativeSupported,
  normalizeAddress,
} from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  EvmNative,
  defaultCurrency,
  defaultQuoteCurrency,
  isEvmAddress,
  isEvmChainId,
} from 'sushi/evm'
import {
  type SvmAddress,
  type SvmChainId,
  SvmNative,
  isSvmAddress,
  isSvmChainId,
  svmDefaultCurrency,
  svmDefaultQuoteCurrency,
} from 'sushi/svm'
import { useConnection, useGasPrice } from 'wagmi'

function getTokenAsString<TChainId extends SupportedChainId>(
  chainId: TChainId,
  token: CurrencyFor<TChainId> | string,
) {
  if (typeof token === 'string') {
    if (isEvmAddress(token) || isSvmAddress(token)) {
      return normalizeAddress(chainId, token as AddressFor<typeof chainId>)
    }
    throw new Error(`Invalid token address: ${token}`)
  } else if (token.type === 'native') {
    return 'NATIVE' as const
  }

  return token.wrap().address as AddressFor<TChainId>
}

function getDefaultCurrency(chainId: SupportedChainId) {
  if (isEvmChainId(chainId)) {
    return getTokenAsString(chainId, defaultCurrency[chainId])
  } else if (isSvmChainId(chainId)) {
    return getTokenAsString(chainId, svmDefaultCurrency[chainId])
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}
function getQuoteCurrency(chainId: SupportedChainId) {
  if (isEvmChainId(chainId)) {
    return getTokenAsString(chainId, defaultQuoteCurrency[chainId])
  } else if (isSvmChainId(chainId)) {
    return getTokenAsString(chainId, svmDefaultQuoteCurrency[chainId])
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}

function getNativeIfNativeAndWNativeSupported<
  TChainId extends SupportedChainId,
>(
  chainId: TChainId,
  token: CurrencyFor<TChainId> | undefined,
  address: string,
): CurrencyFor<TChainId> | undefined {
  if (address !== 'NATIVE') {
    return token
  }

  if (isEvmChainId(chainId)) {
    if (isWNativeSupported(chainId)) {
      return EvmNative.fromChainId(chainId) as CurrencyFor<TChainId>
    }
    return token
  }

  if (isSvmChainId(chainId)) {
    return SvmNative.fromChainId(chainId) as CurrencyFor<TChainId>
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}

interface State<TChainId extends SupportedChainId = SupportedChainId> {
  mutate: {
    setToken0(token0: CurrencyFor<TChainId> | string): void
    setToken1(token1: CurrencyFor<TChainId> | string): void
    setTokens(
      token0: CurrencyFor<TChainId> | string,
      token1: CurrencyFor<TChainId> | string,
    ): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    setTokenTax(tax: Percent | false | undefined): void
  }
  state: {
    token0: CurrencyFor<TChainId> | undefined
    token1: CurrencyFor<TChainId> | undefined
    chainId: TChainId
    swapAmountString: string
    swapAmount: Amount<CurrencyFor<TChainId>> | undefined
    recipient: AddressFor<TChainId> | undefined
    tokenTax: Percent | false | undefined
  }
  isLoading: boolean
  isToken0Loading: boolean
  isToken1Loading: boolean
}

const DerivedStateSimpleSwapContext = createContext<State>({} as State)

interface DerivedStateSimpleSwapProviderProps {
  children: React.ReactNode
}

/* Parses the URL and provides the chainId, token0, and token1 globally.
 * URL example:
 * /swap?token0=NATIVE&token1=0x6b3595068778dd592e39a122f4f5a5cf09c90fe2
 */
function DerivedstateSimpleSwapProvider({
  children,
}: DerivedStateSimpleSwapProviderProps) {
  const { push } = useRouter()
  const { chainId: _chainId } = useParams()
  const { address } = useConnection()
  const svmAddress = useAccount('svm')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tokenTax, setTokenTax] = useState<Percent | false | undefined>(
    undefined,
  )

  const chainId: SupportedChainId =
    _chainId && isSupportedChainId(+_chainId)
      ? (+_chainId as SupportedChainId)
      : EvmChainId.ETHEREUM

  type TChainId = typeof chainId

  const [localTokenCache, setLocalTokenCache] = useState<
    Map<string, CurrencyFor<TChainId>>
  >(new Map())

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)

    if (!params.has('token0')) {
      params.set('token0', getDefaultCurrency(chainId))
    }
    if (!params.has('token1')) {
      params.set('token1', getQuoteCurrency(chainId))
    }
    return params
  }, [chainId, searchParams])

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
    // console.log('switchTokens', {
    //   token0: defaultedParams.get('token1'),
    //   token1: defaultedParams.get('token0'),
    // })
    push(
      `${pathname}?${createQueryString([
        { name: 'swapAmount', value: null },
        { name: 'token0', value: defaultedParams.get('token1') as string },
        { name: 'token1', value: defaultedParams.get('token0') as string },
      ])}`,
      { scroll: false },
    )
  }, [createQueryString, defaultedParams, pathname, push])

  // Update the URL with a new token0
  const setToken0 = useCallback<
    (_token0: string | CurrencyFor<TChainId>) => void
  >(
    (_token0) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(chainId, _token0)

      if (typeof _token0 !== 'string') {
        setLocalTokenCache(localTokenCache.set(token0, _token0))
      }

      // Switch tokens if the new token0 is the same as the current token1
      const token1 = defaultedParams.get('token1')

      // Lowercases Solana addresses, which are case-sensitive, but a collision is unlikely
      if (token1?.toLowerCase() === token0.toLowerCase()) {
        switchTokens()
      }

      // Push new route
      else {
        push(
          `${pathname}?${createQueryString([
            { name: 'token0', value: token0 },
          ])}`,
          { scroll: false },
        )
      }
    },
    [
      chainId,
      createQueryString,
      defaultedParams,
      localTokenCache,
      pathname,
      push,
      switchTokens,
    ],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback<
    (_token1: string | CurrencyFor<TChainId>) => void
  >(
    (_token1) => {
      // If entity is provided, parse it to a string
      const token1 = getTokenAsString(chainId, _token1)

      if (typeof _token1 !== 'string') {
        setLocalTokenCache(localTokenCache.set(token1, _token1))
      }

      // Switch tokens if the new token0 is the same as the current token1
      const token0 = defaultedParams.get('token0')

      // Lowercases Solana addresses, which are case-sensitive, but a collision is unlikely
      if (token0?.toLowerCase() === token1.toLowerCase()) {
        switchTokens()
      }

      // Push new route
      else {
        push(
          `${pathname}?${createQueryString([
            { name: 'token1', value: token1 },
          ])}`,
          { scroll: false },
        )
      }
    },
    [
      chainId,
      createQueryString,
      defaultedParams,
      localTokenCache,
      pathname,
      push,
      switchTokens,
    ],
  )

  // Update the URL with both tokens
  const setTokens = useCallback<
    (
      _token0: string | CurrencyFor<TChainId>,
      _token1: string | CurrencyFor<TChainId>,
    ) => void
  >(
    (_token0, _token1) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(chainId, _token0)
      const token1 = getTokenAsString(chainId, _token1)

      push(
        `${pathname}?${createQueryString([
          { name: 'token0', value: token0 },
          { name: 'token1', value: token1 },
        ])}`,
        { scroll: false },
      )
    },
    [chainId, createQueryString, pathname, push],
  )

  // Update the URL with a new swapAmount
  const setSwapAmount = useCallback<(value: string) => void>(
    (value) => {
      push(
        `${pathname}?${createQueryString([
          { name: 'swapAmount', value: value },
        ])}`,
        { scroll: false },
      )
    },
    [createQueryString, pathname, push],
  )

  const token0Param = defaultedParams.get('token0') as string
  const token1Param = defaultedParams.get('token1') as string

  const token0FromLocalCache = localTokenCache.get(token0Param)
  const token1FromLocalCache = localTokenCache.get(token1Param)

  // Derive token0
  const { data: token0FromCache, isInitialLoading: token0Loading } =
    useTokenWithCache({
      chainId,
      address: token0Param as EvmAddress | SvmAddress,
      enabled: !token0FromLocalCache,
      keepPreviousData: false,
    })

  // Derive token1
  const { data: token1FromCache, isInitialLoading: token1Loading } =
    useTokenWithCache({
      chainId,
      address: token1Param as EvmAddress | SvmAddress,
      enabled: !token1FromLocalCache,
      keepPreviousData: false,
    })

  const token0 = token0FromLocalCache ?? token0FromCache
  const token1 = token1FromLocalCache ?? token1FromCache

  const Ctx = DerivedStateSimpleSwapContext as unknown as React.Context<
    State<TChainId>
  >

  return (
    <Ctx.Provider
      value={useMemo(() => {
        const swapAmountString = defaultedParams.get('swapAmount') || ''
        const _token0 = getNativeIfNativeAndWNativeSupported(
          chainId,
          token0,
          token0Param,
        )
        const _token1 = getNativeIfNativeAndWNativeSupported(
          chainId,
          token1,
          token1Param,
        )

        const recipient = (isSvmChainId(chainId)
          ? svmAddress
          : address) as AddressFor<TChainId> | undefined

        return {
          mutate: {
            setToken0,
            setToken1,
            setTokens,
            switchTokens,
            setSwapAmount,
            setTokenTax,
          },
          state: {
            recipient,
            chainId,
            swapAmountString,
            swapAmount: _token0
              ? Amount.tryFromHuman(_token0, swapAmountString)
              : undefined,
            token0: _token0,
            token1: _token1,
            tokenTax,
          },
          isLoading: token0Loading || token1Loading,
          isToken0Loading: token0Loading,
          isToken1Loading: token1Loading,
        }
      }, [
        address,
        chainId,
        defaultedParams,
        setSwapAmount,
        setToken0,
        setToken1,
        setTokens,
        switchTokens,
        svmAddress,
        token0,
        token0Loading,
        token0Param,
        token1,
        token1Loading,
        token1Param,
        tokenTax,
      ])}
    >
      {children}
    </Ctx.Provider>
  )
}

function useDerivedStateSimpleSwap<TChainId extends SupportedChainId>() {
  const Ctx = DerivedStateSimpleSwapContext as unknown as React.Context<
    State<TChainId>
  >

  const context = useContext(Ctx)
  if (!context) {
    throw new Error(
      'Hook can only be used inside Simple Swap Derived State Context',
    )
  }

  return context
}

function useEvmSimpleSwapTrade(enabled = true) {
  const {
    state: { token0, chainId, swapAmount, token1, recipient },
  } = useDerivedStateSimpleSwap<EvmChainId & SupportedChainId>()

  const [slippagePercent] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()

  const evmChainId = isEvmChainId(chainId) ? chainId : undefined
  const { data: gasPrice } = useGasPrice({ chainId: evmChainId })

  if (enabled && evmChainId) {
    throw new Error('useEvmSimpleSwapTrade is EVM-only')
  }

  const trade = useEvmTrade({
    chainId: evmChainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage: slippagePercent.toString({ fixed: 2 }),
    gasPrice,
    recipient,
    enabled: Boolean(enabled && swapAmount?.gt(ZERO)),
    carbonOffset,
  })

  return trade
}

function useEvmSimpleSwapTradeQuote() {
  const { state } = useDerivedStateSimpleSwap()

  const [slippagePercent] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()

  const evmChainId = isEvmChainId(state.chainId) ? state.chainId : undefined
  const { data: gasPrice } = useGasPrice({ chainId: evmChainId })

  const params = useMemo(() => {
    if (isEvmChainId(state.chainId)) {
      const _state = state as State<typeof state.chainId>['state']

      return {
        chainId: _state.chainId,
        fromToken: _state.token0,
        toToken: _state.token1,
        amount: _state.swapAmount,
        slippagePercentage: slippagePercent.toString({ fixed: 2 }),
        gasPrice,
        recipient: _state.recipient,
        enabled: Boolean(_state.swapAmount?.gt(ZERO)),
        carbonOffset,
      }
    }

    return undefined
  }, [state, slippagePercent, gasPrice, carbonOffset])

  return useEvmTradeQuote(params)
}

function useSvmSimpleSwapTradeQuote() {
  const { state } = useDerivedStateSimpleSwap()

  const [slippagePercent] = useSlippageTolerance()

  const params = useMemo(() => {
    if (isSvmChainId(state.chainId)) {
      const _state = state as State<SvmChainId>['state']

      return {
        chainId: _state.chainId,
        fromToken: _state.token0,
        toToken: _state.token1,
        amount: _state.swapAmount,
        slippagePercentage: slippagePercent.toString({ fixed: 2 }),
        recipient: _state.recipient,
        enabled: Boolean(_state.swapAmount?.gt(ZERO)),
      }
    }

    return undefined
  }, [state, slippagePercent])

  return useSvmTradeQuote(params)
}

function useSimpleSwapTradeQuote() {
  const { state } = useDerivedStateSimpleSwap()

  const evmQuote = useEvmSimpleSwapTradeQuote()
  const svmQuote = useSvmSimpleSwapTradeQuote()

  if (isEvmChainId(state.chainId)) {
    return evmQuote
  } else if (isSvmChainId(state.chainId)) {
    return svmQuote
  }

  throw new Error('useSimpleSwapTradeQuote: Unsupported chainId')
}

export {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
  useEvmSimpleSwapTrade,
  useEvmSimpleSwapTradeQuote,
  useSvmSimpleSwapTradeQuote,
}
