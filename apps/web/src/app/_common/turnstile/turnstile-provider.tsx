'use client'

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import ms from 'ms'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { logger } from 'src/lib/logger'
import { validateTurnstileAction } from './validate-action'

type Provider = {
  jwt: string | undefined
  isLoading: boolean
  isError: boolean
}

export const TurnstileProviderContext = createContext<Provider>({} as Provider)

interface TurnstileProviderContextProps {
  children: React.ReactNode
}

export function TurnstileProvider({ children }: TurnstileProviderContextProps) {
  const ref = useRef<TurnstileInstance>(null)

  const {
    data: token,
    refetch: refetchToken,
    isLoading: isTokenLoading,
    isError: isTokenError,
    onError: onWidgetError,
    onSuccess: onWidgetSuccess,
  } = useTurnstileWidget(ref)

  const {
    data: jwt,
    reset: resetJwt,
    isLoading: isJwtLoading,
    isError: isJwtError,
  } = useTurnstileJwt(token)

  useEffect(() => {
    let deleteTimeout: NodeJS.Timeout
    let refetchTimeout: NodeJS.Timeout

    if (jwt) {
      const expiresAt = new Date(jwt.exp * 1000)
      const expiresIn = expiresAt.getTime() - Date.now()
      const refetchIn = expiresIn - ms('1m')

      deleteTimeout = setTimeout(() => {
        refetchToken('reset')
        resetJwt()
      }, expiresIn)
      refetchTimeout = setTimeout(() => {
        refetchToken('quiet')
      }, refetchIn)
    }

    return () => {
      if (refetchTimeout) clearTimeout(refetchTimeout)
      if (deleteTimeout) clearTimeout(deleteTimeout)
    }
  }, [jwt, refetchToken, resetJwt])

  const isLoading = isTokenLoading || isJwtLoading
  const isError = isTokenError || isJwtError

  const value = useMemo(
    () => ({ jwt: jwt?.jwt, isLoading, isError }),
    [jwt, isLoading, isError],
  )

  return (
    <>
      <Turnstile
        ref={ref}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
        onError={onWidgetError}
        onSuccess={onWidgetSuccess}
      />
      <TurnstileProviderContext.Provider value={value}>
        {children}
      </TurnstileProviderContext.Provider>
    </>
  )
}

type TurnstileWidgetParameters = Parameters<typeof Turnstile>[0]

function useTurnstileWidget(ref: React.RefObject<TurnstileInstance | null>) {
  const [token, setToken] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const onError: TurnstileWidgetParameters['onError'] = useCallback(
    (error: string) => {
      setError(new Error(error))
      setIsLoading(false)
      logger.error(error, {
        context: 'Turnstile Widget',
      })
    },
    [],
  )
  const onSuccess: TurnstileWidgetParameters['onSuccess'] = useCallback(
    (token: string) => {
      setToken(token)
      setError(null)
      setIsLoading(false)
    },
    [],
  )

  const refetch = useCallback(
    (mode: 'quiet' | 'reset') => {
      if (mode === 'reset') {
        setIsLoading(true)
      }

      ref?.current?.reset()
    },
    [ref],
  )

  return {
    data: token,
    isLoading,
    isError: !!error,
    error,
    refetch,
    onError,
    onSuccess,
  }
}

function useTurnstileJwt(token: string | null) {
  const query = useQuery({
    queryKey: ['turnstile-jwt', token],
    queryFn: async () => {
      if (!token) return

      const response = await validateTurnstileAction(token)

      if (!response.success) {
        throw new Error('Turnstile validation failed')
      }

      return response
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(token),
  })

  const queryClient = useQueryClient()

  const reset = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['turnstile-jwt'] })
  }, [queryClient])

  useEffect(() => {
    if (query.error) {
      logger.error(query.error, {
        context: 'Turnstile JWT',
      })
    }
  }, [query.error])

  return {
    ...query,
    reset,
  }
}

export function useTurnstile() {
  const context = useContext(TurnstileProviderContext)

  if (!context) {
    throw new Error('useTurnstile must be used within a TurnstileProvider')
  }

  return context
}
