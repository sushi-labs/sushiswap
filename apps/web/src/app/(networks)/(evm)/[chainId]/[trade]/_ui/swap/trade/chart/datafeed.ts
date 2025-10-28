import {
  type GetTokenPriceChartV2,
  getTokenPriceChartV2,
} from '@sushiswap/graph-client/data-api'
import type {
  Bar,
  DatafeedErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  ResolutionString,
  SearchSymbolResultItem,
} from 'public/trading_view/charting_library/charting_library'
import type { Address } from 'viem'

// const lastBarsCache = new Map<string, Bar>();

let setHasNoData: (val: boolean) => void = () => {}

export function registerNoDataSetter(fn: (val: boolean) => void) {
  setHasNoData = fn
}

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
  supported_resolutions: [60, 240, 720, '1D'] as ResolutionString[],
  exchanges: [],
  symbols_types: [
    {
      name: 'crypto',
      value: 'crypto',
    },
  ],
}

const timeframe: Record<string, GetTokenPriceChartV2['interval']> = {
  60: 'HOURLY',
  240: 'HOURLY',
  720: 'HOURLY',
  '1D': 'DAILY',
}

export default {
  onReady: (callback: (config: ConfigurationData) => void): void => {
    // console.log("[onReady]: Method call");
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
    onSymbolResolvedCallback: (
      symbolInfo: LibrarySymbolInfo & { chainId: string; address: string },
    ) => void,
    _onResolveErrorCallback: (reason: string) => void,
    _extension: unknown,
  ): Promise<void> => {
    // console.log('[resolveSymbol]: Method call', symbolName)

    const chainId = symbolName.split('-')[0]
    const address = symbolName.split('-')[1]
    const name = symbolName.split('-')[2]
    const symbol = symbolName.split('-')[3] || name
    const symbolItem = {
      symbol,
      full_name: symbol,
      description: name,
      exchange: 'SushiSwap',
      type: 'crypto',
    }

    const symbolInfo: LibrarySymbolInfo & { chainId: string; address: string } =
      {
        ticker: symbolItem.full_name,
        name: symbolItem.symbol,
        description: symbolItem.description,
        type: symbolItem.type,
        chainId,
        address,
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

    // console.log("[resolveSymbol]: Symbol resolved", symbolName);
    setTimeout(() => onSymbolResolvedCallback(symbolInfo))
  },

  getBars: async (
    symbolInfo: LibrarySymbolInfo & { chainId: string; address: string },
    resolution: string,
    periodParams: { from: number; to: number; firstDataRequest: boolean },
    onHistoryCallback: HistoryCallback,
    onError: DatafeedErrorCallback,
  ): Promise<void> => {
    const { from, to, firstDataRequest } = periodParams
    // console.log("[getBars]: Method call", symbolInfo, resolution, from, to);
    const chainId = symbolInfo.chainId
    const address = symbolInfo.address
    try {
      const interval = timeframe[resolution]

      const earliestAllowedTimestamp = 1518147224 //9 February 2018

      let _from = from

      let maxDays = 7 //default 10 days

      switch (resolution) {
        case '60':
          maxDays = 7
          break
        case '240':
          maxDays = 20
          break
        case '720':
          maxDays = 31
          break
        case '1D':
          maxDays = 120
          break
        default:
          break
      }

      const maxSeconds = maxDays * 24 * 60 * 60 //DAILY max range is 180 days, HOURLY max range is 31 days

      let _to = to
      if (_to - _from > maxSeconds) {
        // If the requested range exceeds the maximum allowed, adjust it
        // _to = _from + maxSeconds;
        _from = _to - maxSeconds // Adjust _from to fit the max range
        if (_from < earliestAllowedTimestamp) {
          _from = earliestAllowedTimestamp
        }
      }

      const now = Math.floor(Date.now() / 1000)
      if (_to > now) {
        _to = now - 10 // Ensure _to does not exceed the current time
      }

      if (_to < _from) {
        throw new Error(
          `Invalid time range: _to is less than _from, ${_to} < ${_from}`,
        )
      }
      // If _to is less than _from, return no dat

      const data = await getTokenPriceChartV2({
        chainId: Number(chainId) as GetTokenPriceChartV2['chainId'],
        address: address as Address,
        interval: interval,
        from: _from,
        to: _to,
      })

      if (!data || !data.length) {
        // console.log("[getBars]: No data received", { firstDataRequest });
        if (firstDataRequest) {
          // console.log("[getBars]: Setting hasNoData to true");
          setHasNoData(true)
        }
        onHistoryCallback([], { noData: true })
        return
      }

      const formattedBars: Bar[] = data
        .filter((b) => b.timestamp >= _from && b.timestamp <= _to)
        .map((b) => ({
          time: b.timestamp * 1000,
          open: b.open,
          high: b.high,
          low: b.low,
          close: b.close,
        }))

      if (formattedBars.length === 0) {
        if (firstDataRequest) {
          setHasNoData(true)
        }
        onHistoryCallback([], { noData: true })
        return
      }

      // console.log(`[getBars]: returned ${formattedBars.length} bar(s)`);
      if (firstDataRequest) {
        // console.log(`[getBars]: Setting hasNoData to ${formattedBars?.length === 0}`);
        setHasNoData(formattedBars?.length === 0)
      }
      onHistoryCallback(formattedBars, {
        noData: formattedBars?.length === 0,
      })
    } catch (error: unknown) {
      console.log('[getBars]: Get error', error)
      const _error = error instanceof Error ? error.message : String(error)
      onError(_error)
    }
  },

  subscribeBars: (
    symbolInfo: LibrarySymbolInfo & { chainId: string; address: string },
    resolution: ResolutionString,
    onRealtimeCallback: (bar: Bar) => void,
    subscriberUID: string,
    _onResetCacheNeededCallback: () => void,
  ): void => {
    // console.log("[subscribeBars]: Method call with subscriberUID:", subscriberUID);
    // Subscription logic here
    const interval = resolutionToMs(resolution) // You can define your own interval here

    const timer = setInterval(() => {
      // Fetch and emit latest bar data
      fetchLatestBar(symbolInfo, resolution).then((bar) => {
        if (bar) onRealtimeCallback(bar)
      })
    }, interval)

    // Save the timer ID to clear later
    subscribers[subscriberUID] = timer
  },

  unsubscribeBars: (subscriberUID: string): void => {
    // console.log("[unsubscribeBars]: Method call with subscriberUID:", subscriberUID);
    // Unsubscribe logic here
    clearInterval(subscribers[subscriberUID])
    delete subscribers[subscriberUID]
  },
}

const subscribers = {} as Record<string, NodeJS.Timeout>

async function fetchLatestBar(
  symbolInfo: LibrarySymbolInfo & { chainId: string; address: string },
  resolution: ResolutionString,
) {
  const now = Math.floor(Date.now() / 1000) // current time in seconds
  const seconds = resolutionToSeconds(resolution)
  const from = now - seconds * 2 // look back 2 candles
  const to = now - 10 // up to 10 seconds ago to not exceed the current time

  const interval = timeframe[resolution]
  const data = await getTokenPriceChartV2({
    chainId: Number(symbolInfo.chainId) as GetTokenPriceChartV2['chainId'],
    address: symbolInfo.address as Address,
    interval: interval,
    from: from,
    to: to,
  })

  // const res = await fetch(url);
  const bars = data

  if (!bars || bars.length === 0) return null

  const latestBar = bars[bars.length - 1]
  return {
    time: latestBar.timestamp * 1000, // convert to ms
    open: latestBar.open,
    high: latestBar.high,
    low: latestBar.low,
    close: latestBar.close,
  }
}

const resolutionToMs = (resolution: ResolutionString) => {
  switch (resolution) {
    case '60':
      return 30_000 // poll every 30s
    case '240':
      return 60_000 // poll every 1m
    case '720':
      return 120_000 // poll every 2m
    case '1D':
      return 300_000 // poll every 5m
    default:
      return 60_000 // default to 1m
  }
}

const resolutionToSeconds = (resolution: ResolutionString) => {
  switch (resolution) {
    case '60':
      return 3600 // 1h
    case '240':
      return 14400 // 4h
    case '720':
      return 43200 // 12h
    case '1D':
      return 86400 // 1d
    default:
      return 3600 //1h
  }
}
