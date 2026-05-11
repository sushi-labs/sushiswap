import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { z } from 'zod'

const StatusIndicator = z.enum([
  'none',
  'minor',
  'major',
  'critical',
  'maintenance',
])

const StatuspageStatusSchema = z.object({
  page: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    time_zone: z.string(),
    updated_at: z.string().datetime(),
  }),
  status: z.object({
    indicator: StatusIndicator,
    description: z.string(),
  }),
})

export type StatusInidator = z.infer<typeof StatusIndicator>

export const useHlStatus = () => {
  return useQuery({
    queryKey: ['useHlStatus'],
    queryFn: async () => {
      const res = await fetch(
        'https://h20qtjygwppc.statuspage.io/api/v2/status.json',
      )
      const data = await res.json()

      const parsed = StatuspageStatusSchema.safeParse(data)
      if (!parsed.success) {
        return {
          indicator: 'critical' as const,
          description: 'Unable to fetch status',
        }
      }
      return parsed.data.status
    },
    refetchInterval: ms('10m'),
  })
}
