import { useMemo } from 'react'
import { useQuery } from 'wagmi'
import { fetchToken, FetchTokenArgs, FetchTokenResult } from 'wagmi/actions'
import { QueryConfig, QueryFunctionArgs } from 'wagmi/dist/declarations/src/types'

export type FetchTokensArgs = { tokens: FetchTokenArgs[] }
export type FetchTokensResult = FetchTokenResult[]
export type UseTokensArgs = Partial<FetchTokensArgs>
export type UseTokensConfig = QueryConfig<FetchTokensResult, Error>

export const queryKey = ({ tokens }: Partial<FetchTokensArgs>) => {
  return (
    tokens?.map((token) => ({
      entity: 'token',
      address: token.address,
      chainId: token.chainId,
      formatUnits: token.formatUnits,
    })) || []
  )
}

const queryFn = ({ queryKey: tokens }: QueryFunctionArgs<typeof queryKey>) => {
  if (tokens.filter((el) => !el.address).length > 0) throw new Error('address is required')

  return Promise.all(
    tokens.map((token) => {
      return fetchToken({ address: token.address, chainId: token.chainId, formatUnits: token.formatUnits })
    })
  )
}

export function useTokens({
  tokens,
  cacheTime,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseTokensArgs & UseTokensConfig = {}) {
  const _enabled = useMemo(() => {
    return Boolean(tokens && tokens?.length > 0 && enabled && tokens.map((el) => el.address && el.chainId))
  }, [enabled, tokens])

  return useQuery(queryKey({ tokens }), queryFn, {
    cacheTime,
    enabled: _enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
