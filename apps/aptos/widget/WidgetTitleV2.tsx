import { useMemo, useState } from 'react'
// import { useSwapState } from "trade/TradeProvider";
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
// import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'

export const WidgetTitleV2 = () => {
  // const { network0, network1, token1, token0, tokensLoading } = useSwapState();
  // const { data: prices0, isLoading: isPrice0Loading } = usePrice({
  //     chainId: network0,
  //     address: token0?.wrapped?.address,
  // })
  // const { data: prices1, isLoading: isPrice1Loading } = usePrice({
  //     chainId: network1,
  //     address: token1?.wrapped?.address,
  // })
  // const [inputUSD, outputUSD, price] = useMemo(() => {
  //     if (!prices0 || !prices1 || !token0 || token1) {
  //         return ['0.00', '0.00', '0.00']
  //     }
  // }
  //     , [])
  return (
    <div className="flex flex-col gap-2 mb-4 sm:mt-10 mt-2">
      <h1 className="flex items-center gap-2 text-4xl font-medium text-gray-900 dark:text-slate-50 max-h-[36px] sm:max-h-[44px]">
        Trade
      </h1>
      {/* {tokensLoading || isPrice0Loading || isPrice1Loading || !token0 || !token1 ? (
                <Skeleton.Text fontSize="text-sm" className="w-2/4"/>
            ) : (
                <button
                    onClick={() => setInvert((invert) => !invert)}
                    className="text-sm flex items-center gap-1 font-bold text-gray-600 dark:text-slate-400 hover:text-blue cursor-pointer"
                >
                    <ArrowTrendingUpIcon width={16} height={16} />
                    <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
                        1 {invert ? token0.symbol : token1.symbol}{''}
                        <span className="font-normal text-xs">(${invert ? inputUSD : outputUSD})</span> = {price}{''}
                        {invert ? token1.symbol : token0.symbol}{''}
                        <span className="font-normal text-xs">(${invert ? outputUSD : inputUSD})</span>
                    </span>
                </button>
            )} */}
    </div>
  )
}
