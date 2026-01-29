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
import { useTrade, useTradeQuote } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { useCarbonOffset } from 'src/lib/swap/useCarbonOffset'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { Amount, Native, type Percent, ZERO } from 'sushi'
import {
  EvmChainId,
  type EvmCurrency,
  EvmNative,
  defaultCurrency,
  defaultQuoteCurrency,
  isEvmWNativeSupported,
} from 'sushi/evm'
import { type Address, isAddress } from 'viem'
import { useConnection, useGasPrice } from 'wagmi'

const getTokenAsString = (token: EvmCurrency | string) =>
  typeof token === 'string'
    ? token
    : token.type === 'native'
      ? 'NATIVE'
      : token.wrap().address
const getDefaultCurrency = (chainId: number) =>
  getTokenAsString(defaultCurrency[chainId as keyof typeof defaultCurrency])
const getQuoteCurrency = (chainId: number) =>
  getTokenAsString(
    defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency],
  )

interface State {
  mutate: {
    setToken0(token0: EvmCurrency | string): void
    setToken1(token1: EvmCurrency | string): void
    setTokens(token0: EvmCurrency | string, token1: EvmCurrency | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    setTokenTax(tax: Percent | false | undefined): void
  }
  state: {
    token0: EvmCurrency | undefined
    token1: EvmCurrency | undefined
    chainId: EvmChainId
    swapAmountString: string
    swapAmount: Amount<EvmCurrency> | undefined
    recipient: Address | undefined
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
const DerivedstateSimpleSwapProvider: FC<
  DerivedStateSimpleSwapProviderProps
> = ({ children }) => {
  const { push } = useRouter()
  const { chainId: _chainId } = useParams()
  const { address } = useConnection()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tokenTax, setTokenTax] = useState<Percent | false | undefined>(
    undefined,
  )
  const [localTokenCache, setLocalTokenCache] = useState<
    Map<string, EvmCurrency>
  >(new Map())

  const chainId =
    _chainId && isSupportedChainId(+_chainId)
      ? (+_chainId as SupportedChainId)
      : EvmChainId.ETHEREUM

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
  const setToken0 = useCallback<(_token0: string | EvmCurrency) => void>(
    (_token0) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(_token0)

      if (typeof _token0 !== 'string') {
        setLocalTokenCache(localTokenCache.set(token0, _token0))
      }

      // Switch tokens if the new token0 is the same as the current token1
      if (
        defaultedParams.get('token1')?.toLowerCase() === token0.toLowerCase()
      ) {
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
      createQueryString,
      defaultedParams,
      localTokenCache,
      pathname,
      push,
      switchTokens,
    ],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback<(_token1: string | EvmCurrency) => void>(
    (_token1) => {
      // If entity is provided, parse it to a string
      const token1 = getTokenAsString(_token1)

      if (typeof _token1 !== 'string') {
        setLocalTokenCache(localTokenCache.set(token1, _token1))
      }

      // Switch tokens if the new token0 is the same as the current token1
      if (
        defaultedParams.get('token0')?.toLowerCase() === token1.toLowerCase()
      ) {
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
    (_token0: string | EvmCurrency, _token1: string | EvmCurrency) => void
  >(
    (_token0, _token1) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(_token0)
      const token1 = getTokenAsString(_token1)

      push(
        `${pathname}?${createQueryString([
          { name: 'token0', value: token0 },
          { name: 'token1', value: token1 },
        ])}`,
        { scroll: false },
      )
    },
    [createQueryString, pathname, push],
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
      address: token0Param as Address,
      enabled:
        isAddress(token0Param, { strict: false }) && !token0FromLocalCache,
      keepPreviousData: false,
    })

  // Derive token1
  const { data: token1FromCache, isInitialLoading: token1Loading } =
    useTokenWithCache({
      chainId,
      address: token1Param as Address,
      enabled:
        isAddress(token1Param, { strict: false }) && !token1FromLocalCache,
      keepPreviousData: false,
    })

  const token0 = token0FromLocalCache ?? token0FromCache
  const token1 = token1FromLocalCache ?? token1FromCache

  return (
    <DerivedStateSimpleSwapContext.Provider
      value={useMemo(() => {
        const swapAmountString = defaultedParams.get('swapAmount') || ''
        const _token0 =
          defaultedParams.get('token0') === 'NATIVE' &&
          isEvmWNativeSupported(chainId)
            ? EvmNative.fromChainId(chainId)
            : token0
        const _token1 =
          defaultedParams.get('token1') === 'NATIVE' &&
          isEvmWNativeSupported(chainId)
            ? EvmNative.fromChainId(chainId)
            : token1

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
            recipient: address,
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
        token0,
        token0Loading,
        token1,
        token1Loading,
        tokenTax,
      ])}
    >
      {children}
    </DerivedStateSimpleSwapContext.Provider>
  )
}

const useDerivedStateSimpleSwap = () => {
  const context = useContext(DerivedStateSimpleSwapContext)
  if (!context) {
    throw new Error(
      'Hook can only be used inside Simple Swap Derived State Context',
    )
  }

  return context
}

const useSimpleSwapTrade = (enabled = true) => {
  const {
    state: { token0, chainId, swapAmount, token1, recipient },
  } = useDerivedStateSimpleSwap()

  const [slippagePercent] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()
  const { data: gasPrice } = useGasPrice({ chainId })

  const trade = useTrade({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage: slippagePercent.toString({ fixed: 2 }),
    gasPrice,
    recipient: recipient as Address,
    enabled: Boolean(enabled && swapAmount?.gt(ZERO)),
    carbonOffset,
  })

  return trade
}

const useSimpleSwapTradeQuote = () => {
  const {
    state: { token0, chainId, swapAmount, token1, recipient },
  } = useDerivedStateSimpleSwap()

  const [slippagePercent] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()
  const { data: gasPrice } = useGasPrice({ chainId })

  const quote = useTradeQuote({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage: slippagePercent.toString({ fixed: 2 }),
    gasPrice,
    recipient: recipient as Address,
    enabled: Boolean(swapAmount?.gt(ZERO)),
    carbonOffset,
  })

  return quote
}

export {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
  useSimpleSwapTrade,
  useSimpleSwapTradeQuote,
}
