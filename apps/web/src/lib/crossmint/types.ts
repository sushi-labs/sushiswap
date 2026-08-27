import type { CrossmintSupportedFiatCurrency } from 'src/config'
import type {
  CrossmintCheckoutCatalogToken,
  SerializedCrossmintToken,
} from './crossmint-config'

export type CrossmintCheckoutTokenClass = 'memecoin' | 'onramp'

export interface CrossmintCheckoutTokenFeatures {
  creditCardPayment: boolean
}

export interface CrossmintCheckoutTokenAvailability {
  available: boolean
  features: CrossmintCheckoutTokenFeatures
  token: string
}

export interface CrossmintCheckoutTokenEntry {
  available: true
  features: CrossmintCheckoutTokenFeatures
  locator: string
  token: CrossmintCheckoutCatalogToken
}

export interface CrossmintCheckoutTokensResponse {
  data: CrossmintCheckoutTokenAvailability[]
  nextCursor?: string
  previousCursor?: string
}

export interface CreateCrossmintOrderInput {
  amountUsd: string
  paymentCurrency?: CrossmintSupportedFiatCurrency
  receiptEmail: string
  token: SerializedCrossmintToken
  walletAddress: string
}

export interface CrossmintMoney {
  amount: string
  currency: string
}

export interface CrossmintReceiveAmountRange {
  lowerBound: string
  upperBound: string
}

export interface CrossmintCreatedOrderQuote {
  expiresAt?: string
  receiveAmount?: CrossmintReceiveAmountRange
  totalPrice?: CrossmintMoney
}

export interface CrossmintCreatedOrder {
  clientSecret: string
  orderId: string
  quote?: CrossmintCreatedOrderQuote
}
