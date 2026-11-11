'use client'
import { useMemo } from 'react'
import { useBuybackReserve } from 'src/lib/hooks/react-query/buyback/use-buyback-reserve'
import { useBuybackReserveTransactions } from 'src/lib/hooks/react-query/buyback/use-buyback-reserve-transactions'
import { formatNumber } from 'sushi'
import { reserveDateFormatter } from '../_lib/format'
import { DataItem } from './data-item'

export const SushiAcquiredData = () => {
  const {
    data,
    isLoading: isLoadingReserve,
    isError: isErrorReserve,
  } = useBuybackReserve({
    enabled: true,
  })
  const {
    data: transactionsData,
    isLoading: transactionsIsLoading,
    isError: transactionsIsError,
  } = useBuybackReserveTransactions({
    enabled: true,
  })
  const isLoading = isLoadingReserve || transactionsIsLoading
  const isError = isErrorReserve || transactionsIsError

  const { totalBuyBacks, latestBuyBack } = useMemo(
    () => ({
      totalBuyBacks: transactionsData?.pages?.[0]?.totalCount ?? 0,
      latestBuyBack: transactionsData?.pages?.[0]?.transactions?.[0],
    }),
    [transactionsData],
  )

  return (
    <>
      <DataItem
        label={'Total SUSHI acquired'}
        value={
          <div className="flex gap-1.5 items-end">
            <div>{formatNumber(data?.amount || '0')}</div>
            <div className="text-muted-foreground font-normal text-lg">
              SUSHI
            </div>
          </div>
        }
        subLabel={`Across ${totalBuyBacks} weekly buybacks`}
        isLoading={isLoading}
        isError={isError}
      />
      <DataItem
        label={'Latest buyback'}
        value={
          <div className="flex gap-1.5 items-end">
            <div>{formatNumber(latestBuyBack?.received || '0')}</div>
            <div className="text-muted-foreground font-normal text-lg">
              SUSHI
            </div>
          </div>
        }
        subLabel={
          latestBuyBack?.timestamp
            ? `${reserveDateFormatter.format(latestBuyBack?.timestamp * 1000)}`
            : ''
        }
        isLoading={isLoading}
        isError={isError}
      />
    </>
  )
}
