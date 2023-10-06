'use client'

import { ChainId } from 'sushi/chain'
import {
  Amount,
  defaultQuoteCurrency,
  Native,
  tryParseAmount,
  Type,
} from 'sushi/currency'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { ZERO } from 'sushi'
import { useTrade as useApiTrade } from '@sushiswap/react-query'
import {
  Address,
  useAccount,
  useFeeData,
  useNetwork,
  watchNetwork,
} from '@sushiswap/wagmi'
import { useTokenWithCache } from '@sushiswap/wagmi/future'
import { useClientTrade } from '@sushiswap/wagmi/future/hooks'
import { useCarbonOffset } from 'lib/swap/useCarbonOffset'
import { useSwapApi } from 'lib/swap/useSwapApi'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLogger } from 'next-axiom'
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { isAddress } from 'viem'

import { isSwapApiEnabledChainId, SUPPORTED_CHAIN_IDS } from '../../../config'

const getTokenAsString = (token: Type | string) =>
  typeof token === 'string'
    ? token
    : token.isNative
    ? 'NATIVE'
    : token.wrapped.address
const getQuoteCurrency = (chainId: number) =>
  defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency].wrapped
    .address

interface State {
  mutate: {
    setChainId(chainId: number): void
    setToken0(token0: Type | string): void
    setToken1(token1: Type | string): void
    setTokens(token0: Type | string, token1: Type | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
  }
  state: {
    token0: Type | undefined
    token1: Type | undefined
    chainId: ChainId
    swapAmountString: string
    swapAmount: Amount<Type> | undefined
    recipient: string | undefined
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
 * /swap?chainId=1&token0=NATIVE&token1=0x6b3595068778dd592e39a122f4f5a5cf09c90fe2
 *
 * If no chainId is provided, it defaults to current connected chainId or Ethereum if wallet is not connected.
 */
const DerivedstateSimpleSwapProvider: FC<DerivedStateSimpleSwapProviderProps> =
  ({ children }) => {
    const { push } = useRouter()
    const { address } = useAccount()
    const { chain } = useNetwork()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Get the searchParams and complete with defaults.
    // This handles the case where some params might not be provided by the user
    const defaultedParams = useMemo(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (!params.has('chainId'))
        params.set(
          'chainId',
          (chain?.id && SUPPORTED_CHAIN_IDS.includes(chain.id as ChainId)
            ? chain.id
            : ChainId.ETHEREUM
          ).toString(),
        )
      if (!params.has('token0')) params.set('token0', 'NATIVE')
      if (!params.has('token1'))
        params.set('token1', getQuoteCurrency(Number(params.get('chainId'))))
      // if (!params.has('recipient')) params.set('recipient', address ?? '')
      return params
    }, [chain, searchParams])

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

    // Update the URL with a new chainId
    const setChainId = useCallback<{ (chainId: number): void }>(
      (chainId) => {
        push(
          `${pathname}?${createQueryString([
            { name: 'swapAmount', value: null },
            { name: 'chainId', value: chainId.toString() },
            { name: 'token0', value: 'NATIVE' },
            { name: 'token1', value: getQuoteCurrency(chainId) },
          ])}`,
          { scroll: false },
        )
      },
      [createQueryString, pathname, push],
    )

    // Switch token0 and token1
    const switchTokens = useCallback(() => {
      const params = new URLSearchParams(defaultedParams)
      const token0 = params.get('token0')
      const token1 = params.get('token1')

      // Can safely cast as defaultedParams are always defined
      params.set('token0', token1 as string)
      params.set('token1', token0 as string)
      if (params.has('swapAmount')) {
        params.delete('swapAmount')
      }

      push(`${pathname}?${params.toString()}`, { scroll: false })
    }, [pathname, push, defaultedParams])

    // Update the URL with a new token0
    const setToken0 = useCallback<{ (token0: string | Type): void }>(
      (_token0) => {
        // If entity is provided, parse it to a string
        const token0 = getTokenAsString(_token0)

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
      [createQueryString, defaultedParams, pathname, push, switchTokens],
    )

    // Update the URL with a new token1
    const setToken1 = useCallback<{ (token1: string | Type): void }>(
      (_token1) => {
        // If entity is provided, parse it to a string
        const token1 = getTokenAsString(_token1)

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
      [createQueryString, defaultedParams, pathname, push, switchTokens],
    )

    // Update the URL with both tokens
    const setTokens = useCallback<{
      (token0: string | Type, token1: string | Type): void
    }>(
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
    const setSwapAmount = useCallback<{ (swapAmount: string): void }>(
      (swapAmount) => {
        push(
          `${pathname}?${createQueryString([
            { name: 'swapAmount', value: swapAmount },
          ])}`,
          { scroll: false },
        )
      },
      [createQueryString, pathname, push],
    )

    // Derive chainId from defaultedParams
    const chainId = Number(defaultedParams.get('chainId')) as ChainId

    useEffect(() => {
      const unwatch = watchNetwork(({ chain }) => {
        if (!chain || chain.id === chainId) return
        push(pathname, { scroll: false })
      })
      return () => unwatch()
    }, [chainId, pathname, push])

    // Derive token0
    const { data: token0, isInitialLoading: token0Loading } = useTokenWithCache(
      {
        chainId,
        address: defaultedParams.get('token0') as string,
        enabled: isAddress(defaultedParams.get('token0') as string),
        keepPreviousData: false,
      },
    )

    // Derive token1
    const { data: token1, isInitialLoading: token1Loading } = useTokenWithCache(
      {
        chainId,
        address: defaultedParams.get('token1') as string,
        enabled: isAddress(defaultedParams.get('token1') as string),
        keepPreviousData: false,
      },
    )

    return (
      <DerivedStateSimpleSwapContext.Provider
        value={useMemo(() => {
          const swapAmountString = defaultedParams.get('swapAmount') || ''
          const _token0 =
            defaultedParams.get('token0') === 'NATIVE'
              ? Native.onChain(chainId)
              : token0
          const _token1 =
            defaultedParams.get('token1') === 'NATIVE'
              ? Native.onChain(chainId)
              : token1

          return {
            mutate: {
              setChainId,
              setToken0,
              setToken1,
              setTokens,
              switchTokens,
              setSwapAmount,
            },
            state: {
              recipient: address ?? '',
              chainId,
              swapAmountString,
              swapAmount: tryParseAmount(swapAmountString, _token0),
              token0: _token0,
              token1: _token1,
            },
            isLoading: token0Loading || token1Loading,
            isToken0Loading: token0Loading,
            isToken1Loading: token1Loading,
          }
        }, [
          address,
          chainId,
          defaultedParams,
          setChainId,
          setSwapAmount,
          setToken0,
          setToken1,
          setTokens,
          switchTokens,
          token0,
          token0Loading,
          token1,
          token1Loading,
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

const SWAP_API_BASE_URL =
  process.env.SWAP_API_V0_BASE_URL ||
  process.env.NEXT_PUBLIC_SWAP_API_V0_BASE_URL

const useFallback = (chainId: ChainId) => {
  const [swapApi] = useSwapApi()

  const initialFallbackState = useMemo(
    () =>
      !isSwapApiEnabledChainId(chainId) ||
      (isSwapApiEnabledChainId(chainId) &&
        typeof SWAP_API_BASE_URL === 'undefined'),

    [chainId],
  )

  const [isFallback, setIsFallback] = useState(initialFallbackState)

  const resetFallback = useCallback(() => {
    setIsFallback(initialFallbackState)
  }, [setIsFallback, initialFallbackState])

  return {
    isFallback: !swapApi || isFallback,
    setIsFallback,
    resetFallback,
  }
}

const useSimpleSwapTrade = () => {
  const log = useLogger()
  const {
    state: { token0, chainId, swapAmount, token1, recipient },
  } = useDerivedStateSimpleSwap()

  const { isFallback, setIsFallback, resetFallback } = useFallback(chainId)

  const [slippageTolerance] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()
  const { data: feeData } = useFeeData({ chainId })

  const apiTrade = useApiTrade({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage:
      slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice,
    recipient: recipient as Address,
    enabled: Boolean(!isFallback && swapAmount?.greaterThan(ZERO)),
    carbonOffset,
    onError: () => {
      log.error('api trade error')
      setIsFallback(true)
    },
  })

  const clientTrade = useClientTrade({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage:
      slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice,
    recipient: recipient as Address,
    enabled: Boolean(isFallback && swapAmount?.greaterThan(ZERO)),
    carbonOffset,
    onError: () => {
      log.error('client trade error')
    },
  })

  // Reset the fallback on network switch
  useEffect(() => {
    const unwatch = watchNetwork(({ chain }) => {
      if (chain) {
        resetFallback()
      }
    })

    return () => unwatch()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (isFallback ? clientTrade : apiTrade) as ReturnType<typeof useApiTrade>
}

export {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
  useSimpleSwapTrade,
}
