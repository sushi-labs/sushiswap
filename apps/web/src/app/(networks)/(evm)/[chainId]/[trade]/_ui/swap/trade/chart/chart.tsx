'use client'

import { useBreakpoint, useIsMounted } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { useTheme } from 'next-themes'
import type {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from 'public/static/charting_library/charting_library'
import { widget } from 'public/static/charting_library/charting_library.esm'
import { useEffect, useRef, useState } from 'react'
import { useChartContext } from './chart-provider'
import Datafeed from './datafeed'
import { registerNoDataSetter } from './datafeed'

export const Chart = ({
  widgetProps,
}: { widgetProps: Partial<ChartingLibraryWidgetOptions> }) => {
  const chartContainerRef = useRef<HTMLDivElement>(
    null,
  ) as React.MutableRefObject<HTMLInputElement>
  const { isLg: isLgScreen } = useBreakpoint('lg')
  const { resolvedTheme } = useTheme()
  const isMounted = useIsMounted()
  const {
    state: { token1 },
  } = useChartContext()
  const [hasNoData, setHasNoData] = useState(false)
  const tvWidgetRef = useRef<any>(null)

  useEffect(() => {
    registerNoDataSetter((hasNoData) => {
      setHasNoData(hasNoData)
    })
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isMounted || !resolvedTheme || tvWidgetRef.current) return
    const intervalQuicks = [60, 240, 720, '1D']
    localStorage.setItem(
      'tradingview.IntervalWidget.quicks',
      JSON.stringify(intervalQuicks),
    )

    localStorage.setItem('tradingview.current_theme.name', resolvedTheme)

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: `${token1.chainId}-${token1.wrap().address}-${token1.name}-${token1.symbol}`,
      datafeed: Datafeed,
      interval:
        (localStorage.getItem(
          'tradingview.chart.lastUsedTimeBasedResolution',
        ) as ResolutionString) || (widgetProps.interval as ResolutionString),
      container: chartContainerRef.current,
      library_path: widgetProps.library_path,
      locale: widgetProps.locale as LanguageCode,
      disabled_features: [
        ...(!isLgScreen ? ['legend_widget' as const] : []),
        'header_settings' as const,
        'header_fullscreen_button' as const,
        'header_screenshot' as const,
        'header_saveload' as const,
        'header_undo_redo',
        'header_symbol_search',
        'header_undo_redo',
        'header_undo_redo',
        'header_undo_redo',
        'header_undo_redo',
        'timeframes_toolbar',
        'display_market_status',
        'disable_pulse_animation',
        'object_tree_legend_mode',
        'show_symbol_logos',
        'symbol_info',
        'legend_inplace_edit',
        'legend_context_menu',
        'create_volume_indicator_by_default',
        'auto_enable_symbol_labels',
        'show_object_tree',
        'header_settings',
        'edit_buttons_in_legend',
        'delete_button_in_legend',
        'format_button_in_legend',
        'show_hide_button_in_legend',
        'show_symbol_logo_for_compare_studies',
        'show_symbol_logo_in_legend',
        'symbol_search_hot_key',
        'header_compare',
      ],

      enabled_features: [
        ...(!isLgScreen ? [] : ['study_templates' as const]),

        'hide_unresolved_symbols_in_legend',
        'hide_main_series_symbol_from_indicator_legend',
      ],
      charts_storage_url: widgetProps.charts_storage_url,
      charts_storage_api_version: widgetProps.charts_storage_api_version,
      client_id: widgetProps.client_id,
      user_id: widgetProps.user_id,
      fullscreen: widgetProps.fullscreen,
      autosize: widgetProps.autosize,
      custom_css_url: '/static/chart.css',
      theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      overrides: {
        'paneProperties.background': !isLgScreen
          ? resolvedTheme === 'dark'
            ? '#15152b'
            : '#ffffff'
          : resolvedTheme === 'dark'
            ? '#0D1227'
            : '#F3F2F4',
        'paneProperties.vertGridProperties.color':
          resolvedTheme === 'dark' ? '#2C2C2E' : '#E5E7EB',
        'paneProperties.horzGridProperties.color':
          resolvedTheme === 'dark' ? '#2C2C2E' : '#E5E7EB',
        'scalesProperties.textColor':
          resolvedTheme === 'dark' ? '#9CA3AF' : '#374151',
        'scalesProperties.lineColor':
          resolvedTheme === 'dark' ? '#3F3F46' : '#D1D5DB',
        'mainSeriesProperties.candleStyle.upColor': '#1ca67d',
        'mainSeriesProperties.candleStyle.downColor': '#de5852',
        'mainSeriesProperties.candleStyle.borderUpColor': '#1ca67d',
        'mainSeriesProperties.candleStyle.borderDownColor': '#de5852',
        'mainSeriesProperties.candleStyle.wickUpColor': '#1ca67d',
        'mainSeriesProperties.candleStyle.wickDownColor': '#de5852',
      },
      custom_themes: {
        light: {
          // Color that overrides blue
          color1: [
            '#f5ebff', //indicators selected row bg, this is being used for dark mode too
            '#ead6fe',
            '#e0c2fe',
            '#d5adfe',
            '#cb99fd',
            '#c184fd',
            '#b670fd',
            '#ac5bfc',
            '#a147fc',
            '#4217ff', // toolbar btn color
            '#8209fb',
            '#4217ff', // active left item
            '#6c08d1',
            '#6207bc',
            '#5706a7',
            '#4c0592',
            '#41057e',
            '#360469',
            '#2b0354',
          ],
          // Color that overrides grey
          color2: [
            '#f2edf7',
            '#0000000a', // candles menu active row bg
            '#a8a8a8', // search input border
            '#ffffffd',
            '#ffffffd',
            '#b396d0',
            '#a684c8',
            '#9972c0',
            '#8c61b8',
            '#535263',
            '#535263', // popup headers
            '#5e2893',
            '#552585',
            '#4d2178',
            '#441d6b',
            '#0000000a', // candles menu hover row bg
            '#331650',
            '#000000', // search input text
            '#220f35',
          ],
          // Color that overrides red
          color3: [
            '#fff0f0',
            '#ffe1e1',
            '#ffd3d3',
            '#ffc4c4',
            '#ffb5b5',
            '#ffa6a6',
            '#ff9797',
            '#ff8888',
            '#ff7a7a',
            '#ff6b6b',
            '#ff4d4d',
            '#ea4747',
            '#d54040',
            '#bf3a3a',
            '#aa3333',
            '#952d2d',
            '#802727',
            '#6a2020',
            '#551a1a',
          ],
          // Color that overrides green
          color4: [
            '#f2fdf8',
            '#e5faf0',
            '#d7f8e9',
            '#caf5e1',
            '#bdf3da',
            '#b0f1d2',
            '#a2eecb',
            '#95ecc3',
            '#88e9bc',
            '#22c55e', // confirmation modal btn bg positive
            '#60e2a5',
            '#58cf97',
            '#50bc8a',
            '#48aa7c',
            '#40976e',
            '#388460',
            '#307153',
            '#285e45',
            '#204b37',
          ],
          // Color that overrides orange
          color5: [
            '#fef5ea',
            '#fdecd5',
            '#fbe2bf',
            '#fad9aa',
            '#f9cf95',
            '#f8c680',
            '#f6bc6a',
            '#f5b255',
            '#f4a940',
            '#f39f2b',
            '#f08c00',
            '#dc8000',
            '#c87500',
            '#b46900',
            '#a05d00',
            '#8c5200',
            '#784600',
            '#643a00',
            '#502f00',
          ],
          // Color that overrides purple
          color6: [
            '#feeafe',
            '#fcd5fc',
            '#fbbffb',
            '#f9aaf9',
            '#f895f8',
            '#f780f7',
            '#f56af5',
            '#f455f4',
            '#f240f2',
            '#f12bf1',
            '#ee00ee',
            '#da00da',
            '#c600c6',
            '#b300b3',
            '#9f009f',
            '#8b008b',
            '#770077',
            '#630063',
            '#4f004f',
          ],
          // Color that overrides yellow
          color7: [
            '#fefeea',
            '#fcfcd5',
            '#fbfbbf',
            '#f9f9aa',
            '#f8f895',
            '#f7f780',
            '#f5f56a',
            '#f4f455',
            '#f2f240',
            '#f1f12b',
            '#eeee00',
            '#dada00',
            '#c6c600',
            '#fad46e',
            '#9f9f00',
            '#8b8b00',
            '#777700',
            '#636300',
            '#4f4f00',
          ],
          white: isLgScreen ? '#F3F2F4' : '#ffffff',
          black: '#421b50',
        },
        dark: {
          color1: [
            '#fbefea',
            '#f7dfd5',
            '#f3cfc0',
            '#efbfaa',
            '#ebaf95',
            '#e89f80',
            '#e48f6b',
            '#e07f56',
            '#dc6f41',
            '#3b83f6', // hover left item
            '#d03f01',
            '#ABA5B0', // active left item
            '#ad3501',
            '#9c2f01',
            '#8b2a01',
            '#792501',
            '#682001',
            '#571a00',
            '#451500',
          ],

          color2: [
            '#f8eeee',
            '#f5ebff', // candles menu active row bg
            '#eacdcd',
            '#E4DDEC',
            '#E4DDEC', // tooltip text hover
            '#d49b9b',
            '#E4DDEC', // input text
            '#222137', // compare symbol hover bg inline items
            'E4DDEC', // chevron color
            '#E4DDEC', // popup headers
            '#15152b', // top bottom scroll
            '#E4DDEC', // tooltip command text
            '#E4DDEC', // drag icon
            '#E4DDEC',
            '#15152B', // tooltip background
            '#ffffff0a', // tooltip row bg hover
            '#15152B', // modal background
            isLgScreen && resolvedTheme === 'dark'
              ? '#0D1227'
              : isLgScreen && resolvedTheme === 'light'
                ? '#F3F2F4'
                : !isLgScreen && resolvedTheme === 'dark'
                  ? '#15152b'
                  : '#ffffff',
            '#381212',
          ],
          color3: [
            '#fff0f0',
            '#ffe1e1',
            '#ffd3d3',
            '#ffc4c4',
            '#ffb5b5',
            '#ffa6a6',
            '#ff9797',
            '#ff8888',
            '#ff7a7a',
            '#ff6b6b',
            '#ff4d4d',
            '#ea4747',
            '#d54040',
            '#bf3a3a',
            '#aa3333',
            '#952d2d',
            '#802727',
            '#6a2020',
            '#551a1a',
          ],
          color4: [
            '#f2fffb',
            '#e6fff7',
            '#d9fff2',
            '#ccffee',
            '#bfffea',
            '#b3ffe6',
            '#a6ffe1',
            '#99ffdd',
            '#8cffd9',
            '#139b6e',
            '#66ffcc',
            '#5eeabb',
            '#55d5aa',
            '#4dbf99',
            '#44aa88',
            '#3c9577',
            '#338066',
            '#2b6a55',
            '#225544',
          ],
          color5: [
            '#fffff0',
            '#ffffe0',
            '#feffd1',
            '#feffc2',
            '#feffb2',
            '#feffa3',
            '#fdff94',
            '#fdff84',
            '#fdff75',
            '#fdff66',
            '#fcff47',
            '#e7ea41',
            '#d2d53b',
            '#bdbf35',
            '#a8aa2f',
            '#939529',
            '#7e8024',
            '#696a1e',
            '#545518',
          ],
          color6: [
            '#fff1ff',
            '#ffe2ff',
            '#ffd4ff',
            '#ffc5ff',
            '#ffb7ff',
            '#ffa9ff',
            '#ff9aff',
            '#ff8cff',
            '#ff7dff',
            '#ff6fff',
            '#ff52ff',
            '#ea4bea',
            '#d544d5',
            '#bf3ebf',
            '#aa37aa',
            '#953095',
            '#802980',
            '#6a226a',
            '#551b55',
          ],
          color7: [
            '#eff8ff',
            '#dff1ff',
            '#cfeaff',
            '#bee3ff',
            '#aedcff',
            '#9ed5ff',
            '#8eceff',
            '#7ec7ff',
            '#6ec0ff',
            '#5db9ff',
            '#3dabff',
            '#389dea',
            '#338fd5',
            '#2e80bf',
            '#2972aa',
            '#e8bd48',
            '#1f5680',
            '#19476a',
            '#143955',
          ],
          white: '#ffffff',
          black: '#000000',
        },
      },

      time_frames: [
        { text: '15m', resolution: 15 as unknown as ResolutionString },
        { text: '1h', resolution: 60 as unknown as ResolutionString },
        { text: '4h', resolution: 240 as unknown as ResolutionString },
        { text: '1d', resolution: '1D' as unknown as ResolutionString },
      ],
    }

    const tvWidget = new widget(widgetOptions)
    tvWidgetRef.current = tvWidget

    return () => {
      tvWidget.remove()
      tvWidgetRef.current = null
    }
  }, [chartContainerRef, resolvedTheme, isLgScreen, isMounted, token1])

  return (
    <div className="flex flex-col flex-grow rounded-xl">
      <script src="/tradingview/charting_library/bundles" />

      <div className="flex-grow">
        <div
          ref={chartContainerRef}
          className={classNames(
            'lg:h-[580px] md:h-[530px] h-full',
            hasNoData ? 'hidden' : 'flex',
          )}
        />
        <div
          className={classNames(
            'lg:h-[580px] md:h-[530px] h-full bg-slate-50 dark:bg-slate-800 dark:text-pink-200 rounded-xl text-muted-foreground items-center justify-center italic text-sm',
            hasNoData ? 'flex' : 'hidden',
          )}
        >
          No price chart available
        </div>
      </div>
    </div>
  )
}
