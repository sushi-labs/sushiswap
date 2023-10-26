'use client'

import { QueryFunction } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address, useQuery } from 'wagmi'
import { FetchTokenArgs, FetchTokenResult, fetchToken } from 'wagmi/actions'

type QueryKeyArgs = { tokens: Partial<FetchTokenArgs>[] }
// type QueryKeyConfig = {}

export type FetchTokensArgs = { tokens: FetchTokenArgs[] }
export type FetchTokensResult = FetchTokenResult[]
export type UseTokensArgs = Partial<FetchTokensArgs>
export type UseTokensConfig = Partial<Parameters<typeof useQuery>['2']>

function queryKey({ tokens }: QueryKeyArgs) {
  return [{ entity: 'tokens', tokens: tokens || [] }] as const
}

const queryFn: QueryFunction<
  FetchTokensResult,
  ReturnType<typeof queryKey>
> = ({ queryKey: [{ tokens }] }) => {
  if (!tokens) throw new Error('tokens is required')
  if (tokens.filter((el) => !el.address).length > 0)
    throw new Error('address is required')
  return Promise.all(
    tokens.map((token) => {
      return fetchToken({
        address: token.address as Address,
        chainId: token.chainId,
        formatUnits: token.formatUnits,
      })
    }),
  )
}

export function useTokens({
  tokens = [],
  cacheTime,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseTokensArgs & UseTokensConfig) {
  const _enabled = useMemo(() => {
    return Boolean(
      tokens &&
        tokens?.length > 0 &&
        enabled &&
        tokens.map((el) => el.address && el.chainId),
    )
  }, [enabled, tokens])

  return useQuery<
    FetchTokensResult,
    unknown,
    FetchTokensResult,
    ReturnType<typeof queryKey>
  >(queryKey({ tokens }), queryFn, {
    cacheTime,
    enabled: _enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
