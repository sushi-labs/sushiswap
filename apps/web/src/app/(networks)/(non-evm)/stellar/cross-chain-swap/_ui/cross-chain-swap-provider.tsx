'use client'

import { nanoid } from 'nanoid'
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
import { Percent } from 'sushi'
import { getBaseTokens } from '~stellar/_common/lib/soroban/token-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'

interface State {
  mutate: {
    setToken0(token0: Token): void
    setToken1(token1: Token | undefined): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    setTradeId: Dispatch<SetStateAction<string>>
    setSlippageTolerance(slippage: Percent): void
    setRecipient(recipient: string | undefined): void
  }
  state: {
    tradeId: string
    token0: Token
    token1: Token | undefined
    swapAmountString: string
    recipient: string | undefined
    slippageTolerance: Percent
  }
}

const StellarCrossChainSwapContext = createContext<State>({} as State)

interface StellarCrossChainSwapProviderProps {
  children: React.ReactNode
}

const baseTokens = getBaseTokens()

const StellarCrossChainSwapProvider: FC<StellarCrossChainSwapProviderProps> = ({
  children,
}) => {
  const [tradeId, setTradeId] = useState(nanoid())

  const [token0, setToken0State] = useState<Token>(baseTokens[0])
  const [token1, setToken1State] = useState<Token | undefined>(undefined)
  const [swapAmountString, setSwapAmount] = useState<string>('')
  const [slippageTolerance, setSlippageTolerance] = useState<Percent>(
    new Percent({ numerator: 50, denominator: 10_000 }),
  )
  const [recipient, setRecipient] = useState<string | undefined>(undefined)

  const setToken0 = useCallback((token: Token) => {
    setToken0State(token)
  }, [])

  const setToken1 = useCallback((token: Token | undefined) => {
    setToken1State(token)
  }, [])

  const switchTokens = useCallback(() => {
    if (token1) {
      setToken0State(token1)
      setToken1State(token0)
    }
  }, [token0, token1])

  return (
    <StellarCrossChainSwapContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setToken0,
            setToken1,
            setSwapAmount,
            setTradeId,
            switchTokens,
            setSlippageTolerance,
            setRecipient,
          },
          state: {
            tradeId,
            token0,
            token1,
            swapAmountString,
            recipient,
            slippageTolerance,
          },
        }
      }, [
        token0,
        token1,
        setToken0,
        setToken1,
        swapAmountString,
        tradeId,
        slippageTolerance,
        recipient,
        switchTokens,
      ])}
    >
      {children}
    </StellarCrossChainSwapContext.Provider>
  )
}

function useStellarCrossChainSwap() {
  const context = useContext(StellarCrossChainSwapContext)
  if (!context) {
    throw new Error(
      'Hook can only be used inside Stellar CrossChain Swap Context',
    )
  }
  return context
}

export { StellarCrossChainSwapProvider, useStellarCrossChainSwap }
