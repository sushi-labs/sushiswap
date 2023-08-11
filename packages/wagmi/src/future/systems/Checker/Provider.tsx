'use client'

import React, { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Signature } from 'viem'

import { watchAccount } from '../../../actions'

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

interface State {
  state: Record<string, boolean>
  signatureState: Record<string, Signature | undefined>
}

const initialState = { state: {}, signatureState: {} }

export const CheckerProvider: FC<ProviderProps> = ({ children }) => {
  const [{ state, signatureState }, setState] = useState<State>(initialState)

  const setApproved = useCallback((tag: string, approved: boolean) => {
    setState((prevState) => ({
      ...prevState,
      state: {
        ...prevState.state,
        [tag]: approved,
      },
    }))
  }, [])

  const setSignature = useCallback((tag: string, signature: Signature | undefined) => {
    setState((prevState) => ({
      ...prevState,
      signatureState: {
        ...prevState.signatureState,
        [tag]: signature,
      },
    }))
  }, [])

  // Reset state when address/wallet changes
  useEffect(() => {
    const unwatchAccountListener = watchAccount(() => setState(initialState))
    const unwatchChainListener = watchNetwork(() => setState(initialState))

    return () => {
      unwatchAccountListener()
      unwatchChainListener()
    }
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
