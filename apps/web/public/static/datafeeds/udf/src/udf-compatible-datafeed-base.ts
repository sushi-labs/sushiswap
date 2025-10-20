import {
	DatafeedConfiguration,
	DatafeedErrorCallback,
	GetMarksCallback,
	HistoryCallback,
	IDatafeedChartApi,
	IDatafeedQuotesApi,
	IExternalDatafeed,
	LibrarySymbolInfo,
	Mark,
	OnReadyCallback,
	QuotesCallback,
	ResolutionString,
	ResolveCallback,
	SearchSymbolResultItem,
	SearchSymbolsCallback,
	ServerTimeCallback,
	SubscribeBarsCallback,
	TimescaleMark,
	SymbolResolveExtension,
	VisiblePlotsSet,
} from '../../../charting_library/datafeed-api';

import {
	getErrorMessage,
	logMessage,
	RequestParams,
	UdfErrorResponse,
} from './helpers';

import {
	GetBarsResult,
	HistoryProvider,
	LimitedResponseConfiguration,
	PeriodParamsWithOptionalCountback,
} from './history-provider';

import { IQuotesProvider } from './iquotes-provider';
import { DataPulseProvider } from './data-pulse-provider';
import { QuotesPulseProvider } from './quotes-pulse-provider';
import { SymbolsStorage } from './symbols-storage';
import { IRequester } from './irequester';

export interface UdfCompatibleConfiguration extends DatafeedConfiguration {
	supports_search?: boolean;
	supports_group_request?: boolean;
}

export interface ResolveSymbolResponse extends LibrarySymbolInfo {
	s: undefined;

	'exchange-listed': string;
	'exchange-traded': string;

	'currency-code': string;
	'unit-id': string;

	'original-currency-code': string;

	'original-unit-id': string;

	'unit-conversion-types': string[];
	'has-intraday': boolean;
	'visible-plots-set'?: VisiblePlotsSet;
	minmovement: number;
	minmovement2?: number;
	'session-regular': string;
	'session-holidays': string;
	'supported-resolutions': ResolutionString[];
	'has-daily': boolean;
	'intraday-multipliers': string[];
	'has-weekly-and-monthly'?: boolean;
	'has-empty-bars'?: boolean;
	'volume-precision'?: number;
}

// it is hack to let's TypeScript make code flow analysis
export interface UdfSearchSymbolsResponse extends Array<SearchSymbolResultItem> {
	s?: undefined;
}

export const enum Constants {
	SearchItemsLimit = 30,
}

type UdfDatafeedMarkType<T extends TimescaleMark | Mark> = {
	[K in keyof T]: T[K] | T[K][];
} & {
	id: (string | number)[];
};

type UdfDatafeedMark = UdfDatafeedMarkType<Mark>;
type UdfDatafeedTimescaleMark = UdfDatafeedMarkType<TimescaleMark>;

function extractField<Field extends keyof Mark>(data: UdfDatafeedMark, field: Field, arrayIndex: number): Mark[Field];
function extractField<Field extends keyof TimescaleMark>(data: UdfDatafeedTimescaleMark, field: Field, arrayIndex: number): TimescaleMark[Field];
function extractField<T, TField extends keyof T>(data: T, field: TField, arrayIndex: number): T[TField] {
	const value = data[field];
	return Array.isArray(value) ? value[arrayIndex] : value;
}

/**
 * This class implements interaction with UDF-compatible datafeed.
 * See [UDF protocol reference](@docs/connecting_data/UDF.md)
 */
export class UDFCompatibleDatafeedBase implements IExternalDatafeed, IDatafeedQuotesApi, IDatafeedChartApi {
	protected _configuration: UdfCompatibleConfiguration = defaultConfiguration();
	private readonly _datafeedURL: string;
	private readonly _configurationReadyPromise: Promise<void>;

	private _symbolsStorage: SymbolsStorage | null = null;

	private readonly _historyProvider: HistoryProvider;
	private readonly _dataPulseProvider: DataPulseProvider;

