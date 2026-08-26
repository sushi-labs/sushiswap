import type { SerializedCrossmintToken } from './crossmint-config'

export type CrossmintCheckoutTokenClass = 'memecoin' | 'onramp'

export interface CrossmintCheckoutTokenFeatures {
  creditCardPayment: boolean
}

export interface CrossmintCheckoutTokenAvailability {
  available: boolean
  features: CrossmintCheckoutTokenFeatures
  token: string
}

export interface CrossmintCheckoutTokensResponse {
  data: CrossmintCheckoutTokenAvailability[]
  nextCursor?: string
  previousCursor?: string
}

export interface CreateCrossmintOrderInput {
  amountUsd: string
  receiptEmail: string
  token: SerializedCrossmintToken
  walletAddress: string
}

export interface CrossmintCreatedOrder {
  clientSecret: string
  orderId: string
  verificationMessage?: string
}

export interface LinkCrossmintWalletInput {
  proof?: string
  receiptEmail: string
  token: SerializedCrossmintToken
  walletAddress: string
}

export interface CrossmintLinkedWallet {
  verificationChallenge?: string
  verified: boolean
}
