import { useMemo } from 'react'
import { useUserState } from '~evm/perps/user-provider'

export const useFundingHistory = () => {
  const {
    state: {
      userFundingsQuery: { data, isLoading, isError },
    },
  } = useUserState()

  const formattedData = useMemo(() => {
    if (!data) return []
    return data?.fundings?.map((i) => {
      const side =
        Number.parseFloat(i.szi) > 0 ? ('long' as const) : ('short' as const)
      return {
        timestamp: i.time,
        coin: i.coin,
        size: Math.abs(Number.parseFloat(i.szi)),
        side,
        payment: i.usdc,
        rate: i.fundingRate,
        nSamples: i.nSamples,
        isSnapshot: data?.isSnapshot || false,
      }
    })
  }, [data])

  return useMemo(() => {
    return {
      data: formattedData,
      isLoading,
      isError,
    }
  }, [isLoading, isError, formattedData])
}

export type FundingHistoryItemType = ReturnType<
  typeof useFundingHistory
>['data'][number]
