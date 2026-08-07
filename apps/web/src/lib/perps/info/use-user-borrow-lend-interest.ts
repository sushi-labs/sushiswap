import { userBorrowLendInterest } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useUserBorrowLendInterest = ({
  address,
  startTime,
  endTime,
  isViewAll = false,
  enabled = true,
}: {
  address: EvmAddress | undefined
  startTime?: number
  endTime?: number
  isViewAll?: boolean
  enabled?: boolean
}) => {
  const queryStartTime = isViewAll ? 0 : startTime

  return useQuery({
    queryKey: [
      'useUserBorrowLendInterest',
      address,
      queryStartTime,
      endTime,
      isViewAll,
    ],
    queryFn: ({ signal }) => {
      if (!address) {
        throw new Error('address is undefined')
      }
      if (queryStartTime === undefined) {
        throw new Error('startTime is undefined')
      }

      return userBorrowLendInterest(
        {
          transport: hlHttpTransport,
        },
        {
          user: address,
          startTime: queryStartTime,
          endTime: endTime || null,
        },
        signal,
      )
    },
    enabled: Boolean(enabled && address && queryStartTime !== undefined),
  })
}

export type UserBorrowLendInterestItemType = Awaited<
  ReturnType<typeof userBorrowLendInterest>
>[number]
