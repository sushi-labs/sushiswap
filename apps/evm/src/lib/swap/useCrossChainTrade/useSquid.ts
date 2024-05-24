'use client'

import { useQuery } from '@tanstack/react-query'
import { SquidIntegratorId } from 'sushi/config'

export const useSquid = () => {
  return useQuery({
    queryKey: ['squid'],
    queryFn: async () => {
      const Squid = await import('@0xsquid/sdk').then((m) => m.Squid)

      const squid = new Squid({
        baseUrl: 'https://apiplus.squidrouter.com/',
        integratorId: SquidIntegratorId,
      })

      await squid.init()

      return squid
    },
    refetchInterval: Infinity,
  })
}
