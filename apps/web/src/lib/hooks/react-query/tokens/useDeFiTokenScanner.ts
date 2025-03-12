import type { TokenScannerResponse } from '@sushiswap/graph-client/de.fi'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Token } from 'sushi/currency'

export const useDeFiTokenScanner = ({
  token,
  enabled = true,
}: {
  enabled?: boolean
  token?: Token
}) => {
  return useQuery({
    queryKey: ['useDeFiTokenScanner', token],
    queryFn: async () => {
      const url = new URL('/api/token-scanner', window.location.origin)
      url.searchParams.set('chainId', `${token?.chainId}`)
      url.searchParams.set('address', `${token?.address}`)

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const json = await response.json()

      return json as TokenScannerResponse
    },
    enabled: Boolean(enabled && token),
    placeholderData: keepPreviousData,
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
  })
}
