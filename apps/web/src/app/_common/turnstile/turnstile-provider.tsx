'use client'

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { validateTurnstileAction } from './validate-action'

type Provider = {
  jwt: string | undefined
}

export const TurnstileProviderContext = createContext<Provider>({} as Provider)

interface TurnstileProviderContextProps {
  children: React.ReactNode
}

export function TurnstileProvider({ children }: TurnstileProviderContextProps) {
  const ref = useRef<TurnstileInstance>(null)

  const [token, setToken] = useState<string | undefined>(undefined)
  const [jwt, setJwt] = useState<{ jwt: string; exp: number } | undefined>()

  const { data, error } = useQuery({
    queryKey: ['turnstile-jwt', token],
    queryFn: async () => {
      if (!token) return

      const response = await validateTurnstileAction(token)

      if (!response.success) {
        throw new Error('Turnstile validation failed')
      }

      return response
    },
    enabled: Boolean(token),
  })

  useEffect(() => {
    let deleteTimeout: NodeJS.Timeout
    let refetchTimeout: NodeJS.Timeout

    if (data) {
      setJwt(data)

      const expiresAt = new Date(data.exp * 1000)
      const expiresIn = expiresAt.getTime() - Date.now()
      const refetchIn = expiresIn - ms('1m')

      deleteTimeout = setTimeout(() => {
        setJwt(undefined)
      }, expiresIn)
      refetchTimeout = setTimeout(() => {
        ref.current?.reset()
      }, refetchIn)
    }

    return () => {
      if (refetchTimeout) clearTimeout(refetchTimeout)
      if (deleteTimeout) clearTimeout(deleteTimeout)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      console.error('Turnstile error:', error)
    }
  }, [error])

  return (
    <>
      <Turnstile
        ref={ref}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
        onError={console.error}
        onSuccess={(token) => setToken(token)}
        options={{ size: 'invisible' }}
      />
      <TurnstileProviderContext.Provider
        value={useMemo(() => ({ jwt: jwt?.jwt }), [jwt])}
      >
        {children}
      </TurnstileProviderContext.Provider>
    </>
  )
}

export function useTurnstile() {
  const context = useContext(TurnstileProviderContext)

  if (!context) {
    throw new Error('useTurnstile must be used within a TurnstileProvider')
  }

  return context
}
