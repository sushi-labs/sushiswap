'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { useTheme } from 'next-themes'
import type {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
} from 'public/trading-view/charting_library/charting_library'
import { widget } from 'public/trading-view/charting_library/charting_library.esm.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { LaunchpadChainId } from '../../../constants'
import { createLaunchpadDatafeed } from './datafeed'

const POSITIVE_COLOR = '#1ca67d'
const NEGATIVE_COLOR = '#de5852'

function getPricescale(price: number | null | undefined): number {
  if (!price || price <= 0 || price >= 1) return 100

  const precision = Math.min(12, Math.max(2, Math.ceil(-Math.log10(price)) + 4))

  return 10 ** precision
}

export function PriceChart({
  chainId,
  tokenAddress,
  symbol,
  price,
}: {
  chainId: LaunchpadChainId
  tokenAddress: EvmAddress
  symbol: string
  price: number | null | undefined
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null)
  const [chartReady, setChartReady] = useState(false)
  const { resolvedTheme } = useTheme()
  const isMounted = useIsMounted()
  const pricescale = getPricescale(price)
  const datafeed = useMemo(
    () =>
      createLaunchpadDatafeed({
        chainId,
        onResetData() {
          tvWidgetRef.current?.activeChart().resetData()
        },
        tokenAddress,
        symbol,
        pricescale,
      }),
    [chainId, pricescale, symbol, tokenAddress],
  )

  useEffect(() => {
    if (!isMounted || !resolvedTheme || !chartContainerRef.current) return
    if (tvWidgetRef.current) return

    localStorage.setItem(
      'tradingview.IntervalWidget.quicks',
      JSON.stringify(['5', '60', '1D']),
    )
    localStorage.setItem('tradingview.current_theme.name', resolvedTheme)

    const options: ChartingLibraryWidgetOptions = {
      symbol: `${tokenAddress}:${symbol}`,
      datafeed,
      interval: '60' as ResolutionString,
      container: chartContainerRef.current,
      library_path: '/trading-view/charting_library/',
      locale: 'en' as LanguageCode,
      disabled_features: [
        'header_settings',
        'header_saveload',
        'header_undo_redo',
        'header_symbol_search',
        'timeframes_toolbar',
        'header_compare',
        'header_quick_search',
        'legend_inplace_edit',
        'symbol_search_hot_key',
        'legend_context_menu',
      ],
      enabled_features: [
        'hide_unresolved_symbols_in_legend',
        'hide_main_series_symbol_from_indicator_legend',
        'iframe_loading_compatibility_mode',
      ],
      fullscreen: false,
      autosize: true,
      custom_css_url: '/trading-view-chart.css',
      theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      overrides: {
        'paneProperties.vertGridProperties.color':
          resolvedTheme === 'dark' ? '#2C2C2E' : '#E5E7EB',
        'paneProperties.horzGridProperties.color':
          resolvedTheme === 'dark' ? '#2C2C2E' : '#E5E7EB',
        'scalesProperties.textColor':
          resolvedTheme === 'dark' ? '#9CA3AF' : '#374151',
        'scalesProperties.lineColor':
          resolvedTheme === 'dark' ? '#3F3F46' : '#D1D5DB',
        'paneProperties.background': 'rgba(0,0,0,0)',
        'paneProperties.backgroundType': 'solid',
        'mainSeriesProperties.candleStyle.upColor': POSITIVE_COLOR,
        'mainSeriesProperties.candleStyle.downColor': NEGATIVE_COLOR,
        'mainSeriesProperties.candleStyle.borderUpColor': POSITIVE_COLOR,
        'mainSeriesProperties.candleStyle.borderDownColor': NEGATIVE_COLOR,
        'mainSeriesProperties.candleStyle.wickUpColor': POSITIVE_COLOR,
        'mainSeriesProperties.candleStyle.wickDownColor': NEGATIVE_COLOR,
      },
    }

    const tvWidget = new widget(options)
    tvWidgetRef.current = tvWidget
    tvWidget.onChartReady(() => setChartReady(true))

    return () => {
      tvWidget.remove()
      tvWidgetRef.current = null
      setChartReady(false)
    }
  }, [datafeed, isMounted, resolvedTheme, symbol, tokenAddress])

  return (
    <PerpsCard className="h-[540px] overflow-hidden p-2" fullWidth>
      <div className="relative h-full">
        <div
          ref={chartContainerRef}
          className={chartReady ? 'flex h-full' : 'hidden'}
          aria-label={`${symbol} price chart`}
        />
        {!chartReady ? (
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative h-[56px] w-[50px]">
              <div className="absolute h-[50px] w-[50px] animate-[bounce_.5s_linear_infinite_0.17s]">
                <SushiIcon width={50} height={50} />
              </div>
              <div className="absolute left-0 top-[51px] h-[5px] w-[50px] animate-shadow rounded-[50%] bg-black opacity-20" />
            </div>
          </div>
        ) : null}
      </div>
    </PerpsCard>
  )
}
