import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

const responseSchema = z.object({
  success: z.boolean(),
  data: z.object({ maintenance: z.boolean() }).optional(),
})

export function useIsLayerZeroXSwapMaintenance() {
  return useQuery({
    queryKey: ['layerzero-cross-chain-swap-maintenance'],
    queryFn: async () => {
      const response = await fetch('/api/config/layerzero-xswap', {
        cache: 'no-store',
      })
      const data = responseSchema.parse(await response.json())
      return data.success && Boolean(data.data?.maintenance)
    },
    initialData: false,
    refetchInterval: 60_000,
  })
}
