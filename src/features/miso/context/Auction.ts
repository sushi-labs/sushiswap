import { Currency, CurrencyAmount, Fraction, JSBI, Percent, Price, Token, ZERO } from '@sushiswap/core-sdk'
import { ZERO_PERCENT } from 'app/constants'
import {
  AuctionDocument,
  AuctionStatus,
  AuctionTemplate,
  RawAuctionInfo,
  RawLauncherInfo,
  RawMarketInfo,
} from 'app/features/miso/context/types'

export class Auction {
  public readonly template: AuctionTemplate
  public readonly auctionToken: Token
  public readonly paymentToken: Currency
  public readonly liquidityToken?: Token
  public readonly auctionInfo: RawAuctionInfo
  public readonly marketInfo?: RawMarketInfo
  public readonly launcherInfo?: RawLauncherInfo
  public readonly auctionDocuments: AuctionDocument
  public readonly pointListAddress: string
  // @ts-ignore TYPE NEEDS FIXING
  public readonly auctionLauncherAddress: string
  public readonly status: AuctionStatus

  public constructor({
    template,
    auctionToken,
    paymentToken,
    liquidityToken,
    auctionInfo,
    marketInfo,
    launcherInfo,
    auctionDocuments,
    pointListAddress,
    status,
  }: {
    template: AuctionTemplate
    auctionToken: Token
    paymentToken: Currency
    liquidityToken?: Token
    auctionInfo: RawAuctionInfo
    marketInfo?: RawMarketInfo
    launcherInfo?: RawLauncherInfo
    auctionDocuments: AuctionDocument
    pointListAddress: string
    status: AuctionStatus
  }) {
    this.template = template
    this.auctionToken = auctionToken
    this.auctionInfo = auctionInfo
    this.paymentToken = paymentToken
    this.marketInfo = marketInfo
    this.launcherInfo = launcherInfo
    this.liquidityToken = liquidityToken
    this.auctionDocuments = auctionDocuments
    this.pointListAddress = pointListAddress
    this.status = status
  }

  public get isOwner(): boolean | undefined {
    return this.marketInfo?.isAdmin
  }

  public get totalTokensCommitted(): CurrencyAmount<Currency> | undefined {
    if (this.marketInfo?.commitments) {
      return CurrencyAmount.fromRawAmount(this.paymentToken, JSBI.BigInt(this.marketInfo.commitments))
    }
  }

