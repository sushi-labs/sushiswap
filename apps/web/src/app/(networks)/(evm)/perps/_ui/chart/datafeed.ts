import type { ISubscription } from '@nktkas/hyperliquid'
import { candleSnapshot } from '@nktkas/hyperliquid/api/info'
import {
  type CandleParameters,
  candle,
} from '@nktkas/hyperliquid/api/subscription'
import type {
  Bar,
  DatafeedErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  ResolutionString,
  SearchSymbolResultItem,
  TimeFrameItem,
} from 'public/trading_view/charting_library/charting_library'
import { hlWebSocketTransport } from 'src/lib/perps/transports'

// const lastBarsCache = new Map<string, Bar>();

let setHasNoData: (val: boolean) => void = () => {}

export function registerNoDataSetter(fn: (val: boolean) => void) {
  setHasNoData = fn
}

export const timeframes: TimeFrameItem[] = [
  { text: '1m', resolution: '1' as ResolutionString, description: '1 minute' },
  { text: '3m', resolution: '3' as ResolutionString, description: '3 minutes' },
  {
    text: '5m',
    resolution: '5' as ResolutionString,
    description: '5 minutes',
  },
  {
    text: '15m',
    resolution: '15' as ResolutionString,
    description: '15 minutes',
  },
  {
    text: '30m',
    resolution: '30' as ResolutionString,
    description: '30 minutes',
  },

  {
    text: '1h',
    resolution: '60' as ResolutionString,
    description: '1 hour',
  },
  { text: '2h', resolution: '120' as ResolutionString, description: '2 hours' },
  { text: '4h', resolution: '480' as ResolutionString, description: '4 hours' },
  { text: '8h', resolution: '960' as ResolutionString, description: '8 hours' },
  {
    text: '12h',
    resolution: '1440' as ResolutionString,
    description: '12 hours',
  },

  { text: '1d', resolution: '1D' as ResolutionString, description: '1 day' },
  { text: '3d', resolution: '3D' as ResolutionString, description: '3 days' },

  { text: '1w', resolution: '1W' as ResolutionString, description: '1 week' },

  { text: '1m', resolution: '1M' as ResolutionString, description: '1 month' },
]

type ConfigurationData = {
  supported_resolutions: ResolutionString[]
  exchanges: {
    value: string
    name: string
    desc: string
  }[]
  symbols_types: {
    name: string
    value: string
  }[]
}

const configurationData: ConfigurationData = {
  supported_resolutions: timeframes.map((t) => t.resolution),
  exchanges: [],
  symbols_types: [
    {
      name: 'crypto',
      value: 'crypto',
    },
  ],
}

