import { useQuery } from '@tanstack/react-query'
import ms from 'ms'

const clientCommit = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA

export const useAppVersion = () => {
  return useQuery({
    queryKey: ['app-version'],
    queryFn: async () => {
      const resp = await fetch('/api/config/version', { cache: 'no-store' })
      const { success, data } = await resp.json()

      if (!success || !data.commit)
        throw new Error('Failed to fetch /api/config/version')

      return {
        server: data.commit,
        client: clientCommit,
      }
    },
    refetchInterval: ms('5m'),
    enabled: Boolean(clientCommit),
  })
}