  public get remainingTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    if (this.status === AuctionStatus.UPCOMING) {
      const now = Date.now()
      const interval = this.auctionInfo.startTime.mul('1000').toNumber() - now

      let days = Math.floor(interval / (1000 * 60 * 60 * 24))
      let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    if (this.status === AuctionStatus.LIVE) {
      const now = Date.now()
      const interval = this.auctionInfo.endTime.mul('1000').toNumber() - now

      let days = Math.floor(interval / (1000 * 60 * 60 * 24))
      let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  public get rate(): Price<Token, Currency> | undefined {
    if (this.auctionInfo.rate) {
      return new Price(
        this.auctionToken,
        this.paymentToken,
        JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.auctionToken.decimals))),
        JSBI.BigInt(this.auctionInfo.rate)
      )
    }
  }

  public get totalTokens(): CurrencyAmount<Token> | undefined {
    if (this.auctionInfo.totalTokens) {
      return CurrencyAmount.fromRawAmount(this.auctionToken, JSBI.BigInt(this.auctionInfo.totalTokens))
    }
  }

  public get commitmentsTotal(): CurrencyAmount<Currency> | undefined {
    if (this.auctionInfo.commitmentsTotal) {
      return CurrencyAmount.fromRawAmount(this.paymentToken, JSBI.BigInt(this.auctionInfo.commitmentsTotal))
    }
  }

  public get currentPrice(): Price<Token, Currency> | undefined {
    if (this.template === AuctionTemplate.CROWDSALE) {
      return this.rate
    }

    if (this.template === AuctionTemplate.DUTCH_AUCTION) {
      const tPrice = this.tokenPrice
      const startTime = this.auctionInfo.startTime.mul('1000').toNumber()
      const endTime = this.auctionInfo.endTime.mul('1000').toNumber()
      const now = Date.now()

      if (now <= startTime) return this.startPrice
      if (this.startPrice && this.reservePrice) {
        const { numerator, denominator } = this.startPrice.subtract(
          this.startPrice.subtract(this.reservePrice).multiply(new Fraction(now - startTime, endTime - startTime))
        )

        const fPrice = new Price(this.auctionToken, this.paymentToken, denominator, numerator)
        if (tPrice) {
          if (tPrice.greaterThan(fPrice)) return tPrice
          return fPrice
        }
      }
    }

    if (this.template === AuctionTemplate.BATCH_AUCTION) {
      return this.tokenPrice
    }
  }

  public get reservePrice(): Price<Token, Currency> | undefined {
    if (this.auctionInfo.minimumPrice) {
      return new Price(
        this.auctionToken,
        this.paymentToken,
        JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.auctionToken.decimals))),
        JSBI.BigInt(this.auctionInfo.minimumPrice)
      )
    }
  }

  public get tokenPrice(): Price<Token, Currency> | undefined {
    if (
      [AuctionTemplate.DUTCH_AUCTION, AuctionTemplate.BATCH_AUCTION].includes(this.template) &&
      this.commitmentsTotal &&
      this.totalTokens
    ) {
      const { denominator, numerator } = this.commitmentsTotal.divide(this.totalTokens)
      return new Price(this.totalTokens.currency, this.commitmentsTotal.currency, denominator, numerator)
    }

    return this.rate
  }

  public get startPrice(): Price<Token, Currency> | undefined {
    if (this.template == AuctionTemplate.CROWDSALE) return this.rate

    if (this.auctionInfo.startPrice) {
      return new Price(
        this.auctionToken,
        this.paymentToken,
        JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.auctionToken.decimals))),
        JSBI.BigInt(this.auctionInfo.startPrice)
      )
    }
  }

  public get minimumPrice(): Price<Token, Currency> | undefined {
    if (this.auctionInfo.minimumPrice) {
      return new Price(
        this.auctionToken,
        this.paymentToken,
        JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.auctionToken.decimals))),
        JSBI.BigInt(this.auctionInfo.minimumPrice)
      )
    }
  }

  public get minimumCommitment(): CurrencyAmount<Currency> | undefined {
    if (this.template === AuctionTemplate.CROWDSALE) {
      if (this.totalTokens && this.rate) {
        const { denominator, numerator } = this.totalTokens.divide(this.rate)
        return CurrencyAmount.fromFractionalAmount(this.paymentToken, numerator, denominator)
      }
    }

    if (this.template === AuctionTemplate.DUTCH_AUCTION) {
      if (this.totalTokens && this.reservePrice) {
        const { denominator, numerator } = this.totalTokens.multiply(this.reservePrice)
        return CurrencyAmount.fromFractionalAmount(this.paymentToken, numerator, denominator)
      }
    }

    if (this.template === AuctionTemplate.BATCH_AUCTION) {
      if (this.auctionInfo.minimumCommitmentAmount) {
        return CurrencyAmount.fromRawAmount(this.paymentToken, JSBI.BigInt(this.auctionInfo.minimumCommitmentAmount))
      }
    }
  }

  public get minimumTargetRaised(): CurrencyAmount<Currency> | undefined {
    if (this.template === AuctionTemplate.BATCH_AUCTION) {
      return this.minimumCommitment
    }

    if (this.minimumPrice && this.totalTokens) {
      const { numerator, denominator } = this.minimumPrice.asFraction.multiply(this.totalTokens)
      return CurrencyAmount.fromFractionalAmount(this.paymentToken, numerator, denominator)
    }
  }

  public get maximumTargetRaised(): CurrencyAmount<Currency> | undefined {
    if (this.startPrice && this.totalTokens) {
      const { numerator, denominator } = this.startPrice.asFraction.multiply(this.totalTokens)
      return CurrencyAmount.fromFractionalAmount(this.paymentToken, numerator, denominator)
    }
  }

  public get remainingPercentage(): Percent | undefined {
    if (this.template === AuctionTemplate.BATCH_AUCTION) {
      return this.status === AuctionStatus.LIVE ? new Percent('1', '1') : ZERO_PERCENT
    }

    if (
      this.template === AuctionTemplate.DUTCH_AUCTION &&
      this.totalTokens &&
      this.currentPrice &&
      this.commitmentsTotal
    ) {
      const hundred = new Percent('1', '1')
      if (this.currentPrice.quote(this.totalTokens).greaterThan(ZERO)) {
        const percentageRaise = new Percent(
          this.commitmentsTotal.quotient,
          this.currentPrice.quote(this.totalTokens).quotient.toString()
        )

        return hundred.subtract(percentageRaise)
      }
      return hundred
    }

    if (this.template === AuctionTemplate.CROWDSALE && this.maximumTargetRaised && this.commitmentsTotal) {
      return new Percent(
        this.maximumTargetRaised.subtract(this.commitmentsTotal).quotient,
        this.maximumTargetRaised.quotient
      )
    }
  }

  public tokenAmount(amount: CurrencyAmount<Currency>): CurrencyAmount<Currency> | undefined {
    if (!this.currentPrice || !amount.greaterThan(0)) return

    if (this.template === AuctionTemplate.BATCH_AUCTION) {
      if (this.currentPrice.equalTo(ZERO)) return this.totalTokens
    }

    return this.currentPrice.invert().quote(amount)
  }

  public get tokensClaimable(): CurrencyAmount<Currency> | undefined {
    if (this.marketInfo?.tokensClaimable) {
      return CurrencyAmount.fromRawAmount(this.auctionToken, JSBI.BigInt(this.marketInfo.tokensClaimable))
    }
  }

  public get launcherHasFunds(): boolean {
    if (!this.launcherInfo) return false
    return this.launcherInfo.token1Balance.gt(0) || this.launcherInfo.token2Balance.gt(0)
  }

  public get canWithdrawDeposits(): boolean {
    return !!(this.isOwner && this.launcherInfo?.launched && this.launcherHasFunds)
  }

  public get canFinalize(): boolean {
    if (!this.launcherInfo?.launched && this.auctionInfo.finalized) return true
    if (this.auctionInfo.finalized) return false
    if (this.status !== AuctionStatus.FINISHED) return false
    if (this.isOwner) return true

    const endTime = this.auctionInfo.endTime.mul('1000').toNumber()
    const now = Date.now()
    if (endTime + 60 * 60 * 24 * 7 * 1000 < now) return true

    if (!this.launcherInfo?.liquidityTemplate) return false
    return this.launcherInfo?.liquidityTemplate > 0
  }

  public get canClaim(): boolean {
    if (!this.auctionInfo.finalized) return false
    if (!this.marketInfo) return false

    const tokensClaimable = JSBI.BigInt(this.marketInfo.tokensClaimable)
    return JSBI.greaterThan(tokensClaimable, JSBI.BigInt(0))
  }

  public get canWithdraw(): boolean {
    if (!this.auctionInfo.finalized) return false
    if (!this.marketInfo) return false
    if (this.auctionInfo.auctionSuccessful) return false
    return JSBI.greaterThan(JSBI.BigInt(this.marketInfo.commitments), JSBI.BigInt(0))
  }

  public get liquidityAmount(): CurrencyAmount<Token> | undefined {
    if (this.launcherInfo && this.liquidityToken) {
      return CurrencyAmount.fromRawAmount(this.liquidityToken, JSBI.BigInt(this.launcherInfo.liquidityAdded))
    }
  }
}
