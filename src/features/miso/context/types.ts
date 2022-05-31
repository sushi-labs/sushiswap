import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Price, Token } from '@sushiswap/core-sdk'
import { GetState, SetState } from 'zustand'

export type StoreSlice<T extends object, E extends object = T> = (
  set: SetState<E extends T ? E : E & T>,
  get: GetState<E extends T ? E : E & T>
) => T

export enum LiquidityLauncherTemplate {
  PostAuctionLauncher = 1,
}

export enum AuctionTemplate {
  NOT_SET = 0,
  CROWDSALE = 1,
  DUTCH_AUCTION = 2,
  BATCH_AUCTION = 3,
  HYPERBOLIC_AUCTION = 4,
}

export enum AuctionStatus {
  LIVE = 1,
  UPCOMING = 2,
  FINISHED = 3,
}

export interface AuctionTokenInfo {
  addr: string
  decimals: BigNumber
  name: string
  symbol: string
}

export interface AuctionDocument {
  icon: string
  description: string
  website: string
  whitepaper: string
  tokenomics: string
  github: string
  telegram: string
  wechat: string
  discord: string
  medium: string
  reddit: string
  twitter: string
  docs: string
  desktopBanner: string
  mobileBanner: string
  bannedCountries: string
  bannedWarning: string
  category: string
}

export interface AuctionPaymentCurrencyInfo {
  addr: string
  decimals: BigNumber
  name: string
  symbol: string
}

export interface RawAuction {
  addr: string
  endTime: BigNumber
  finalized: boolean
  startTime: BigNumber
  templateId: BigNumber
  tokenInfo: {
    addr: string
    decimals: BigNumber
    name: string
    symbol: string
  }
}

export interface RawAuctionInfo {
  addr: string
  auctionSuccessful: boolean
  commitmentsTotal: BigNumber
  documents: AuctionDocument[]
  endTime: BigNumber
  finalized: boolean
  goal: BigNumber
  paymentCurrency: string
  paymentCurrencyInfo: AuctionPaymentCurrencyInfo
  rate?: BigNumber
  startTime: BigNumber
  tokenInfo: AuctionTokenInfo
  totalTokens: BigNumber
  totalTokensCommitted?: BigNumber
  usePointList: boolean
  minimumPrice?: BigNumber
  startPrice?: BigNumber
  minimumCommitmentAmount?: BigNumber
  liquidityTemplate?: number
  lpTokenAddress?: string
}

export interface RawMarketInfo {
  claimed: BigNumber
  commitments: BigNumber
  tokensClaimable: BigNumber
  isAdmin: boolean
}

export interface RawLauncherInfo {
  address: string
  locktime: number
  unlock: BigNumber
  liquidityPercent: BigNumber
  launched: boolean
  liquidityAdded: BigNumber
  token1Balance: BigNumber
  token2Balance: BigNumber
  liquidityTemplate: number
}

export interface Auction {
  addr: string
  endTime: BigNumber
  finalized: boolean
  startTime: BigNumber
  templateId: BigNumber
  tokenInfo: AuctionTokenInfo
  status: AuctionStatus
  title: string
  auctionTemplate: AuctionTemplate
}

export interface AuctionCommitment {
  txHash: string
  blockNumber: number
  address: string
  amount: CurrencyAmount<Currency>
}

export type WhitelistEntry = {
  account: string
  amount: string
}

export enum AuctionCategory {
  DEFI = 'DeFi',
  GAMING = 'Gaming',
  UTILITY = 'Utility',
  SOCIAL = 'Social',
  GOVERNANCE = 'Governance',
  NFTS = 'NFTs',
}

export enum TokenType {
  FIXED = 1,
  MINTABLE = 2,
  SUSHI = 3,
}

export enum TokenSetup {
  NOT_SET = 0,
  CREATE = 1,
  PROVIDE = 2,
}

export interface AuctionCreationWizardInput {
  tokenSetupType: TokenSetup
  paymentCurrencyAddress: string
  startDate: string
  endDate: string
  tokenType: TokenType
  tokenAddress?: string
  tokenName?: string
  tokenSymbol?: string
  tokenSupply?: number
  tokenAmount: number
  tokenForLiquidity: number
  auctionType: AuctionTemplate
  fixedPrice?: string
  minimumTarget?: number
  minimumRaised?: string
  startPrice?: string
  endPrice?: string
  liqLockTime?: number
  liqPercentage: number
  liqLauncherEnabled: boolean
  whitelistEnabled: boolean
  whitelistAddresses: WhitelistEntry[]
}

export type AuctionCreationWizardInputFormatted = Omit<
  AuctionCreationWizardInput,
  | 'startDate'
  | 'endDate'
  | 'tokenSupply'
  | 'tokenAmount'
  | 'tokenForLiquidity'
  | 'fixedPrice'
  | 'minimumTarget'
  | 'minimumRaised'
  | 'startPrice'
  | 'endPrice'
> & {
  paymentCurrency: Currency
  startDate: Date
  endDate: Date
  tokenAmount: CurrencyAmount<Token>
  tokenSupply?: CurrencyAmount<Token>
  auctionType: AuctionTemplate
  fixedPrice?: Price<Token, Currency>
  minimumTarget?: CurrencyAmount<Currency>
  minimumRaised?: CurrencyAmount<Currency>
  startPrice?: Price<Token, Currency>
  endPrice?: Price<Token, Currency>
  auctionToken: Token
  accounts: string[]
  amounts: string[]
}
