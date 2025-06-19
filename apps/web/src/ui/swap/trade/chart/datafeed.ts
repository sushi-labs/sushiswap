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
} from 'public/static/charting_library/charting_library'
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
    // console.log("[resolveSymbol]: Method call", symbolName);

    const chainId = symbolName.split('-')[0]
    const address = symbolName.split('-')[1]
    const name = symbolName.split('-')[2]
    const symbol = symbolName.split('-')[3] || name
    const symbolItem = {
      symbol,
      full_name: symbol,
      description: name,
      exchange: '',
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
      const timeframe: Record<string, GetTokenPriceChartV2['interval']> = {
        60: 'HOURLY',
        240: 'HOURLY',
        720: 'HOURLY',
        '1D': 'DAILY',
      }
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
    _symbolInfo: LibrarySymbolInfo,
    _resolution: ResolutionString,
    _onRealtimeCallback: (bar: Bar) => void,
    _subscriberUID: string,
    _onResetCacheNeededCallback: () => void,
  ): void => {
    // console.log("[subscribeBars]: Method call with subscriberUID:", subscriberUID);
    // Subscription logic here
  },

  unsubscribeBars: (_subscriberUID: string): void => {
    // console.log("[unsubscribeBars]: Method call with subscriberUID:", subscriberUID);
    // Unsubscribe logic here
  },
}
