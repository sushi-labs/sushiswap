import type { CrossmintSupportedFiatCurrency } from 'src/config'
import type {
  CrossmintCheckoutCatalogToken,
  CrossmintEnvironment,
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

export type CrossmintOrderPhase = 'quote' | 'payment' | 'delivery' | 'completed'

export interface CrossmintOrderMetadata {
  description?: string
  imageUrl?: string
  name?: string
}

export interface CrossmintOrderDeliveryToken {
  contractAddress?: string
  decimals?: number
  locator?: string
  mintHash?: string
  quantity?: string
  symbol?: string
  tokenId?: string
}

export interface CrossmintOrderDelivery {
  completedAt?: string
  recipient?: {
    locator?: string
    walletAddress?: string
  }
  status?: string
  tokens?: CrossmintOrderDeliveryToken[]
  txId?: string
}

export interface CrossmintOrderLineItem {
  chain?: string
  delivery?: CrossmintOrderDelivery
  executionMode?: 'exact-in' | 'exact-out'
  metadata?: CrossmintOrderMetadata
  quantity?: number
  quote?: {
    status?: string
    totalPrice?: CrossmintMoney
  }
}

export interface CrossmintOrderPayment {
  currency?: string
  failureReason?: {
    code?: string
    message?: string
  }
  method?: string
  received?: CrossmintMoney
  refunded?: CrossmintMoney
  status?: string
  totalPaid?: CrossmintMoney
}

export interface CrossmintOrder {
  createdAt?: string
  lineItems?: CrossmintOrderLineItem[]
  locale?: string
  orderId: string
  payment?: CrossmintOrderPayment
  phase?: CrossmintOrderPhase
  quote?: {
    expiresAt?: string
    quotedAt?: string
    status?: string
    totalPrice?: CrossmintMoney
  }
}

export interface CrossmintOrdersPage {
  data: CrossmintOrder[]
  environment: CrossmintEnvironment
  nextCursor?: string
  previousCursor?: string
}

export interface ListCrossmintOrdersInput {
  cursor?: string
  limit?: number
  recipientAddress: readonly string[]
  sort?: 'asc' | 'desc'
}
