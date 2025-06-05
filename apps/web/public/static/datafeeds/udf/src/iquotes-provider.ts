import { QuoteData } from '../../../charting_library/datafeed-api';

import {
	UdfOkResponse,
} from './helpers';

export interface UdfQuotesResponse extends UdfOkResponse {
	d: QuoteData[];
}

export interface IQuotesProvider {
	getQuotes(symbols: string[]): Promise<QuoteData[]>;
}
