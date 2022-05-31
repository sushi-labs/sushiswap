import { AddressZero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, JSBI, Percent, Price, Token } from '@sushiswap/core-sdk'
import {
  AuctionCreationFormInputFormatted,
  AuctionCreationFormInputValidated,
} from 'app/features/miso/AuctionCreationForm/index'

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
  data: AuctionCreationFormInputValidated,
  auctionToken: Token,
  paymentCurrency: Currency
): AuctionCreationFormInputFormatted => {
  const { token, paymentCurrencyAddress, startDate, endDate, pointListAddress, ...rest } = data
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
    ...rest,
    pointListAddress: pointListAddress || AddressZero,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    auctionToken,
    paymentCurrency,
    tokenAmount,
    startPrice,
    endPrice,
    fixedPrice,
    minimumTarget,
    minimumRaised,
  }
}
