import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Price, Token } from '@sushiswap/core-sdk'

export type CookerFn<I, O> = (x: I) => O

export enum MisoCookerAction {
  CREATE_TOKEN = 0,
  DEPLOY_POINT_LIST = 1,
  CREATE_MARKET_DUTCH = 2,
  CREATE_MARKET_CROWDSALE = 3,
  CREATE_MARKET_BATCH = 4,
  LIQUIDITY_LAUNCHER = 5,
}

interface TokenData {
  templateId: BigNumber
  tokenName: string
  tokenSymbol: string
  tokenSupply: CurrencyAmount<Token>
}

interface LiquidityLauncherData {
  launcherTemplateId: BigNumber
  liqPercentage: number
  liqLockTime: number
}

interface GeneralAuctionData {
  marketFactoryAddress: string
  auctionTokenAddress: string
  tokenAmount: CurrencyAmount<Token>
  startDate: Date
  endDate: Date
  paymentCurrency: Currency
  account: string
  pointListAddress: string
}

interface DutchAuctionData extends GeneralAuctionData {
  startPrice: Price<Token, Currency>
  endPrice: Price<Token, Currency>
}

interface CrowdsaleAuctionData extends GeneralAuctionData {
  fixedPrice: Price<Token, Currency>
  minimumTarget: CurrencyAmount<Currency>
}

interface BatchAuctionData extends GeneralAuctionData {
  minimumRaised: CurrencyAmount<Currency>
}

type AddPayload = {
  action: MisoCookerAction
  data: string
  value?: BigNumberish
}

type CreateTokenPayload = {
  templateId: BigNumber
  integratorFeeAccount: string
  tokenData: TokenData
}

type DeployPointListPayload = {
  listOwner: string
  accounts: string[]
  amounts: string[]
}

type CreateMarketDutchPayload = {
  templateId: BigNumber
  tokenSupply: number
  integratorFeeAccount: string
  auctionData: DutchAuctionData
}
type CreateMarketCrowdsalePayload = {
  templateId: BigNumber
  tokenSupply: number
  integratorFeeAccount: string
  auctionData: CrowdsaleAuctionData
}

type CreateMarketBatchPayload = {
  templateId: BigNumber
  tokenSupply: number
  integratorFeeAccount: string
  auctionData: BatchAuctionData
}

type CreateLiquidityLauncherPayload = {
  templateId: BigNumber
  auctionTokenAddress?: string
  tokenSupply: number
  integratorFeeAccount: string
  launcherData: LiquidityLauncherData
}

export type AddAction = CookerFn<AddPayload, void>
export type CreateTokenAction = CookerFn<CreateTokenPayload, void>
export type DeployPointlistAction = CookerFn<DeployPointListPayload, void>
export type CreateMarketDutchAction = CookerFn<CreateMarketDutchPayload, void>
export type CreateMarketCrowdsaleAction = CookerFn<CreateMarketCrowdsalePayload, void>
export type CreateMarketBatchAction = CookerFn<CreateMarketBatchPayload, void>
export type CreateLiquidityLauncherAction = CookerFn<CreateLiquidityLauncherPayload, void>