	private readonly _quotesProvider: IQuotesProvider;
	private readonly _quotesPulseProvider: QuotesPulseProvider;

	private readonly _requester: IRequester;

	protected constructor(
		datafeedURL: string,
		quotesProvider: IQuotesProvider,
		requester: IRequester,
		updateFrequency: number = 10 * 1000,
		limitedServerResponse?: LimitedResponseConfiguration
	) {
		this._datafeedURL = datafeedURL;
		this._requester = requester;
		this._historyProvider = new HistoryProvider(
			datafeedURL,
			this._requester,
			limitedServerResponse
		);
		this._quotesProvider = quotesProvider;

		this._dataPulseProvider = new DataPulseProvider(this._historyProvider, updateFrequency);
		this._quotesPulseProvider = new QuotesPulseProvider(this._quotesProvider);

		this._configurationReadyPromise = this._requestConfiguration()
			.then((configuration: UdfCompatibleConfiguration | null) => {
				if (configuration === null) {
					configuration = defaultConfiguration();
				}

				this._setupWithConfiguration(configuration);
			});
	}

	public onReady(callback: OnReadyCallback): void {
		this._configurationReadyPromise.then(() => {
			callback(this._configuration);
		});
	}

	public getQuotes(symbols: string[], onDataCallback: QuotesCallback, onErrorCallback: (msg: string) => void): void {
		this._quotesProvider.getQuotes(symbols).then(onDataCallback).catch(onErrorCallback);
	}

	public subscribeQuotes(symbols: string[], fastSymbols: string[], onRealtimeCallback: QuotesCallback, listenerGuid: string): void {
		this._quotesPulseProvider.subscribeQuotes(symbols, fastSymbols, onRealtimeCallback, listenerGuid);
	}

	public unsubscribeQuotes(listenerGuid: string): void {
		this._quotesPulseProvider.unsubscribeQuotes(listenerGuid);
	}

	public getMarks(symbolInfo: LibrarySymbolInfo, from: number, to: number, onDataCallback: GetMarksCallback<Mark>, resolution: ResolutionString): void {
		if (!this._configuration.supports_marks) {
			return;
		}

		const requestParams: RequestParams = {
			symbol: symbolInfo.ticker || '',
			from: from,
			to: to,
			resolution: resolution,
		};

		this._send<Mark[] | UdfDatafeedMark>('marks', requestParams)
			.then((response: Mark[] | UdfDatafeedMark) => {
				if (!Array.isArray(response)) {
					const result: Mark[] = [];
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
							hoveredBorderWidth: extractField(response, 'hoveredBorderWidth', i),
							imageUrl: extractField(response, 'imageUrl', i),
							showLabelWhenImageLoaded: extractField(response, 'showLabelWhenImageLoaded', i),
						});
					}

					response = result;
				}

