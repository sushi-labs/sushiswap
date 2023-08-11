'use client'

import { isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { Amount, defaultQuoteCurrency, Native, tryParseAmount, Type } from '@sushiswap/currency'
import { useNetwork, watchNetwork } from '@sushiswap/wagmi'
import { useTokenWithCache } from '@sushiswap/wagmi/future'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createContext, FC, useCallback, useContext, useEffect, useMemo } from 'react'

const getTokenAsString = (token: Type | string) =>
  typeof token === 'string' ? token : token.isNative ? 'NATIVE' : token.wrapped.address
const getQuoteCurrency = (chainId: number) =>
  defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency].wrapped.address

interface State {
  mutate: {
    setChainId(chainId: number): void
    setToken0(token0: Type | string): void
    setToken1(token1: Type | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
  }
  state: {
    token0: Type | undefined
    token1: Type | undefined
    chainId: ChainId
    swapAmountString: string
    swapAmount: Amount<Type> | undefined
  }
  isLoading: boolean
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
const DerivedStateSimpleSwapProvider: FC<DerivedStateSimpleSwapProviderProps> = ({ children }) => {
  const { push } = useRouter()
  const { chain } = useNetwork()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)

    if (!params.has('chainId')) params.set('chainId', (chain ? chain.id : ChainId.ETHEREUM).toString())
    if (!params.has('token0')) params.set('token0', 'NATIVE')
    if (!params.has('token1')) params.set('token1', getQuoteCurrency(Number(params.get('chainId'))))

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
    [defaultedParams]
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
        { scroll: false }
      )
    },
    [createQueryString, pathname, push]
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
      if (defaultedParams.get('token1')?.toLowerCase() === token0.toLowerCase()) {
        switchTokens()
      }

      // Push new route
      else {
        push(`${pathname}?${createQueryString([{ name: 'token0', value: token0 }])}`, { scroll: false })
      }
    },
    [createQueryString, defaultedParams, pathname, push, switchTokens]
  )

  // Update the URL with a new token1
  const setToken1 = useCallback<{ (token1: string): void }>(
    (_token1) => {
      // If entity is provided, parse it to a string
      const token1 = getTokenAsString(_token1)

      // Switch tokens if the new token0 is the same as the current token1
      if (defaultedParams.get('token0')?.toLowerCase() === token1.toLowerCase()) {
        switchTokens()
      }

      // Push new route
      else {
        push(`${pathname}?${createQueryString([{ name: 'token1', value: token1 }])}`, { scroll: false })
      }
    },
    [createQueryString, defaultedParams, pathname, push, switchTokens]
  )

  // Update the URL with a new swapAmount
  const setSwapAmount = useCallback<{ (swapAmount: string): void }>(
    (swapAmount) => {
      push(`${pathname}?${createQueryString([{ name: 'swapAmount', value: swapAmount }])}`, { scroll: false })
    },
    [createQueryString, pathname, push]
  )

  // Make sure the searchParams are updated whenever a user switches networks
  useEffect(() => {
    const unwatch = watchNetwork(({ chain }) => {
      if (chain) {
        setChainId(chain.id)
      }
    })

    return () => unwatch()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Derive chainId from defaultedParams
  const chainId = Number(defaultedParams.get('chainId')) as ChainId

  // Derive token0
  const { data: token0, isInitialLoading: token0Loading } = useTokenWithCache({
    chainId,
    address: defaultedParams.get('token0') as string,
    enabled: isAddress(defaultedParams.get('token0') as string),
  })

  // Derive token1
  const { data: token1, isInitialLoading: token1Loading } = useTokenWithCache({
    chainId,
    address: defaultedParams.get('token1') as string,
    enabled: isAddress(defaultedParams.get('token1') as string),
  })

  return (
    <DerivedStateSimpleSwapContext.Provider
      value={useMemo(() => {
        const swapAmountString = defaultedParams.get('swapAmount') || ''
        const _token0 = defaultedParams.get('token0') === 'NATIVE' ? Native.onChain(chainId) : token0
        const _token1 = defaultedParams.get('token1') === 'NATIVE' ? Native.onChain(chainId) : token1

        return {
          mutate: {
            setChainId,
            setToken0,
            setToken1,
            switchTokens,
            setSwapAmount,
          },
          state: {
            chainId,
            swapAmountString,
            swapAmount: tryParseAmount(swapAmountString, _token0),
            token0: _token0,
            token1: _token1,
          },
          isLoading: token0Loading || token1Loading,
        }
      }, [
        chainId,
        defaultedParams,
        setChainId,
        setSwapAmount,
        setToken0,
        setToken1,
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
    throw new Error('Hook can only be used inside Simple Swap Derived State Context')
  }

  return context
}

export { DerivedStateSimpleSwapProvider, useDerivedStateSimpleSwap }
