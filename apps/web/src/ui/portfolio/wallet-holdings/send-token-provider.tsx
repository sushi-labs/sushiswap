'use client'

import { type FC, createContext, useContext, useMemo, useState } from 'react'
import type { Type } from 'sushi/currency'
import type { Contact } from '../../../lib/wagmi/hooks/hooks/use-contacts'

export type SendViewStep =
  | 'send'
  | 'browseContacts'
  | 'editContact'
  | 'addContact'

interface State {
  mutate: {
    setToken0(token: Type | undefined): void
    setRecipientAddress(address: string): void
    setAmount(amount: string | undefined): void
    goTo(step: SendViewStep): void
    setContactToEdit(contact: Contact | undefined): void
  }
  state: {
    token0: Type | undefined
    recipientAddress: string
    amount: string | undefined
    currentStep: SendViewStep
    contactToEdit: Contact | undefined
  }
}

const SendTokensContext = createContext<State>({} as State)

interface SendTokensProviderProps {
  children: React.ReactNode
}

const SendTokensProvider: FC<SendTokensProviderProps> = ({ children }) => {
  const [token0, setToken0] = useState<Type | undefined>(undefined)
  const [amount, setAmount] = useState<string | undefined>(undefined)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [contactToEdit, setContactToEdit] = useState<Contact | undefined>(
    undefined,
  )
  const [currentStep, setCurrentStep] = useState<SendViewStep>('send')

  const goTo = (step: SendViewStep) => {
    setCurrentStep(step)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const value = useMemo(() => {
    return {
      mutate: {
        setToken0,
        setRecipientAddress,
        setAmount,
        goTo,
        setContactToEdit,
      },
      state: {
        token0,
        recipientAddress,
        amount,
        currentStep,
        contactToEdit,
      },
    }
  }, [token0, recipientAddress, amount, currentStep, contactToEdit])

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
