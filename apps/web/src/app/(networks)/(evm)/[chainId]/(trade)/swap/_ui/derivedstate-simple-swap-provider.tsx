'use client'

import type { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type SupportedChainId, isSupportedChainId } from 'src/config'
import type { DirectPool } from 'src/lib/swap/direct-pool'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/use-token-with-cache'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { Amount, type Percent } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { isSvmChainId } from 'sushi/svm'
import { useConnection } from 'wagmi'
import {
  getDefaultCurrency,
  getNativeIfNativeAndWNativeSupported,
  getQuoteCurrency,
  getTokenAsString,
} from '../../_ui/derivedstate-swap-helpers'

interface SlippageToleranceOptions {
  storageKey?: SlippageToleranceStorageKey
  defaultValue?: string
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
    fee: number | undefined
    directPool: DirectPool | undefined
    slippageToleranceOptions: SlippageToleranceOptions | undefined
  }
  isLoading: boolean
  isToken0Loading: boolean
  isToken1Loading: boolean
}

const DerivedStateSimpleSwapContext = createContext<State>({} as State)

interface DerivedStateSimpleSwapProviderProps<
  TChainId extends SupportedChainId = SupportedChainId,
> {
  children: React.ReactNode
  chainId?: TChainId
  token0?: CurrencyFor<TChainId>
  token1?: CurrencyFor<TChainId>
  initialSwapAmount?: string
  persistToUrl?: boolean
  fee?: number
  directPool?: DirectPool
  slippageToleranceOptions?: SlippageToleranceOptions
}

/* Provides chain, token, and amount state from the URL by default.
 * Embedded widgets can provide initial values and opt out of URL persistence.
 */
function DerivedstateSimpleSwapProvider<
  TChainId extends SupportedChainId = SupportedChainId,
