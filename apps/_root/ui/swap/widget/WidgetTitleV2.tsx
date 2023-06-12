import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import React, { useMemo, useState } from 'react'
import { useSwapState } from '../trade/TradeProvider'
import { usePrice } from '@sushiswap/react-query'
import { Amount, Price, Token, tryParseAmount } from '@sushiswap/currency'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ZERO } from '@sushiswap/math'

export const WidgetTitleV2 = () => {
  const [invert, setInvert] = useState(false)
  const { network0, network1, token1, token0, tokensLoading } = useSwapState()
  const { data: prices0, isLoading: isPrice0Loading } = usePrice({
    chainId: network0,
    address: token0?.wrapped?.address,
  })
  const { data: prices1, isLoading: isPrice1Loading } = usePrice({
    chainId: network1,
    address: token1?.wrapped?.address,
  })

  const [inputUSD, outputUSD, price] = useMemo(() => {
    if (!prices0 || !prices1 || !token0 || !token1) {
      return ['0.00', '0.00', '0.00']
    }

    const token0Price = prices0 ? tryParseAmount('1', token0)?.multiply(prices0) : undefined
    const token1Price = prices1 ? tryParseAmount('1', token1)?.multiply(prices1) : undefined
    const dummy0 = new Token({ address: token0.wrapped.address, chainId: 1, decimals: token0.decimals })
    const dummy1 = new Token({ address: token1.wrapped.address, chainId: 1, decimals: token1.decimals })

    let price
    if (token0Price && token1Price && token0Price.greaterThan(ZERO) && token1Price.greaterThan(ZERO)) {
      price = new Price({
        baseAmount: Amount.fromRawAmount(dummy0, token0Price.quotient.toString()),
        quoteAmount: Amount.fromRawAmount(dummy1, token1Price.quotient.toString()),
      })
    }

    return [
      token0Price?.toSignificant(6) ?? '0.00',
      token1Price?.toSignificant(6) ?? '0.00',
      price ? (invert ? price.invert().toSignificant(4) : price.toSignificant(4)) : '0.00',
    ]
  }, [invert, prices0, prices1, token0, token1])

  return (
    <div className="flex flex-col gap-2 mb-4 sm:mt-10 mt-2">
      <h1 className="flex items-center gap-2 text-4xl font-medium text-gray-900 dark:text-slate-50 max-h-[36px] sm:max-h-[44px]">
        Trade
      </h1>
      {tokensLoading || isPrice0Loading || isPrice1Loading || !token0 || !token1 ? (
        <Skeleton.Text fontSize="text-sm" className="w-2/4" />
      ) : (
        <button
          onClick={() => setInvert((invert) => !invert)}
          className="text-sm flex items-center gap-1 font-bold text-gray-600 dark:text-slate-400 hover:text-blue cursor-pointer"
        >
          <ArrowTrendingUpIcon width={16} height={16} />
          <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
            1 {invert ? token0.symbol : token1.symbol}{' '}
            <span className="font-normal text-xs">(${invert ? inputUSD : outputUSD})</span> = {price}{' '}
            {invert ? token1.symbol : token0.symbol}{' '}
            <span className="font-normal text-xs">(${invert ? outputUSD : inputUSD})</span>
          </span>
        </button>
      )}
    </div>
  )
}
