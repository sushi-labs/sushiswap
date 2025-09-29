import { useQuery } from '@tanstack/react-query'
import ms from 'ms'

export const useAppVersion = () => {
  return useQuery({
    queryKey: ['app-version'],
    queryFn: async () => {
      const resp = await fetch('/api/config/version')
      const { success, data } = await resp.json()

      if (!success || !data.deploymentId)
        throw new Error('Failed to fetch /api/config/version')

      return {
        server: data.deploymentId,
        client: process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID,
      }
    },
    refetchInterval: ms('5m'),
    enabled: Boolean(process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID),
  })
}