export default {
  onReady: (callback: (config: ConfigurationData) => void): void => {
    console.log('[onReady]: Method call')
    setTimeout(() => callback(configurationData))
  },

  searchSymbols: async (
    _userInput: string,
    _exchange: string,
    _symbolType: string,
    onResultReadyCallback: (symbols: SearchSymbolResultItem[]) => void,
  ): Promise<void> => {
    // console.log("[searchSymbols]: Method call");
    //not used
    onResultReadyCallback([])
  },

  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: LibrarySymbolInfo) => void,
    _onResolveErrorCallback: (reason: string) => void,
    _extension: unknown,
  ): Promise<void> => {
    const symbol = symbolName
    // let description = symbol

    const symbolItem = {
      symbol,
      full_name: symbol,
      description: 'testing',
      exchange: '',
      type: 'crypto',
    }

    const symbolInfo: LibrarySymbolInfo = {
      ticker: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      listed_exchange: symbolItem.exchange,
      format: 'price',
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: 'streaming',
    }

    // console.log('[resolveSymbol]: Symbol resolved', symbolName)
    setTimeout(() => onSymbolResolvedCallback(symbolInfo))
  },

  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: { from: number; to: number; firstDataRequest: boolean },
    onHistoryCallback: HistoryCallback,
    onError: DatafeedErrorCallback,
  ): Promise<void> => {
    const { from, to, firstDataRequest } = periodParams
    const normalizedResolution = normalizeTvResolution(resolution)

    try {
      const _from = from * 1000

      let _to = to * 1000
      // if (_to - _from > maxSeconds) {
      //   // If the requested range exceeds the maximum allowed, adjust it
      //   // _to = _from + maxSeconds;
      //   _from = _to - maxSeconds // Adjust _from to fit the max range
      //   if (_from < earliestAllowedTimestamp) {
      //     _from = earliestAllowedTimestamp
      //   }
      // }

      const now = Math.floor(Date.now())
      if (_to > now) {
        _to = now - 10 // Ensure _to does not exceed the current time
      }

      if (_to < _from) {
        throw new Error(
          `Invalid time range: _to is less than _from, ${_to} < ${_from}`,
        )
      }
      // console.log(
      //   '[getBars]: Method call',
      //   symbolInfo,
      //   resolution,
      //   from,
      //   to,
      //   normalizedResolution,
      // )

      const data = await candleSnapshot(
        { transport: hlWebSocketTransport },
        {
          coin: symbolInfo.name,
          interval: normalizedResolution,
          startTime: _from,
          endTime: _to,
        },
      )
      // console.log('[getBars]: Received data', data)

      if (!data || !data.length) {
        // console.log('[getBars]: No data received', { firstDataRequest })
        if (firstDataRequest) {
          console.log('[getBars]: Setting hasNoData to true')
          setHasNoData(true)
        }
        onHistoryCallback([], { noData: true })
        return
      }

      const formattedBars: Bar[] = data
        .filter((b) => b.T >= _from && b.T <= _to)
        .map((b) => ({
          time: b.T,
          open: Number.parseFloat(b.o),
          high: Number.parseFloat(b.h),
          low: Number.parseFloat(b.l),
          close: Number.parseFloat(b.c),
          volume: Number.parseFloat(b.v),
        }))

      if (formattedBars.length === 0) {
        if (firstDataRequest) {
          setHasNoData(true)
        }
        onHistoryCallback([], { noData: true })
        return
      }

      // console.log(`[getBars]: returned ${formattedBars.length} bar(s)`)
      if (firstDataRequest) {
        // console.log(
        //   `[getBars]: Setting hasNoData to ${formattedBars?.length === 0}`,
        // )
        setHasNoData(formattedBars?.length === 0)
      }
      onHistoryCallback(formattedBars, {
        noData: formattedBars?.length === 0,
      })
    } catch (error: unknown) {
      // console.log('[getBars]: Get error', error)
      const _error = error instanceof Error ? error.message : String(error)
      onError(_error)
    }
  },

  subscribeBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: (bar: Bar) => void,
    subscriberUID: string,
    _onResetCacheNeededCallback: () => void,
  ): Promise<void> => {
    // console.log(
    //   '[subscribeBars]: Method call with subscriberUID:',
    //   subscriberUID,
    // )
    const normalizedResolution = normalizeTvResolution(resolution)

    const sub = await candle(
      { transport: hlWebSocketTransport },
      {
        coin: symbolInfo.name,
        interval: normalizedResolution,
      },
      (candleData) => {
        const bar: Bar = {
          time: candleData.T,
          open: Number.parseFloat(candleData.o),
          high: Number.parseFloat(candleData.h),
          low: Number.parseFloat(candleData.l),
          close: Number.parseFloat(candleData.c),
          volume: Number.parseFloat(candleData.v),
        }
        onRealtimeCallback(bar)
      },
    )

    // Save the timer ID to clear later
    subscribers[subscriberUID] = sub
  },

  unsubscribeBars: async (subscriberUID: string): Promise<void> => {
    // console.log("[unsubscribeBars]: Method call with subscriberUID:", subscriberUID);
    // Unsubscribe logic here
    await subscribers[subscriberUID]?.unsubscribe()
    delete subscribers[subscriberUID]
  },
}

const subscribers = {} as Record<string, ISubscription>

type NormalizedResolution = CandleParameters['interval']

const normalizeTvResolution = (resolution: string): NormalizedResolution => {
  switch (resolution) {
    case '1':
      return '1m'
    case '3':
      return '3m'
    case '5':
      return '5m'
    case '15':
      return '15m'
    case '30':
      return '30m'

    case '60':
      return '1h'
    case '120':
      return '2h'
    case '240':
      return '4h'
    case '480':
      return '8h'
    case '720':
      return '12h'

    case '1D':
      return '1d'
    case '3D':
      return '3d'

    case '1W':
      return '1w'
    case '1M':
      return '1M'

    default:
      throw new Error(`Unsupported TradingView resolution: ${resolution}`)
  }
}
