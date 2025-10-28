'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import Script from 'next/script'
import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { validateTurnstileAction } from './validate-action'

declare global {
  interface Window {
    turnstile: {
      execute: (widgetId: string, options?: any) => void
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          theme?: 'light' | 'dark'
          size?: 'normal' | 'compact' | 'invisible'
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          tabindex?: number
          action?: string
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
      ready: (callback: () => void) => void
    }
  }
}

type Provider = {
  jwt: string | undefined
}

export const TurnstileProviderContext = createContext<Provider>({} as Provider)

interface TurnstileProviderContextProps {
  children: React.ReactNode
}

export function TurnstileProvider({ children }: TurnstileProviderContextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [jwt, setJwt] = useState<{ jwt: string; exp: number } | undefined>()

  const [turnstileReady, setTurnstileReady] = useState(false)

  const { data, refetch, error } = useQuery({
    queryKey: ['turnstile-jwt'],
    queryFn: async () => {
      if (!ref.current) return

      console.log('Rendering', Date.now())

      let widgetId: string

      const token = await new Promise<string>((resolve) => {
        widgetId = window.turnstile.render(ref.current!, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
          size: 'invisible',
          callback: (token) => {
            resolve(token)
          },
        })
        window.turnstile.execute(widgetId!, {
          callback: (token: string) => {
            console.log('Executed', Date.now())
            resolve(token)
          },
        })
      })

      console.log('Got token', Date.now())

      const response = await validateTurnstileAction(token)

      if (!response.success) {
        throw new Error('Turnstile validation failed')
      }

      console.log('Fetched', Date.now())

      return response
    },
    enabled: Boolean(turnstileReady && ref.current),
    // retry: true,
    // retryDelay: 1000,
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
        refetch()
      }, refetchIn)
    }

    return () => {
      if (refetchTimeout) clearTimeout(refetchTimeout)
      if (deleteTimeout) clearTimeout(deleteTimeout)
    }
  }, [data, refetch])

  useEffect(() => {
    if (error) {
      setJwt({ jwt: 'fallback', exp: 0 })
    }
  }, [error])

  const onLoadCallback = useCallback(() => {
    setTurnstileReady(true)
    console.log('Turnstile script loaded', Date.now())
  }, [])

  console.log('Loading scripts', Date.now())

  return (
    <>
      <div ref={ref} />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        defer
        onLoad={onLoadCallback}
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
