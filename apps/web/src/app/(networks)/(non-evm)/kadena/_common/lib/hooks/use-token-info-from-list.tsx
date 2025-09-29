import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { KvmToken, KvmTokenAddress } from 'sushi/kvm'
import { getKadenaBaseTokens } from './use-base-tokens'

export const useTokenInfoFromList = ({
  tokenAddress,
  enabled = true,
}: {
  tokenAddress: string | undefined
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['kadena-token-info-static', tokenAddress],
    queryFn: async (): Promise<KvmToken | null> => {
      if (!tokenAddress) return null

      console.log('useTokenInfoFromList tokenAddress', tokenAddress)

      const tokens = await getKadenaBaseTokens()
      console.log('useTokenInfoFromList tokens', tokens)
      const found = tokens.find(
        (t) => t.name === (tokenAddress as KvmTokenAddress),
      )

      console.log('useTokenInfoFromList found', found)
      return found ?? null
    },
    enabled: Boolean(tokenAddress && enabled),
    staleTime: ms('5m'), // cache token list lookups longer than 30s
  })
}
