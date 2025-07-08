'use client'

import { SkeletonBox } from '@sushiswap/ui'
import { formatUSD } from 'sushi/format'
// import { ArrowsLeftRightIcon } from "@sushiswap/ui/icons/ArrowsLeftRight";
// import { useState } from "react";
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { useChartContext } from './chart-provider'

export const Rate = () => {
  const {
    state: { token0 },
  } = useChartContext()

  const { data: price0, isLoading: isPrice0Loading } = usePrice({
    chainId: token0?.chainId,
    address: token0?.wrapped?.address,
    enabled: !!token0,
  })

  // const [flipped, setFlipped] = useState(false);

  // const base = flipped ? token1 : token0;
  // const quote = flipped ? token0 : token1;

  const isLoading = isPrice0Loading

  return (
    <div className="flex items-center xl:flex-wrap text-base md:text-xl font-medium text-[#0F172A] dark:text-white">
      {isLoading ? (
        <SkeletonBox className="w-20 h-4 mr-1 rounded-md" />
      ) : (
        <div className="mr-1">
          1 {token0.symbol} = {formatUSD(price0 ?? 0)}
        </div>
      )}
      {/* <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="flex items-center gap-1 transition hover:opacity-75 text-blue dark:text-skyblue"
      >
        <ArrowsLeftRightIcon width={18} />
        Switch To {quote.symbol}
      </button> */}
    </div>
  )
}
