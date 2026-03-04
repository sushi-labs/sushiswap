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
  useMemo,
  useState,
} from 'react'
import type { SupportedChainId } from 'src/config'
import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import { useNearIntentsQuote, useNearIntentsSwap } from 'src/lib/near-intents'
import {
  type NearIntentsChainId,
  isNearIntentsChainId,
} from 'src/lib/near-intents/config'
import { replaceNetworkSlug } from 'src/lib/network'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { useAccount } from 'src/lib/wallet'
import { ChainId, Percent, getChainById } from 'sushi'
import { type EvmAddress, EvmChainId, isEvmChainId } from 'sushi/evm'
import { type StellarAddress, StellarChainId } from 'sushi/stellar'
import {
  getDefaultCurrency,
  getQuoteCurrency,
} from '~evm/[chainId]/(trade)/_ui/derivedstate-swap-helpers'
import { getBaseTokens } from '~stellar/_common/lib/soroban/token-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'

type CrossChainRouteOrder = 'CHEAPEST' | 'FASTEST'

interface State {
  mutate: {
    setChainId0(chainId: NearIntentsChainId): void
    setChainId1(chainId: NearIntentsChainId): void
    setToken0(token0: Token | string): void
    setToken1(token1: CurrencyFor<EvmChainId> | string): void
    setTokens(
      token0: Token | string,
      token1: CurrencyFor<EvmChainId> | string,
    ): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    setTradeId: Dispatch<SetStateAction<string>>
    setSelectedBridge(bridge: string | undefined): void
    setRouteOrder(order: CrossChainRouteOrder): void
  }
  state: {
    tradeId: string
    token0: Token | undefined
    token1: CurrencyFor<EvmChainId> | undefined
    chainId0: StellarChainId
    chainId1: EvmChainId
    swapAmountString: string
    recipient: EvmAddress | StellarAddress | undefined
    slippageTolerance: Percent
    selectedBridge: string | undefined
    routeOrder: CrossChainRouteOrder
  }
  isToken0Loading: boolean
  isToken1Loading: boolean
}

const DerivedStateCrossChainSwapContext = createContext<State>({} as State)

interface DerivedStateCrossChainSwapProviderProps {
  children: React.ReactNode
  defaultChainId?: EvmChainId
}

const baseTokens = getBaseTokens()

const DerivedstateCrossChainSwapProvider: FC<
  DerivedStateCrossChainSwapProviderProps
