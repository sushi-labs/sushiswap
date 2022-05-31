import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, Fraction, JSBI, Percent, Price, Token } from '@sushiswap/core-sdk'
import {
  AuctionCreationWizardInput,
  AuctionCreationWizardInputFormatted,
  TokenSetup,
} from 'app/features/miso/context/types'
import { toWei } from 'web3-utils'

export const getPriceEntity = (price: string, auctionToken: Token, paymentToken: Currency) => {
  const base = CurrencyAmount.fromRawAmount(
    paymentToken,
    JSBI.BigInt(parseUnits(price, paymentToken.decimals).toString())
  )
  const quote = CurrencyAmount.fromRawAmount(
    auctionToken,
    JSBI.BigInt(parseUnits('1', auctionToken.decimals).toString())
  )
  return new Price({ baseAmount: quote, quoteAmount: base })
}

export const formatCreationFormData = (
  data: AuctionCreationWizardInput,
  paymentCurrency: Currency,
  auctionToken: Token
): AuctionCreationWizardInputFormatted => {
  const { startDate, endDate, liqPercentage, whitelistAddresses, liqLockTime } = data

  const [accounts, amounts] = whitelistAddresses.reduce<[string[], string[]]>(
    (acc, cur) => {
      acc[0].push(cur.account)
      acc[1].push(
        new Fraction(
          toWei(cur.amount),
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18 - paymentCurrency.decimals))
        ).quotient.toString()
      )
      return acc
    },
    [[], []]
  )

  const startPrice = data.startPrice
    ? getPriceEntity(data.startPrice.toString(), auctionToken, paymentCurrency)
    : undefined
  const endPrice = data.endPrice ? getPriceEntity(data.endPrice.toString(), auctionToken, paymentCurrency) : undefined
  const fixedPrice = data.fixedPrice
    ? getPriceEntity(data.fixedPrice.toString(), auctionToken, paymentCurrency)
    : undefined
  const tokenAmount = CurrencyAmount.fromRawAmount(
    auctionToken,
    JSBI.BigInt(parseUnits(data.tokenAmount.toString(), auctionToken.decimals).toString())
  )
  const tokenSupply =
    data.tokenSetupType === TokenSetup.CREATE && data.tokenSupply
      ? CurrencyAmount.fromRawAmount(
          auctionToken,
          JSBI.BigInt(parseUnits(data.tokenSupply.toString(), auctionToken.decimals).toString())
        )
      : undefined
  const minimumTarget =
    fixedPrice && tokenAmount && data.minimumTarget
      ? fixedPrice.quote(tokenAmount).multiply(new Percent(data.minimumTarget, '100'))
      : undefined
  const minimumRaised = data.minimumRaised
    ? CurrencyAmount.fromRawAmount(
        paymentCurrency,
        JSBI.BigInt(parseUnits(data.minimumRaised.toString(), paymentCurrency.decimals).toString())
      )
    : undefined

  return {
    ...data,
    accounts,
    amounts,
    liqLockTime: Number(liqLockTime) * 24 * 60 * 60,
    liqPercentage: data.liqLauncherEnabled ? Number(liqPercentage) * 100 : 0,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    auctionToken,
    paymentCurrency,
    tokenAmount,
    tokenSupply,
    startPrice,
    endPrice,
    fixedPrice,
    minimumTarget,
    minimumRaised,
  }
}
