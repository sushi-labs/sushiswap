'use client'

import { type FC, createContext, useContext, useMemo, useState } from 'react'
import type { Type } from 'sushi/currency'
import { isAddress } from 'viem'
import { normalize } from 'viem/ens'
import { useEnsAddress } from 'wagmi'
import type { Contact } from '../../../lib/wagmi/hooks/hooks/use-contacts'

export type SendViewStep =
  | 'send'
  | 'browseContacts'
  | 'editContact'
  | 'addContact'

interface State {
  mutate: {
    setToken0(token: Type | undefined): void
    setRawRecipientInput(address: string): void
    setAmount(amount: string | undefined): void
    goTo(step: SendViewStep): void
    setContactToEdit(contact: Contact | undefined): void
  }
  state: {
    token0: Type | undefined
    amount: string | undefined
    currentStep: SendViewStep
    contactToEdit: Contact | undefined
    resolvedRecipientAddress: string
    rawRecipientInput: string
  }
}

const SendTokensContext = createContext<State>({} as State)

interface SendTokensProviderProps {
  children: React.ReactNode
}

const SendTokensProvider: FC<SendTokensProviderProps> = ({ children }) => {
  const [token0, setToken0] = useState<Type | undefined>()
  const [amount, setAmount] = useState<string | undefined>()
  const [rawRecipientInput, setRawRecipientInput] = useState('')
  const [contactToEdit, setContactToEdit] = useState<Contact | undefined>()
  const [currentStep, setCurrentStep] = useState<SendViewStep>('send')

  const { data: resolvedAddress } = useEnsAddress({
    name: rawRecipientInput.endsWith('.eth')
      ? normalize(rawRecipientInput)
      : undefined,
    query: {
      enabled: !!rawRecipientInput.endsWith('.eth'),
    },
  })

  const resolvedRecipientAddress = useMemo(() => {
    if (isAddress(rawRecipientInput)) return rawRecipientInput
    return resolvedAddress ?? ''
  }, [rawRecipientInput, resolvedAddress])

  const value = useMemo(() => {
    const goTo = (step: SendViewStep) => {
      setCurrentStep(step)
    }

    return {
      mutate: {
        setToken0,
        setRawRecipientInput,
        setAmount,
        goTo,
        setContactToEdit,
      },
      state: {
        token0,
        resolvedRecipientAddress,
        rawRecipientInput,
        amount,
        currentStep,
        contactToEdit,
      },
    }
  }, [
    token0,
    resolvedRecipientAddress,
    rawRecipientInput,
    amount,
    currentStep,
    contactToEdit,
  ])

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
