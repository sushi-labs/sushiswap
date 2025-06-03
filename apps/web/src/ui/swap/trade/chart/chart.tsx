'use client'

import { Currency } from '@sushiswap/ui'
import { useEffect, useMemo, useRef } from 'react'
import { Amount, Native, Price } from 'sushi/currency'
import { Rate } from './rate'

export const Chart = () => {
  const containerRef = useRef(null)

  // useEffect(() => {
  //   const widgetOptions = {
  //     symbol: 'ETHUSDC',
  //     interval: '15',
  //     container_id: 'tv_chart_container',
  //     library_path: '/tradingview/charting_library/',
  //     locale: 'en',
  //     disabled_features: ['use_localstorage_for_settings'],
  //     enabled_features: ['study_templates'],
  //     theme: 'Dark',
  //     overrides: {
  //       'mainSeriesProperties.candleStyle.upColor': '#00ff00',
  //       'mainSeriesProperties.candleStyle.downColor': '#ff0000',
  //     },
  //     // datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed('/')
  //   }
  // })

  const input0 = Native.onChain(1)
  const input1 = Native.onChain(43114)
  const price = useMemo(() => {
    if (!input0 || !input1) return undefined
    return new Price({
      baseAmount: Amount.fromRawAmount(input0, 123),
      quoteAmount: Amount.fromRawAmount(input1, 321),
    })
  }, [input0, input1])

  return (
    <div className="flex flex-col flex-grow md:p-5 md:gap-3 bg-slate-800 rounded-xl">
      <script src="/tradingview/charting_library/bundles" />
      <div className="flex items-center justify-between w-full">
        <div>token select</div>
        <div>
          {/* <Rate price={price} /> */}
          <Rate
            token0={{
              symbol: input0.symbol,
              amount: 1,
              usdPrice: 2700,
            }}
            token1={{
              symbol: input1.symbol,
              amount: 1,
              usdPrice: 24,
            }}
          />
        </div>
      </div>
      <div className="flex-grow border">chart</div>
    </div>
  )
}