> = ({ children, defaultChainId = EvmChainId.ETHEREUM }) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tradeId, setTradeId] = useState(nanoid())
  const [selectedBridge, setSelectedBridge] = useState<string | undefined>(
    undefined,
  )
  const [routeOrder, setRouteOrder] = useState<CrossChainRouteOrder>('CHEAPEST')

  // Source chain is always Stellar
  const chainId0 = StellarChainId.STELLAR

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))

    if (!params.has('chainId1'))
      params.set(
        'chainId1',
        chainId0 === StellarChainId.STELLAR
          ? ChainId.ETHEREUM.toString()
          : ChainId.STELLAR.toString(),
      )
    if (!params.has('token0')) params.set('token0', baseTokens[0].contract)
    if (!params.has('token1'))
      params.set(
        'token1',
        getQuoteCurrency(Number(params.get('chainId1')) as SupportedChainId),
      )

    return params
  }, [chainId0, searchParams])

  // Get destination chain from URL or default
  const chainId1 = useMemo(() => {
    const chainId1Param = searchParams.get('chainId1')
    if (chainId1Param) {
      const parsed = Number.parseInt(chainId1Param, 10)
      if (!Number.isNaN(parsed)) {
        return parsed as EvmChainId
      }
    }
    return defaultChainId
  }, [searchParams, defaultChainId])

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

    if (!isNearIntentsChainId(chainId1Param)) {
      console.error('Invalid chainId1:', chainId1Param)
      return
    }

    const pathSegments = pathname.split('/')
    pathSegments[1] = getChainById(chainId1Param).key

    // Can safely cast as defaultedParams are always defined
    push(
      `${replaceNetworkSlug(chainId1Param, pathname)}?${createQueryString([
        { name: 'swapAmount', value: null },
        { name: 'token0', value: token1 as string },
        { name: 'token1', value: token0 as string },
        { name: 'chainId1', value: chainId0.toString() },
      ])}`,
    )
  }, [pathname, defaultedParams, chainId0, createQueryString, push])

  // Update the URL with new from chainId
  const setChainId0 = useCallback(
    (chainId: NearIntentsChainId) => {
      if (defaultedParams.get('chainId1') === chainId.toString()) {
        switchTokens()
      } else {
        push(
          `${replaceNetworkSlug(chainId, pathname)}?${createQueryString([
            { name: 'swapAmount', value: null },
            {
              name: 'token0',
              value: baseTokens[0].contract,
            },
          ])}`,
        )
      }
    },
    [createQueryString, defaultedParams, pathname, switchTokens, push],
  )

  // Update the URL with new to chainId
  const setChainId1 = useCallback(
    (chainId: NearIntentsChainId) => {
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
    (token: Token | string) => {
      const token0 = typeof token === 'string' ? token : token.contract
      push(
        `${pathname}?${createQueryString([{ name: 'token0', value: token0 }])}`,
        { scroll: false },
      )
    },
    [pathname, createQueryString, push],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback(
    (token: CurrencyFor<EvmChainId> | string) => {
      const token1 =
        typeof token === 'string'
          ? token
          : token.isNative
            ? 'NATIVE'
            : token.address
      push(
        `${pathname}?${createQueryString([{ name: 'token1', value: token1 }])}`,
        { scroll: false },
      )
    },
    [pathname, createQueryString, push],
  )

  // Update the URL with both tokens
  const setTokens = useCallback(
    (token0: Token | string, token1: CurrencyFor<EvmChainId> | string) => {
      const _token0 = typeof token0 === 'string' ? token0 : token0.contract
      const _token1 =
        typeof token1 === 'string'
          ? token1
          : token1.isNative
            ? 'NATIVE'
            : token1.address

      push(
        `${pathname}?${createQueryString([
          { name: 'token0', value: _token0 },
          { name: 'token1', value: _token1 },
        ])}`,
        { scroll: false },
      )
    },
    [pathname, createQueryString, push],
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
    [pathname, createQueryString, push],
  )

  const token0Param = defaultedParams.get('token0') as string
  const token1Param = defaultedParams.get('token1') as string

  // Derive token0 from URL param - for Stellar, find in baseTokens
  const token0 = useMemo(() => {
    return baseTokens.find((t) => t.contract === token0Param)
  }, [token0Param])

  // Derive token1 from URL param using token cache for EVM chains
  const { data: token1Data, isInitialLoading: token1Loading } =
    useTokenWithCache({
      chainId: chainId1,
      address: token1Param as EvmAddress,
      keepPreviousData: false,
    })

  const token1 = useMemo(() => {
    if (token1Param === 'NATIVE' && isEvmChainId(chainId1)) {
      return nativeFromChainId(chainId1)
    }
    return token1Data as CurrencyFor<EvmChainId> | undefined
  }, [token1Param, chainId1, token1Data])

  const swapAmountString = defaultedParams.get('swapAmount') || ''

  const slippageTolerance = useMemo(
    () => new Percent({ numerator: 50, denominator: 10_000 }),
    [],
  )

  const recipient = useAccount(chainId1)

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
            setSwapAmount,
            setTradeId,
            switchTokens,
            setSelectedBridge,
            setRouteOrder,
          },
          state: {
            tradeId,
            token0,
            token1,
            chainId0,
            chainId1,
            swapAmountString,
            recipient,
            slippageTolerance,
            selectedBridge,
            routeOrder,
          },
          isToken0Loading: false,
          isToken1Loading: token1Loading,
        }
      }, [
        chainId0,
        chainId1,
        setChainId0,
        setChainId1,
        setToken0,
        setToken1,
        setTokens,
        setSwapAmount,
        switchTokens,
        tradeId,
        token0,
        token1,
        swapAmountString,
        recipient,
        slippageTolerance,
        selectedBridge,
        routeOrder,
        token1Loading,
      ])}
    >
      {children}
    </DerivedStateCrossChainSwapContext.Provider>
  )
}

function useDerivedStateCrossChainSwap() {
  const context = useContext(DerivedStateCrossChainSwapContext)
  if (!context) {
    throw new Error('Hook can only be used inside CrossChain Swap Context')
  }
  return context
}

function useCrossChainTradeQuote() {
  const {
    state: { swapAmountString, token0, token1, slippageTolerance },
  } = useDerivedStateCrossChainSwap()

  return useNearIntentsQuote({
    amount: swapAmountString,
    inputCurrency: token0,
    outputCurrency: token1,
    slippageTolerance,
  })
}

function useCrossChainTradeSwap() {
  const {
    state: {
      swapAmountString,
      token0,
      token1,
      chainId0,
      recipient,
      slippageTolerance,
    },
  } = useDerivedStateCrossChainSwap()

  const sender = useAccount(chainId0)

  return useNearIntentsSwap({
    inputCurrency: token0,
    outputCurrency: token1,
    amount: swapAmountString,
    slippageTolerance,
    sender,
    recipient,
  })
}

export {
  DerivedstateCrossChainSwapProvider,
  useDerivedStateCrossChainSwap,
  useCrossChainTradeQuote,
  useCrossChainTradeSwap,
}
