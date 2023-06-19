'use client'

import React, { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { Signature } from '@ethersproject/bytes'

type CheckerContext = {
  state: Record<string, boolean>
  signatureState: Record<string, Signature | undefined>
  setApproved: (tag: string, approved: boolean) => void
  setSignature: (tag: string, signature: Signature | undefined) => void
}

const CheckerContext = createContext<CheckerContext | undefined>(undefined)

export interface ProviderProps {
  children: ReactNode
}

export const CheckerProvider: FC<ProviderProps> = ({ children }) => {
  const [state, setState] = useState<Record<string, boolean>>({})
  const [signatureState, setSignatureState] = useState<Record<string, Signature | undefined>>({})

  const setApproved = useCallback((tag: string, approved: boolean) => {
    setState((prevState) => ({
      ...prevState,
      [tag]: approved,
    }))
  }, [])

  const setSignature = useCallback((tag: string, signature: Signature | undefined) => {
    setSignatureState((prevState) => ({
      ...prevState,
      [tag]: signature,
    }))
  }, [])

  return (
    <CheckerContext.Provider
      value={useMemo(
        () => ({ setApproved, state, signatureState, setSignature }),
        [setApproved, setSignature, signatureState, state]
      )}
    >
      {children}
    </CheckerContext.Provider>
  )
}

export const useCheckerContext = () => useContext(CheckerContext)

export const useApproved = (tag: string) => {
  const context = useCheckerContext()
  if (!context) {
    throw new Error('Hook can only be used inside Checker Context')
  }

  return useMemo(
    () => ({
      approved: context.state[tag] ? context.state[tag] : false,
      setApproved: (approved: boolean) => context.setApproved(tag, approved),
    }),
    [context, tag]
  )
}

export const useSignature = (tag: string) => {
  const context = useCheckerContext()
  if (!context) {
    throw new Error('Hook can only be used inside Checker Context')
  }

  return useMemo(
    () => ({
      signature: context.signatureState[tag] ? context.signatureState[tag] : undefined,
      setSignature: (signature: Signature | undefined) => context.setSignature(tag, signature),
    }),
    [context, tag]
  )
}

// HOC component
// useful for when the useApproved hook and the Checker.Success component are in the same component
export const withCheckerRoot = <P extends object>(Component: React.FunctionComponent<P>): FC<P> =>
  function WithCheckerRootComponent(props: P) {
    return (
      <CheckerProvider>
        <Component {...props} />
      </CheckerProvider>
    )
  }
