import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useRef } from 'react'

export const useAppVersion = () => {
  const commitRef = useRef<string | null>(null)

  return useQuery({
    queryKey: ['app-version'],
    queryFn: async () => {
      const resp = await fetch('/api/config/version')
      const { success, data } = await resp.json()

      if (!success || !data.commit)
        throw new Error('Failed to fetch /api/config/version')

      if (commitRef.current === null) commitRef.current = data.commit

      return {
        server: data.commit,
        client: commitRef.current as string,
      }
    },
    refetchInterval: ms('1m'),
  })
}
