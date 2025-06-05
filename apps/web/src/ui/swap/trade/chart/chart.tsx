'use client'

import type {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from 'public/static/charting_library/charting_library'
import { widget } from 'public/static/charting_library/charting_library.esm'
import { useEffect, useRef } from 'react'
import { Native } from 'sushi/currency'
import { Rate } from './rate'

export const Chart = (props: Partial<ChartingLibraryWidgetOptions>) => {
  const chartContainerRef = useRef<HTMLDivElement>(
    null,
  ) as React.MutableRefObject<HTMLInputElement>

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        'https://demo_feed.tradingview.com',
        undefined,
        {
          maxResponseLength: 1000,
          expectedOrder: 'latestFirst',
        },
      ),
      interval: props.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: props.library_path,
      locale: props.locale as LanguageCode,
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: props.charts_storage_url,
      charts_storage_api_version: props.charts_storage_api_version,
      client_id: props.client_id,
      user_id: props.user_id,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
    }

    const tvWidget = new widget(widgetOptions)

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton()
        button.setAttribute('title', 'Click to show a notification popup')
        button.classList.add('apply-common-tooltip')
        button.addEventListener('click', () =>
          tvWidget.showNoticeDialog({
            title: 'Notification',
            body: 'TradingView Charting Library API works correctly',
            callback: () => {
              console.log('Noticed!')
            },
          }),
        )

        button.innerHTML = 'Check API'
      })
    })

    return () => {
      tvWidget.remove()
    }
  }, [props, chartContainerRef])

  const input0 = Native.onChain(1)
  const input1 = Native.onChain(43114)
  // const price = useMemo(() => {
  //   if (!input0 || !input1) return undefined
  //   return new Price({
  //     baseAmount: Amount.fromRawAmount(input0, 123),
  //     quoteAmount: Amount.fromRawAmount(input1, 321),
  //   })
  // }, [input0, input1])

  return (
    <div className="flex flex-col flex-grow md:p-5 md:gap-3 dark:bg-slate-800 rounded-xl">
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
      <div className="flex-grow border">
        <div ref={chartContainerRef} className={'md:h-[590px]'} />
      </div>
    </div>
  )
}