				onDataCallback(response);
			})
			.catch((error?: string | Error) => {
				logMessage(`UdfCompatibleDatafeed: Request marks failed: ${getErrorMessage(error)}`);
				onDataCallback([]);
			});
	}

	public getTimescaleMarks(symbolInfo: LibrarySymbolInfo, from: number, to: number, onDataCallback: GetMarksCallback<TimescaleMark>, resolution: ResolutionString): void {
		if (!this._configuration.supports_timescale_marks) {
			return;
		}

		const requestParams: RequestParams = {
			symbol: symbolInfo.ticker || '',
			from: from,
			to: to,
			resolution: resolution,
		};

		this._send<TimescaleMark[] | UdfDatafeedTimescaleMark>('timescale_marks', requestParams)
			.then((response: TimescaleMark[] | UdfDatafeedTimescaleMark) => {
				if (!Array.isArray(response)) {
					const result: TimescaleMark[] = [];
					for (let i = 0; i < response.id.length; ++i) {
						result.push({
							id: extractField(response, 'id', i),
							time: extractField(response, 'time', i),
							color: extractField(response, 'color', i),
							label: extractField(response, 'label', i),
							tooltip: extractField(response, 'tooltip', i),
							imageUrl: extractField(response, 'imageUrl', i),
							showLabelWhenImageLoaded: extractField(response, 'showLabelWhenImageLoaded', i),
						});
					}

					response = result;
				}

				onDataCallback(response);
			})
			.catch((error?: string | Error) => {
				logMessage(`UdfCompatibleDatafeed: Request timescale marks failed: ${getErrorMessage(error)}`);
				onDataCallback([]);
			});
	}

	public getServerTime(callback: ServerTimeCallback): void {
		if (!this._configuration.supports_time) {
			return;
		}

		this._send<string>('time')
			.then((response: string) => {
				const time = parseInt(response);
				if (!isNaN(time)) {
					callback(time);
				}
			})
			.catch((error?: string | Error) => {
				logMessage(`UdfCompatibleDatafeed: Fail to load server time, error=${getErrorMessage(error)}`);
			});
	}

	public searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void {
		if (this._configuration.supports_search) {
			const params: RequestParams = {
				limit: Constants.SearchItemsLimit,
				query: userInput.toUpperCase(),
				type: symbolType,
				exchange: exchange,
			};

			this._send<UdfSearchSymbolsResponse | UdfErrorResponse>('search', params)
				.then((response: UdfSearchSymbolsResponse | UdfErrorResponse) => {
					if (response.s !== undefined) {
						logMessage(`UdfCompatibleDatafeed: search symbols error=${response.errmsg}`);
						onResult([]);
						return;
					}

					onResult(response);
				})
				.catch((reason?: string | Error) => {
					logMessage(`UdfCompatibleDatafeed: Search symbols for '${userInput}' failed. Error=${getErrorMessage(reason)}`);
					onResult([]);
				});
		} else {
			if (this._symbolsStorage === null) {
				throw new Error('UdfCompatibleDatafeed: inconsistent configuration (symbols storage)');
			}

			this._symbolsStorage.searchSymbols(userInput, exchange, symbolType, Constants.SearchItemsLimit)
				.then(onResult)
				.catch(onResult.bind(null, []));
		}
	}

	public resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: DatafeedErrorCallback, extension?: SymbolResolveExtension): void {
		logMessage('Resolve requested');

		const currencyCode = extension && extension.currencyCode;
		const unitId = extension && extension.unitId;

		const resolveRequestStartTime = Date.now();
		function onResultReady(symbolInfo: LibrarySymbolInfo): void {
			logMessage(`Symbol resolved: ${Date.now() - resolveRequestStartTime}ms`);
			onResolve(symbolInfo);
		}

		if (!this._configuration.supports_group_request) {
			const params: RequestParams = {
				symbol: symbolName,
			};
			if (currencyCode !== undefined) {
				params.currencyCode = currencyCode;
			}
			if (unitId !== undefined) {
				params.unitId = unitId;
			}

			this._send<ResolveSymbolResponse | UdfErrorResponse>('symbols', params)
				.then((response: ResolveSymbolResponse | UdfErrorResponse) => {
					if (response.s !== undefined) {
						onError('unknown_symbol');
					} else {
						const symbol = response.name;
						const listedExchange = response.listed_exchange ?? response['exchange-listed'];
						const tradedExchange = response.exchange ?? response['exchange-traded'];

						const result: LibrarySymbolInfo = {
							...response,
							name: symbol,
							base_name: [listedExchange + ':' + symbol],
							listed_exchange: listedExchange,
							exchange: tradedExchange,
							ticker: response.ticker,
							currency_code: response.currency_code ?? response['currency-code'],
							original_currency_code: response.original_currency_code ?? response['original-currency-code'],
							unit_id: response.unit_id ?? response['unit-id'],
							original_unit_id: response.original_unit_id ?? response['original-unit-id'],
							unit_conversion_types: response.unit_conversion_types ?? response['unit-conversion-types'],
							has_intraday: response.has_intraday ?? response['has-intraday'] ?? false,
							visible_plots_set: response.visible_plots_set ?? response['visible-plots-set'],
							minmov: response.minmovement ?? response.minmov ?? 0,
							minmove2: response.minmovement2 ?? response.minmove2,
							session: response.session ?? response['session-regular'],
							session_holidays: response.session_holidays ?? response['session-holidays'],
							supported_resolutions: response.supported_resolutions ?? response['supported-resolutions'] ?? this._configuration.supported_resolutions ?? [],
							has_daily: response.has_daily ?? response['has-daily'] ?? true,
							intraday_multipliers: response.intraday_multipliers ?? response['intraday-multipliers'] ?? ['1', '5', '15', '30', '60'],
							has_weekly_and_monthly: response.has_weekly_and_monthly ?? response['has-weekly-and-monthly'],
							has_empty_bars: response.has_empty_bars ?? response['has-empty-bars'],
							volume_precision: response.volume_precision ?? response['volume-precision'],
							format: response.format ?? 'price',
						};
						onResultReady(result);
					}
				})
				.catch((reason?: string | Error) => {
					logMessage(`UdfCompatibleDatafeed: Error resolving symbol: ${getErrorMessage(reason)}`);
					onError('unknown_symbol');
				});
		} else {
			if (this._symbolsStorage === null) {
				throw new Error('UdfCompatibleDatafeed: inconsistent configuration (symbols storage)');
			}

			this._symbolsStorage.resolveSymbol(symbolName, currencyCode, unitId).then(onResultReady).catch(onError);
		}
	}

	public getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, periodParams: PeriodParamsWithOptionalCountback, onResult: HistoryCallback, onError: DatafeedErrorCallback): void {
		this._historyProvider.getBars(symbolInfo, resolution, periodParams)
			.then((result: GetBarsResult) => {
				onResult(result.bars, result.meta);
			})
			.catch(onError);
	}

	public subscribeBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string, _onResetCacheNeededCallback: () => void): void {
		this._dataPulseProvider.subscribeBars(symbolInfo, resolution, onTick, listenerGuid);
	}

	public unsubscribeBars(listenerGuid: string): void {
		this._dataPulseProvider.unsubscribeBars(listenerGuid);
	}

	protected _requestConfiguration(): Promise<UdfCompatibleConfiguration | null> {
		return this._send<UdfCompatibleConfiguration>('config')
			.catch((reason?: string | Error) => {
				logMessage(`UdfCompatibleDatafeed: Cannot get datafeed configuration - use default, error=${getErrorMessage(reason)}`);
				return null;
			});
	}

	private _send<T>(urlPath: string, params?: RequestParams): Promise<T> {
		return this._requester.sendRequest<T>(this._datafeedURL, urlPath, params);
	}

	private _setupWithConfiguration(configurationData: UdfCompatibleConfiguration): void {
		this._configuration = configurationData;

		if (configurationData.exchanges === undefined) {
			configurationData.exchanges = [];
		}

		if (!configurationData.supports_search && !configurationData.supports_group_request) {
			throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
		}

		if (configurationData.supports_group_request || !configurationData.supports_search) {
			this._symbolsStorage = new SymbolsStorage(this._datafeedURL, configurationData.supported_resolutions || [], this._requester);
		}

		logMessage(`UdfCompatibleDatafeed: Initialized with ${JSON.stringify(configurationData)}`);
	}
}

function defaultConfiguration(): UdfCompatibleConfiguration {
	return {
		supports_search: false,
		supports_group_request: true,
		supported_resolutions: [
			'1' as ResolutionString,
			'5' as ResolutionString,
			'15' as ResolutionString,
			'30' as ResolutionString,
			'60' as ResolutionString,
			'1D' as ResolutionString,
			'1W' as ResolutionString,
			'1M' as ResolutionString,
		],
		supports_marks: false,
		supports_timescale_marks: false,
	};
}
