'use client'

import { nanoid } from 'nanoid'
import { useSearchParams } from 'next/navigation'
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
import { useNearIntentsQuote, useNearIntentsSwap } from 'src/lib/near-intents'
import { useAccount } from 'src/lib/wallet'
import { Percent } from 'sushi'
import { type EvmAddress, EvmChainId } from 'sushi/evm'
import { type StellarAddress, StellarChainId } from 'sushi/stellar'
import { getBaseTokens } from '~stellar/_common/lib/soroban/token-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'

type CrossChainRouteOrder = 'CHEAPEST' | 'FASTEST'

interface State {
  mutate: {
    setChainId0(chainId: StellarChainId): void
    setChainId1(chainId: EvmChainId): void
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
  const searchParams = useSearchParams()
  const [tradeId, setTradeId] = useState(nanoid())

  // Source chain is always Stellar
  const chainId0 = StellarChainId.STELLAR

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

  const setChainId0 = useCallback((_chainId: StellarChainId) => {
    // chainId0 is always Stellar, no-op
  }, [])

  const setChainId1 = useCallback(
    (chainId: EvmChainId) => {
      // Update URL with new destination chain
      const params = new URLSearchParams(searchParams.toString())
      params.set('chainId1', chainId.toString())
      window.history.replaceState(null, '', `?${params.toString()}`)
    },
    [searchParams],
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

  const switchTokens = useCallback(() => {
    // Cannot switch - token0 is Stellar, token1 is EVM
    // This is a no-op for cross-chain swaps from Stellar
  }, [])
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
