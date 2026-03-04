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
import { useNearIntentsQuote, useNearIntentsSwap } from 'src/lib/near-intents'
import {
  type NearIntentsChainId,
  isNearIntentsChainId,
} from 'src/lib/near-intents/config'
import { replaceNetworkSlug } from 'src/lib/network'
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
    setToken0(token0: Token): void
    setToken1(token1: CurrencyFor<EvmChainId> | undefined): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    setTradeId: Dispatch<SetStateAction<string>>
    setSelectedBridge(bridge: string | undefined): void
    setRouteOrder(order: CrossChainRouteOrder): void
  }
  state: {
    tradeId: string
    token0: Token
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
    if (!params.has('token0'))
      params.set(
        'token0',
        isEvmChainId(chainId0)
          ? getDefaultCurrency(chainId0)
          : baseTokens[0].contract,
      )
    if (!params.has('token1'))
      params.set(
        'token1',
        isEvmChainId(Number(params.get('chainId1')))
          ? getQuoteCurrency(Number(params.get('chainId1')) as SupportedChainId)
          : baseTokens[1].contract,
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

  const [token0, setToken0State] = useState<Token>(baseTokens[0])
  const [token1, setToken1State] = useState<
    CurrencyFor<EvmChainId> | undefined
  >(undefined)
  const [swapAmountString, setSwapAmountString] = useState<string>(
    () => searchParams.get('swapAmount') || '',
  )
  const [slippageTolerance, setSlippageTolerance] = useState<Percent>(
    new Percent({ numerator: 50, denominator: 10_000 }),
  )
  const [selectedBridge, setSelectedBridge] = useState<string | undefined>(
    undefined,
  )
  const [routeOrder, setRouteOrder] = useState<CrossChainRouteOrder>('CHEAPEST')

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
              value: getDefaultCurrency(chainId0 as SupportedChainId),
            },
          ])}`,
        )
      }
    },
    [
      createQueryString,
      defaultedParams,
      pathname,
      switchTokens,
      chainId0,
      push,
    ],
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

  const setToken0 = useCallback((token: Token) => {
    setToken0State(token)
  }, [])

  const setToken1 = useCallback(
    (token: CurrencyFor<EvmChainId> | undefined) => {
      setToken1State(token)
    },
    [],
  )

  const setSwapAmount = useCallback(
    (amount: string) => {
      setSwapAmountString(amount)
      // Update URL
      const params = new URLSearchParams(searchParams.toString())
      if (amount) {
        params.set('swapAmount', amount)
      } else {
        params.delete('swapAmount')
      }
      window.history.replaceState(null, '', `?${params.toString()}`)
    },
    [searchParams],
  )

  const recipient = useAccount(chainId1)
  const value = useMemo(() => {
    return {
      mutate: {
        setChainId0,
        setChainId1,
        setToken0,
        setToken1,
        setSwapAmount,
        setTradeId,
        switchTokens,
        setSlippageTolerance,
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
      isToken1Loading: false,
    }
  }, [
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
    setChainId0,
    setChainId1,
    setToken0,
    setToken1,
    setSwapAmount,
    switchTokens,
  ])

  return (
    <DerivedStateCrossChainSwapContext.Provider value={value}>
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
      slippageTolerance,
      chainId0,
      recipient,
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
