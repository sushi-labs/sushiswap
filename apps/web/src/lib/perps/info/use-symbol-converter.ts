import { SymbolConverter } from '@nktkas/hyperliquid/utils'
import { useQuery } from '@tanstack/react-query'
import { hlHttpTransport } from '../transports'

export const useSymbolConverter = () => {
  return useQuery({
    queryKey: ['useSymbolConverter'],
    queryFn: () =>
      SymbolConverter.create({
        transport: hlHttpTransport,
        dexs: true,
      }),
    staleTime: Number.POSITIVE_INFINITY,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
