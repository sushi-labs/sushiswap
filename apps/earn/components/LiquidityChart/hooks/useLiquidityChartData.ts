import { useMuffinPool } from '@muffinfi/hooks/usePools'
import { Type } from '@sushiswap/currency'
import { useAllV3Ticks } from 'hooks/usePoolTickData'
import { useMemo } from 'react'

import { processTicksData } from '../utils/processData'

export const useLiquidityChartData = (currencyBase: Type | undefined, currencyQuote: Type | undefined) => {
  const [poolState, pool] = useMuffinPool(currencyBase, currencyQuote)
  const { token0, token1 } = pool || {}

  const { data: rawData, ...queryState } = useAllV3Ticks(pool)

  const invertPrice = token0 && currencyBase ? token0 !== currencyBase.wrapped : undefined

  const priceLiquidityDataList = useMemo(() => {
    return rawData && token0 && token1 && invertPrice != null
      ? processTicksData(rawData, token0, token1, invertPrice)
      : undefined
  }, [rawData, token0, token1, invertPrice])

  return {
    invertPrice,
    queryState,
    priceLiquidityDataList,
    poolState,
    pool,
  }
}
