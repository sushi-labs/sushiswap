import { marginTable } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { hlHttpTransport } from '../transports'

export const useMarginTable = ({
  marginTableId,
}: {
  marginTableId: number | undefined
}) => {
  return useQuery({
    queryKey: ['useMarginTable', marginTableId],
    queryFn: async () => {
      if (marginTableId === undefined) {
        throw new Error('marginTableId is undefined')
      }
      return await marginTable(
        {
          transport: hlHttpTransport,
        },
        {
          id: marginTableId,
        },
      )
    },
    enabled: !!marginTableId,
  })
}
