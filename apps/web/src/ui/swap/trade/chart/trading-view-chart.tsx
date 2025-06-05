'use client'

import { useEffect, useRef } from 'react'

import type {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from '../../../../../public/static/charting_library'
import styles from './index.module.css'

export const TVChartContainer = (
  props: Partial<ChartingLibraryWidgetOptions>,
) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let tvWidget: any

    const loadWidget = async () => {
      const mod = await import('../../../../../public/static/charting_library')
      const widget = mod.widget

      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: props.symbol,
        datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
          'https://demo_feed.tradingview.com',
          undefined,
          {
            maxResponseLength: 1000,
            expectedOrder: 'latestFirst',
          },
        ),
        interval: props.interval as ResolutionString,
        container: chartContainerRef.current!,
        library_path: '/static/charting_library/',
        locale: props.locale as LanguageCode,
        // disabled_features: ['use_localstorage_for_settings'],
        // enabled_features: ['study_templates'],
        // charts_storage_url: props.charts_storage_url,
        // charts_storage_api_version: props.charts_storage_api_version,
        // client_id: props.client_id,
        // user_id: props.user_id,
        // fullscreen: props.fullscreen,
        // autosize: props.autosize,
      }

      tvWidget = new widget(widgetOptions)

      tvWidget.onChartReady(() => {
        tvWidget.headerReady().then(() => {
          const button = tvWidget.createButton()
          button.setAttribute('title', 'Click to show a notification popup')
          button.classList.add('apply-common-tooltip')
          button.addEventListener('click', () =>
            tvWidget.showNoticeDialog({
              title: 'Notification',
              body: 'TradingView Charting Library API works correctly',
              callback: () => console.log('Noticed!'),
            }),
          )
          button.innerHTML = 'Check API'
        })
      })
    }

    loadWidget()

    return () => {
      if (tvWidget) {
        tvWidget.remove()
      }
    }
  }, [props])

  return (
    <>
      <header className={styles.VersionHeader}>
        <h1>TradingView Charting Library and Next.js Integration Example</h1>
      </header>
      <div ref={chartContainerRef} className={styles.TVChartContainer} />
    </>
  )
}
