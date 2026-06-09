import { borrowLendUserState } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useBorrowLendUserState = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useBorrowLendUserState', address],
    queryFn: () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return borrowLendUserState(
        {
          transport: hlHttpTransport,
        },
        {
          user: address,
        },
      )
    },
    enabled: !!address,
  })
}
