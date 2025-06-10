import type { QuoteData } from '../../../charting_library/datafeed-api'

import type { UdfOkResponse } from './helpers'

export interface UdfQuotesResponse extends UdfOkResponse {
  d: QuoteData[]
}

export interface IQuotesProvider {
  getQuotes(symbols: string[]): Promise<QuoteData[]>
}
