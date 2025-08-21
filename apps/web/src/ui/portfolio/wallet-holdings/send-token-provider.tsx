'use client'

import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { Type } from 'sushi/currency'

interface State {
  mutate: {
    setToken0(token: Type | undefined): void
    setRecipientAddress(address: string): void
    setAmount(amount: string | undefined): void
  }
  state: {
    token0: Type | undefined
    recipientAddress: string
    amount: string | undefined
  }
}

const SendTokensContext = createContext<State>({} as State)

interface SendTokensProviderProps {
  children: React.ReactNode
  initialToken0?: Type
  initialRecipientAddress?: string
}

const SendTokensProvider: FC<SendTokensProviderProps> = ({
  children,
  initialToken0,
  initialRecipientAddress = '',
}) => {
  const [token0, setToken0] = useState<Type | undefined>(initialToken0)
  const [amount, setAmount] = useState<string | undefined>(undefined)
  const [recipientAddress, setRecipientAddress] = useState(
    initialRecipientAddress,
  )

  const value = useMemo(() => {
    return {
      mutate: {
        setToken0,
        setRecipientAddress,
        setAmount,
      },
      state: {
        token0,
        recipientAddress,
        amount,
      },
    }
  }, [token0, recipientAddress, amount])

  return (
    <SendTokensContext.Provider value={value}>
      {children}
    </SendTokensContext.Provider>
  )
}

const useSendTokens = () => {
  const context = useContext(SendTokensContext)
  if (!context) {
    throw new Error('useSendTokens must be used within a SendTokensProvider')
  }
  return context
}

export { SendTokensProvider, useSendTokens }
