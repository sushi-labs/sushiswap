import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import type { LayerZeroChainId } from 'src/lib/swap/layerzero/config'
import { z } from 'zod'

const responseSchema = z.object({
  estimatedSeconds: z.number().int().positive().nullable(),
})

export function useLayerZeroArrivalEstimate(
  fromChainId: LayerZeroChainId,
  toChainId: LayerZeroChainId,
): UseQueryResult<z.infer<typeof responseSchema>, Error> {
  return useQuery({
    queryKey: ['layerzero-arrival-estimate', fromChainId, toChainId],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        fromChainId: String(fromChainId),
        toChainId: String(toChainId),
      })
      const response = await fetch(
        `/api/cross-chain/layerzero/arrival-estimate?${params}`,
        { signal },
      )
      if (!response.ok) throw new Error('LayerZero timing unavailable')
      return responseSchema.parse(await response.json())
    },
    staleTime: 300_000,
    refetchInterval: 300_000,
    retry: false,
  })
}