>({
  children,
  chainId: providedChainId,
  token0: initialToken0,
  token1: initialToken1,
  initialSwapAmount,
  persistToUrl = true,
  fee,
  directPool,
  slippageToleranceOptions,
}: DerivedStateSimpleSwapProviderProps<TChainId>) {
  const { chainId: routeChainId } = useParams()
  const { address } = useConnection()
  const svmAddress = useAccount('svm')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tokenTax, setTokenTax] = useState<Percent | false | undefined>(
    undefined,
  )

  const chainId = (
    providedChainId && isSupportedChainId(providedChainId)
      ? providedChainId
      : routeChainId && isSupportedChainId(+routeChainId)
        ? +routeChainId
        : EvmChainId.ETHEREUM
  ) as TChainId

  const [localTokenCache, setLocalTokenCache] = useState<
    Map<string, CurrencyFor<TChainId>>
  >(() => {
    const cache = new Map<string, CurrencyFor<TChainId>>()
    if (initialToken0) {
      cache.set(getTokenAsString(chainId, initialToken0), initialToken0)
    }
    if (initialToken1) {
      cache.set(getTokenAsString(chainId, initialToken1), initialToken1)
    }
    return cache
  })
  const [localSearchParams, setLocalSearchParams] = useState(() => {
    const params = new URLSearchParams()
    if (initialToken0) {
      params.set('token0', getTokenAsString(chainId, initialToken0))
    }
    if (initialToken1) {
      params.set('token1', getTokenAsString(chainId, initialToken1))
    }
    if (initialSwapAmount) {
      params.set('swapAmount', initialSwapAmount)
    }
    return params
  })

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(
      persistToUrl ? searchParams : localSearchParams,
    )

    if (!params.has('token0')) {
      params.set('token0', getDefaultCurrency(chainId))
    }
    if (!params.has('token1')) {
      params.set('token1', getQuoteCurrency(chainId))
    }
    return params
  }, [chainId, localSearchParams, persistToUrl, searchParams])

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

  const updateSearchParams = useCallback(
    (values: { name: string; value: string | null }[]) => {
      if (persistToUrl) {
        history.pushState(null, '', `${pathname}?${createQueryString(values)}`)
        return
      }

      setLocalSearchParams((current) => {
        const params = new URLSearchParams(current)
        values.forEach(({ name, value }) => {
          if (value === null) {
            params.delete(name)
          } else {
            params.set(name, value)
          }
        })
        return params
      })
    },
    [createQueryString, pathname, persistToUrl],
  )

  // Switch token0 and token1
  const switchTokens = useCallback(() => {
    // console.log('switchTokens', {
    //   token0: defaultedParams.get('token1'),
    //   token1: defaultedParams.get('token0'),
    // })
    updateSearchParams([
      { name: 'swapAmount', value: null },
      { name: 'token0', value: defaultedParams.get('token1') as string },
      { name: 'token1', value: defaultedParams.get('token0') as string },
    ])
  }, [defaultedParams, updateSearchParams])

  // Update the URL with a new token0
  const setToken0 = useCallback<
    (_token0: string | CurrencyFor<TChainId>) => void
  >(
    (_token0) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(chainId, _token0)

      if (typeof _token0 !== 'string') {
        setLocalTokenCache((current) => {
          const next = new Map(current)
          next.set(token0, _token0)
          return next
        })
      }

      // Switch tokens if the new token0 is the same as the current token1
      const token1 = defaultedParams.get('token1')

      // Lowercases Solana addresses, which are case-sensitive, but a collision is unlikely
      if (token1?.toLowerCase() === token0.toLowerCase()) {
        switchTokens()
      }

      // Push new route
      else {
        updateSearchParams([{ name: 'token0', value: token0 }])
      }
    },
    [chainId, defaultedParams, switchTokens, updateSearchParams],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback<
    (_token1: string | CurrencyFor<TChainId>) => void
  >(
    (_token1) => {
      // If entity is provided, parse it to a string
      const token1 = getTokenAsString(chainId, _token1)

      if (typeof _token1 !== 'string') {
        setLocalTokenCache((current) => {
          const next = new Map(current)
          next.set(token1, _token1)
          return next
        })
      }

      // Switch tokens if the new token0 is the same as the current token1
      const token0 = defaultedParams.get('token0')

      // Lowercases Solana addresses, which are case-sensitive, but a collision is unlikely
      if (token0?.toLowerCase() === token1.toLowerCase()) {
        switchTokens()
      }

      // Push new route
      else {
        updateSearchParams([{ name: 'token1', value: token1 }])
      }
    },
    [chainId, defaultedParams, switchTokens, updateSearchParams],
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

      setLocalTokenCache((current) => {
        const next = new Map(current)
        if (typeof _token0 !== 'string') {
          next.set(token0, _token0)
        }
        if (typeof _token1 !== 'string') {
          next.set(token1, _token1)
        }
        return next
      })

      updateSearchParams([
        { name: 'token0', value: token0 },
        { name: 'token1', value: token1 },
      ])
    },
    [chainId, updateSearchParams],
  )

  // Update the URL with a new swapAmount
  const setSwapAmount = useCallback<(value: string) => void>(
    (value) => {
      updateSearchParams([{ name: 'swapAmount', value: value || null }])
    },
    [updateSearchParams],
  )

  const token0Param = defaultedParams.get('token0') as string
  const token1Param = defaultedParams.get('token1') as string

  const token0FromLocalCache = localTokenCache.get(token0Param)
  const token1FromLocalCache = localTokenCache.get(token1Param)

  // Derive token0
  const { data: token0FromCache, isInitialLoading: token0Loading } =
    useTokenWithCache({
      chainId,
      address: token0Param as AddressFor<TChainId>,
      enabled: !token0FromLocalCache,
      keepPreviousData: false,
    })

  // Derive token1
  const { data: token1FromCache, isInitialLoading: token1Loading } =
    useTokenWithCache({
      chainId,
      address: token1Param as AddressFor<TChainId>,
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

        const recipient = (isSvmChainId(chainId) ? svmAddress : address) as
          | AddressFor<TChainId>
          | undefined

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
            fee,
            directPool,
            slippageToleranceOptions,
          },
          isLoading: token0Loading || token1Loading,
          isToken0Loading: token0Loading,
          isToken1Loading: token1Loading,
        }
      }, [
        address,
        chainId,
        defaultedParams,
        directPool,
        fee,
        slippageToleranceOptions,
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

export { DerivedstateSimpleSwapProvider, useDerivedStateSimpleSwap }
export {
  useSimpleSwapTradeQuote,
  useEvmSimpleSwapTradeQuote,
  useSvmSimpleSwapTradeQuote,
} from './simple-swap-trade-quote-context'
