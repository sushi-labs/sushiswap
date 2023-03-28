import { useCallback, useMemo } from 'react'

import { ChartEntry } from './types'
import { Currency } from '@sushiswap/currency'
import { FeeAmount } from '@sushiswap/v3-sdk'
import { ChainId } from '@sushiswap/chain'

export function useDensityChartData({
  chainId,
  currencyA,
  currencyB,
  feeAmount,
}: {
  chainId: ChainId
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  feeAmount: FeeAmount | undefined
}) {
  // const { isLoading, error, data } = usePoolActiveLiquidity({ chainId, currencyA, currencyB, feeAmount })

  // const formatData = useCallback(() => {
  //   if (!data?.length) {
  //     return undefined
  //   }
  //
  //   const newData: ChartEntry[] = []
  //
  //   for (let i = 0; i < data.length; i++) {
  //     const t: TickProcessed = data[i]
  //
  //     const chartEntry = {
  //       activeLiquidity: parseFloat(t.liquidityActive.toString()),
  //       price0: parseFloat(t.price0),
  //     }
  //
  //     if (chartEntry.activeLiquidity > 0) {
  //       newData.push(chartEntry)
  //     }
  //   }
  //
  //   return newData
  // }, [data])
  //
  // return useMemo(() => {
  //   return {
  //     isLoading,
  //     error,
  //     formattedData: !isLoading ? formatData() : undefined,
  //   }
  // }, [isLoading, error, formatData])

  return {
    isLoading: false,
    error: false,
    formattedData: [],
  }
}
