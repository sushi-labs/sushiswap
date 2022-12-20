import { Type } from '@sushiswap/currency'
import { useConcentratedLiquidityPool } from '@sushiswap/wagmi'
import { useMemo } from 'react'

import { processTicksData } from '../utils/processData'
import { useAllV3Ticks } from './usePoolTickData'

export const useLiquidityChartData = (currencyBase: Type | undefined, currencyQuote: Type | undefined) => {
  const [poolState, pool] = useConcentratedLiquidityPool(currencyBase, currencyQuote)
  const { token0, token1 } = pool || {}

  const { data: rawData, ...queryState } = useAllV3Ticks()

  const invertPrice = token0 && currencyBase ? token0 !== currencyBase.wrapped : undefined

  const priceLiquidityDataList = useMemo(() => {
    return rawData && token0 && token1 && invertPrice != null
      ? processTicksData(rawData, token0, token1, invertPrice)
      : undefined
  }, [rawData, token0, token1, invertPrice])

  return useMemo(
    () => ({
      invertPrice,
      queryState,
      priceLiquidityDataList,
      poolState,
      pool,
    }),
    [invertPrice, pool, poolState, priceLiquidityDataList, queryState]
  )
}
