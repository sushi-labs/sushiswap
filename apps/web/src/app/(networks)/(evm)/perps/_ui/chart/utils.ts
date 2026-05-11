import type {
  AvailableSaveloadVersions,
  ChartingLibraryWidgetOptions,
  IOrderLineAdapter,
  IPositionLineAdapter,
  LanguageCode,
  ResolutionString,
} from 'public/trading-view/charting_library/charting_library'
import type { UserOpenOrdersItemType } from 'src/lib/perps'
import { formatUSD } from 'sushi'
import Datafeed, { timeframes } from './datafeed'

export const widgetProps = {
  interval: '1D' as ResolutionString,
  library_path: '/trading-view/charting_library/',
  locale: 'en',
  charts_storage_url: 'https://saveload.tradingview.com',
  charts_storage_api_version: '1.1' as AvailableSaveloadVersions,
  client_id: 'tradingview.com',
  fullscreen: false,
  autosize: true,
}

export const LIGHT_BG = '#ffffff'
export const DARK_BG = '#000000'
export const POSITIVE_COLOR = '#1ca67d'
export const NEGATIVE_COLOR = '#de5852'
export const POSITION_LINE_LENGTH = -40

export const formatPnlLabel = ({ pnl }: { pnl: string }) => {
  return `PNL ${formatUSD(pnl)}`
}

export const formatTriggerCondition = (
  type: UserOpenOrdersItemType['type'],
  condition: string,
  limitPrice?: string,
) => {
  if (type === 'limit' && limitPrice) {
    return `Limit ${limitPrice}`
  }
  if (condition.includes('above')) {
    return `${type.toUpperCase()} Price > ${condition.split('above ')?.[1]}`
  }

  if (condition.includes('below')) {
    return `${type.toUpperCase()} Price < ${condition.split('below ')?.[1]}`
  }

  return condition
}

export const getThemeColors = (resolvedTheme: string | undefined) => {
  const isDark = resolvedTheme === 'dark'

  return {
    background: isDark ? DARK_BG : LIGHT_BG,
    text: isDark ? LIGHT_BG : DARK_BG,
  }
}

export const removeLine = (
  line: IOrderLineAdapter | IPositionLineAdapter | null | undefined,
) => {
  line?.remove?.()
}

export const removeAllOrderLines = (
  lineMap: Record<number, IOrderLineAdapter> | null | undefined,
) => {
  if (!lineMap) return

  for (const line of Object.values(lineMap)) {
    removeLine(line)
  }
}

export const applyCommonLineStyles = ({
  line,
  quantity,
  resolvedTheme,
  color,
  lengthMultiplier = 1,
}: {
  line: IOrderLineAdapter | IPositionLineAdapter
  quantity?: string
  resolvedTheme: string | undefined
  color: string
  lengthMultiplier?: number
}) => {
  const themeColors = getThemeColors(resolvedTheme)

  line
    .setLineStyle(2)
    .setLineLength(POSITION_LINE_LENGTH * lengthMultiplier, 'pixel')
  line.setLineWidth(2)

  if (quantity) {
    line.setQuantity(quantity)
  }

  line.setQuantityBackgroundColor(themeColors.background)
  line.setQuantityTextColor(themeColors.text)
  line.setBodyBackgroundColor(themeColors.background)
  line.setBodyTextColor(color)
  line.setLineColor(color)
  line.setBodyBorderColor(color)
}

export const createChartWidgetOptions = ({
  activeAsset,
  assetName,
  decimals,
  marketType,
  address,
  showBuySellInChart,
  resolvedTheme,
  container,
}: {
  activeAsset: string
  assetName?: string
  decimals: number
  marketType?: string
  address?: string | null
  showBuySellInChart: boolean
  resolvedTheme: string
  container: HTMLDivElement
}): ChartingLibraryWidgetOptions => ({
  symbol: `${activeAsset}::${assetName}::${decimals}::${marketType}::${address}::${showBuySellInChart}`,
  datafeed: Datafeed,
  interval:
    (localStorage.getItem(
      'tradingview.chart.lastUsedTimeBasedResolution',
    ) as ResolutionString) || ('1D' as ResolutionString),
  container: container as HTMLElement,
  library_path: widgetProps.library_path,
  locale: widgetProps.locale as LanguageCode,
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
  charts_storage_url: widgetProps.charts_storage_url,
  charts_storage_api_version: widgetProps.charts_storage_api_version,
  client_id: widgetProps.client_id,
  user_id: address ?? 'public_user_id',
  fullscreen: widgetProps.fullscreen,
  autosize: widgetProps.autosize,
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
  custom_themes: {
    light: {
      color1: [
        '#f5ebff',
        '#ead6fe',
        '#e0c2fe',
        '#d5adfe',
        '#cb99fd',
        '#c184fd',
        '#b670fd',
        '#ac5bfc',
        '#a147fc',
        '#4217ff',
        '#8209fb',
        '#4217ff',
        '#6c08d1',
        '#6207bc',
        '#5706a7',
        '#4c0592',
        '#41057e',
        '#360469',
        '#2b0354',
      ],
      color2: [
        '#f4f4f5',
        '#e9e9eb',
        '#dddee1',
        '#d2d3d7',
        '#c7c8cd',
        '#bcbdc3',
        '#b0b2b8',
        '#a5a7ae',
        '#9a9ca4',
        '#8f919a',
        '#787b86',
        '#6e717b',
        '#646770',
        '#5a5c65',
        '#505259',
        '#46484e',
        '#3c3e43',
        '#323338',
        '#28292d',
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
        '#f2fdf8',
        '#e5faf0',
        '#d7f8e9',
        '#caf5e1',
        '#bdf3da',
        '#b0f1d2',
        '#a2eecb',
        '#95ecc3',
        '#88e9bc',
        '#22c55e',
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
      white: '#ffffff',
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
        '#3b83f6',
        '#d03f01',
        '#ABA5B0',
        '#ad3501',
        '#9c2f01',
        '#8b2a01',
        '#792501',
        '#682001',
        '#571a00',
        '#451500',
      ],
      color2: [
        '#f4f4f5',
        '#e9e9eb',
        '#dddee1',
        '#d2d3d7',
        '#c7c8cd',
        '#bcbdc3',
        '#b0b2b8',
        '#a5a7ae',
        '#9a9ca4',
        '#8f919a',
        '#787b86',
        '#6e717b',
        '#646770',
        '#5a5c65',
        '#505259',
        '#46484e',
        '#3c3e43',
        'rgba(255,255,255,0)',
        '#323338',
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
  time_frames: timeframes,
})
