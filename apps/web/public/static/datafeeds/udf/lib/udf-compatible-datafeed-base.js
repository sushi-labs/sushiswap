import { DataPulseProvider } from './data-pulse-provider'
import { getErrorMessage, logMessage } from './helpers'
import { HistoryProvider } from './history-provider'
import { QuotesPulseProvider } from './quotes-pulse-provider'
import { SymbolsStorage } from './symbols-storage'
function extractField(data, field, arrayIndex) {
  const value = data[field]
  return Array.isArray(value) ? value[arrayIndex] : value
}
/**
 * This class implements interaction with UDF-compatible datafeed.
 * See [UDF protocol reference](@docs/connecting_data/UDF.md)
 */
export class UDFCompatibleDatafeedBase {
  constructor(
    datafeedURL,
    quotesProvider,
    requester,
    updateFrequency = 10 * 1000,
    limitedServerResponse,
  ) {
    this._configuration = defaultConfiguration()
    this._symbolsStorage = null
    this._datafeedURL = datafeedURL
    this._requester = requester
    this._historyProvider = new HistoryProvider(
      datafeedURL,
      this._requester,
      limitedServerResponse,
    )
    this._quotesProvider = quotesProvider
    this._dataPulseProvider = new DataPulseProvider(
      this._historyProvider,
      updateFrequency,
    )
    this._quotesPulseProvider = new QuotesPulseProvider(this._quotesProvider)
    this._configurationReadyPromise = this._requestConfiguration().then(
      (configuration) => {
        if (configuration === null) {
          configuration = defaultConfiguration()
        }
        this._setupWithConfiguration(configuration)
      },
    )
  }
  onReady(callback) {
    this._configurationReadyPromise.then(() => {
      callback(this._configuration)
    })
  }
  getQuotes(symbols, onDataCallback, onErrorCallback) {
    this._quotesProvider
      .getQuotes(symbols)
      .then(onDataCallback)
      .catch(onErrorCallback)
  }
  subscribeQuotes(symbols, fastSymbols, onRealtimeCallback, listenerGuid) {
    this._quotesPulseProvider.subscribeQuotes(
      symbols,
      fastSymbols,
      onRealtimeCallback,
      listenerGuid,
    )
  }
  unsubscribeQuotes(listenerGuid) {
    this._quotesPulseProvider.unsubscribeQuotes(listenerGuid)
  }
  getMarks(symbolInfo, from, to, onDataCallback, resolution) {
    if (!this._configuration.supports_marks) {
      return
    }
    const requestParams = {
      symbol: symbolInfo.ticker || '',
      from: from,
      to: to,
      resolution: resolution,
    }
    this._send('marks', requestParams)
      .then((response) => {
        if (!Array.isArray(response)) {
          const result = []
          for (let i = 0; i < response.id.length; ++i) {
            result.push({
              id: extractField(response, 'id', i),
              time: extractField(response, 'time', i),
              color: extractField(response, 'color', i),
              text: extractField(response, 'text', i),
              label: extractField(response, 'label', i),
              labelFontColor: extractField(response, 'labelFontColor', i),
              minSize: extractField(response, 'minSize', i),
              borderWidth: extractField(response, 'borderWidth', i),
              hoveredBorderWidth: extractField(
                response,
                'hoveredBorderWidth',
                i,
              ),
              imageUrl: extractField(response, 'imageUrl', i),
              showLabelWhenImageLoaded: extractField(
                response,
                'showLabelWhenImageLoaded',
                i,
              ),
            })
          }
          response = result
        }
        onDataCallback(response)
      })
      .catch((error) => {
        logMessage(
          `UdfCompatibleDatafeed: Request marks failed: ${getErrorMessage(error)}`,
        )
        onDataCallback([])
      })
  }
  getTimescaleMarks(symbolInfo, from, to, onDataCallback, resolution) {
    if (!this._configuration.supports_timescale_marks) {
      return
    }
    const requestParams = {
      symbol: symbolInfo.ticker || '',
      from: from,
      to: to,
      resolution: resolution,
    }
    this._send('timescale_marks', requestParams)
      .then((response) => {
        if (!Array.isArray(response)) {
          const result = []
          for (let i = 0; i < response.id.length; ++i) {
            result.push({
              id: extractField(response, 'id', i),
              time: extractField(response, 'time', i),
              color: extractField(response, 'color', i),
              label: extractField(response, 'label', i),
              tooltip: extractField(response, 'tooltip', i),
              imageUrl: extractField(response, 'imageUrl', i),
              showLabelWhenImageLoaded: extractField(
                response,
                'showLabelWhenImageLoaded',
                i,
              ),
            })
          }
          response = result
        }
        onDataCallback(response)
      })
      .catch((error) => {
        logMessage(
          `UdfCompatibleDatafeed: Request timescale marks failed: ${getErrorMessage(error)}`,
        )
        onDataCallback([])
      })
  }
  getServerTime(callback) {
    if (!this._configuration.supports_time) {
      return
    }
    this._send('time')
      .then((response) => {
        const time = Number.parseInt(response)
        if (!isNaN(time)) {
          callback(time)
        }
      })
      .catch((error) => {
        logMessage(
          `UdfCompatibleDatafeed: Fail to load server time, error=${getErrorMessage(error)}`,
        )
      })
  }
  searchSymbols(userInput, exchange, symbolType, onResult) {
    if (this._configuration.supports_search) {
      const params = {
        limit: 30 /* Constants.SearchItemsLimit */,
        query: userInput.toUpperCase(),
        type: symbolType,
        exchange: exchange,
      }
      this._send('search', params)
        .then((response) => {
          if (response.s !== undefined) {
            logMessage(
              `UdfCompatibleDatafeed: search symbols error=${response.errmsg}`,
            )
            onResult([])
            return
          }
          onResult(response)
        })
        .catch((reason) => {
          logMessage(
            `UdfCompatibleDatafeed: Search symbols for '${userInput}' failed. Error=${getErrorMessage(reason)}`,
          )
          onResult([])
        })
    } else {
      if (this._symbolsStorage === null) {
        throw new Error(
          'UdfCompatibleDatafeed: inconsistent configuration (symbols storage)',
        )
      }
      this._symbolsStorage
        .searchSymbols(
          userInput,
          exchange,
          symbolType,
          30 /* Constants.SearchItemsLimit */,
        )
        .then(onResult)
        .catch(onResult.bind(null, []))
    }
  }
  resolveSymbol(symbolName, onResolve, onError, extension) {
    logMessage('Resolve requested')
    const currencyCode = extension && extension.currencyCode
    const unitId = extension && extension.unitId
    const resolveRequestStartTime = Date.now()
    function onResultReady(symbolInfo) {
      logMessage(`Symbol resolved: ${Date.now() - resolveRequestStartTime}ms`)
      onResolve(symbolInfo)
    }
    if (!this._configuration.supports_group_request) {
      const params = {
        symbol: symbolName,
      }
      if (currencyCode !== undefined) {
        params.currencyCode = currencyCode
      }
      if (unitId !== undefined) {
        params.unitId = unitId
      }
      this._send('symbols', params)
        .then((response) => {
          if (response.s !== undefined) {
            onError('unknown_symbol')
          } else {
            const symbol = response.name
            const listedExchange =
              response.listed_exchange ?? response['exchange-listed']
            const tradedExchange =
              response.exchange ?? response['exchange-traded']
            const result = {
              ...response,
              name: symbol,
              base_name: [listedExchange + ':' + symbol],
              listed_exchange: listedExchange,
              exchange: tradedExchange,
              ticker: response.ticker,
              currency_code:
                response.currency_code ?? response['currency-code'],
              original_currency_code:
                response.original_currency_code ??
                response['original-currency-code'],
              unit_id: response.unit_id ?? response['unit-id'],
              original_unit_id:
                response.original_unit_id ?? response['original-unit-id'],
              unit_conversion_types:
                response.unit_conversion_types ??
                response['unit-conversion-types'],
              has_intraday:
                response.has_intraday ?? response['has-intraday'] ?? false,
              visible_plots_set:
                response.visible_plots_set ?? response['visible-plots-set'],
              minmov: response.minmovement ?? response.minmov ?? 0,
              minmove2: response.minmovement2 ?? response.minmove2,
              session: response.session ?? response['session-regular'],
              session_holidays:
                response.session_holidays ?? response['session-holidays'],
              supported_resolutions:
                response.supported_resolutions ??
                response['supported-resolutions'] ??
                this._configuration.supported_resolutions ??
                [],
              has_daily: response.has_daily ?? response['has-daily'] ?? true,
              intraday_multipliers: response.intraday_multipliers ??
                response['intraday-multipliers'] ?? [
                  '1',
                  '5',
                  '15',
                  '30',
                  '60',
                ],
              has_weekly_and_monthly:
                response.has_weekly_and_monthly ??
                response['has-weekly-and-monthly'],
              has_empty_bars:
                response.has_empty_bars ?? response['has-empty-bars'],
              volume_precision:
                response.volume_precision ?? response['volume-precision'],
              format: response.format ?? 'price',
            }
            onResultReady(result)
          }
        })
        .catch((reason) => {
          logMessage(
            `UdfCompatibleDatafeed: Error resolving symbol: ${getErrorMessage(reason)}`,
          )
          onError('unknown_symbol')
        })
    } else {
      if (this._symbolsStorage === null) {
        throw new Error(
          'UdfCompatibleDatafeed: inconsistent configuration (symbols storage)',
        )
      }
      this._symbolsStorage
        .resolveSymbol(symbolName, currencyCode, unitId)
        .then(onResultReady)
        .catch(onError)
    }
  }
  getBars(symbolInfo, resolution, periodParams, onResult, onError) {
    this._historyProvider
      .getBars(symbolInfo, resolution, periodParams)
      .then((result) => {
        onResult(result.bars, result.meta)
      })
      .catch(onError)
  }
  subscribeBars(
    symbolInfo,
    resolution,
    onTick,
    listenerGuid,
    _onResetCacheNeededCallback,
  ) {
    this._dataPulseProvider.subscribeBars(
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
    )
  }
  unsubscribeBars(listenerGuid) {
    this._dataPulseProvider.unsubscribeBars(listenerGuid)
  }
  _requestConfiguration() {
    return this._send('config').catch((reason) => {
      logMessage(
        `UdfCompatibleDatafeed: Cannot get datafeed configuration - use default, error=${getErrorMessage(reason)}`,
      )
      return null
    })
  }
  _send(urlPath, params) {
    return this._requester.sendRequest(this._datafeedURL, urlPath, params)
  }
  _setupWithConfiguration(configurationData) {
    this._configuration = configurationData
    if (configurationData.exchanges === undefined) {
      configurationData.exchanges = []
    }
    if (
      !configurationData.supports_search &&
      !configurationData.supports_group_request
    ) {
      throw new Error(
        'Unsupported datafeed configuration. Must either support search, or support group request',
      )
    }
    if (
      configurationData.supports_group_request ||
      !configurationData.supports_search
    ) {
      this._symbolsStorage = new SymbolsStorage(
        this._datafeedURL,
        configurationData.supported_resolutions || [],
        this._requester,
      )
    }
    logMessage(
      `UdfCompatibleDatafeed: Initialized with ${JSON.stringify(configurationData)}`,
    )
  }
}
function defaultConfiguration() {
  return {
    supports_search: false,
    supports_group_request: true,
    supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
    supports_marks: false,
    supports_timescale_marks: false,
  }
}
