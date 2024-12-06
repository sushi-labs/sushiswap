import { useQuery } from '@tanstack/react-query'
import ms from 'ms'

export const useAppVersion = () => {
  return useQuery({
    queryKey: ['app-version'],
    queryFn: async () => {
      const resp = await fetch('/api/config/version')
      const { success, data } = await resp.json()

      if (!success || !data.commit)
        throw new Error('Failed to fetch /api/config/version')

      return {
        server: data.commit,
        client: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      }
    },
    refetchInterval: ms('5m'),
    enabled: Boolean(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA),
  })
}
