import { spotMeta } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { hlHttpTransport } from '../transports'

export const useSpotMeta = () => {
  return useQuery({
    queryKey: ['spot-meta'],
    queryFn: async () => {
      return await spotMeta({
        transport: hlHttpTransport,
      })
    },
  })
}
