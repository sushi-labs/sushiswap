import { userBorrowLendInterest } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useUserBorrowLendInterest = ({
  address,
  startTime,
  endTime,
}: {
  address: EvmAddress | undefined
  startTime: number
  endTime?: number
}) => {
  return useQuery({
    queryKey: ['useUserBorrowLendInterest', address, startTime, endTime],
    queryFn: () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return userBorrowLendInterest(
        {
          transport: hlHttpTransport,
        },
        {
          user: address,
          startTime,
          endTime: endTime || null,
        },
      )
    },
    enabled: !!address,
  })
}

export type UserBorrowLendInterestItemType = Awaited<
  ReturnType<typeof userBorrowLendInterest>
>[number]
