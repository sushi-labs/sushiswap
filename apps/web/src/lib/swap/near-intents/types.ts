import { EvmChainId } from 'sushi/evm'
import {
  type StellarAccountAddress,
  type StellarAddress,
  StellarChainId,
  type StellarContractAddress,
  type StellarToken,
} from 'sushi/stellar'

export const NEAR_INTENTS_SUPPORTED_EVM_CHAIN_IDS = [
  EvmChainId.ETHEREUM,
  EvmChainId.OPTIMISM,
  EvmChainId.BSC,
  EvmChainId.GNOSIS,
  EvmChainId.POLYGON,
  EvmChainId.MONAD,
  EvmChainId.BASE,
  EvmChainId.BERACHAIN,
  EvmChainId.PLASMA,
  EvmChainId.ARBITRUM,
  EvmChainId.AVALANCHE,
  EvmChainId.SCROLL,
] as const

export const NEAR_INTENTS_SUPPORTED_CHAIN_IDS = [
  ...NEAR_INTENTS_SUPPORTED_EVM_CHAIN_IDS,
  StellarChainId.STELLAR,
] as const

export type NearIntentsSupportedEvmChainId =
  (typeof NEAR_INTENTS_SUPPORTED_EVM_CHAIN_IDS)[number]

export type NearIntentsSupportedChainId =
  (typeof NEAR_INTENTS_SUPPORTED_CHAIN_IDS)[number]

export type NearIntentsStellarChainId = typeof StellarChainId.STELLAR

export type NearIntentsDepositAddressFor<
  TChainId extends NearIntentsSupportedChainId,
> = TChainId extends NearIntentsStellarChainId
  ? StellarAccountAddress
  : AddressFor<TChainId>

export type NearIntentsDepositAddress =
  NearIntentsDepositAddressFor<NearIntentsSupportedChainId>

export interface NearIntentsSdkToken {
  assetId: string
  decimals: number
  blockchain: string
  symbol: string
  price: number
  priceUpdatedAt: string
  contractAddress?: string
  assetIssuer?: string
  logoURI?: string
  name?: string
}

export type NearIntentsTokenKind =
  | 'native'
  | 'erc20'
  | 'stellar-native'
  | 'stellar-issued'

export interface NearIntentsToken<
  TChainId extends NearIntentsSupportedChainId = NearIntentsSupportedChainId,
> {
  assetId: string
  chainId: TChainId
  blockchain: string
  symbol: string
  name?: string
  decimals: number
  priceUSD: string
  priceUpdatedAt: string
  contractAddress?: AddressFor<TChainId>
  assetIssuer?: TChainId extends NearIntentsStellarChainId ? string : never
  logoURI?: string | undefined
  kind: NearIntentsTokenKind
}

export type NearIntentsEvmToken<
  TChainId extends
    NearIntentsSupportedEvmChainId = NearIntentsSupportedEvmChainId,
> = NearIntentsToken<TChainId>
export type NearIntentsStellarToken =
  NearIntentsToken<NearIntentsStellarChainId>

export interface NearIntentsCurrencyEntry<
  TChainId extends NearIntentsSupportedChainId = NearIntentsSupportedChainId,
> {
  assetId: string
  currency: CurrencyFor<TChainId>
  priceUSD: string
  priceUpdatedAt: string
}

export interface NearIntentsStellarTokenMetadata {
  issuer: StellarAddress | undefined
  contract: StellarContractAddress
  token: StellarToken
}

export interface NearIntentsActiveExecution<
  TChainId extends NearIntentsSupportedChainId = NearIntentsSupportedChainId,
> {
  chainId0: TChainId
  depositAddress: NearIntentsDepositAddressFor<TChainId>
  depositMemo?: string
  txHash: TxHashFor<TChainId>
}
