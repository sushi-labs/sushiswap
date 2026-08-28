import type { CrossmintEnvironment } from 'src/lib/crossmint/crossmint-config'

export const CROSSMINT_STAGING_FALLBACK_TOKEN_PRICE_USD = 1

export interface FiatBuyTokenEstimate {
  amount?: number
  priceUsd?: number
  usesStagingFallback: boolean
}

export interface FiatBuyTokenPrice {
  priceUsd?: number
  usesStagingFallback: boolean
}

export function getFiatBuyTokenPrice({
  allowStagingFallback = true,
  environment,
  sushiTokenPrice,
}: {
  allowStagingFallback?: boolean
  environment: CrossmintEnvironment | undefined
  sushiTokenPrice: number | undefined
}): FiatBuyTokenPrice {
  const validSushiTokenPrice =
    sushiTokenPrice !== undefined &&
    Number.isFinite(sushiTokenPrice) &&
    sushiTokenPrice > 0
      ? sushiTokenPrice
      : undefined
  const usesStagingFallback =
    validSushiTokenPrice === undefined &&
    allowStagingFallback &&
    environment === 'staging'

  return {
    priceUsd: usesStagingFallback
      ? CROSSMINT_STAGING_FALLBACK_TOKEN_PRICE_USD
      : validSushiTokenPrice,
    usesStagingFallback,
  }
}

export function getFiatBuyTokenEstimate({
  allowStagingFallback = true,
  amountUsd,
  environment,
  sushiTokenPrice,
}: {
  allowStagingFallback?: boolean
  amountUsd: number | undefined
  environment: CrossmintEnvironment | undefined
  sushiTokenPrice: number | undefined
}): FiatBuyTokenEstimate {
  const { priceUsd, usesStagingFallback } = getFiatBuyTokenPrice({
    allowStagingFallback,
    environment,
    sushiTokenPrice,
  })

  if (
    amountUsd === undefined ||
    !Number.isFinite(amountUsd) ||
    amountUsd < 0 ||
    priceUsd === undefined
  ) {
    return priceUsd === undefined
      ? { usesStagingFallback }
      : { priceUsd, usesStagingFallback }
  }

  const amount = amountUsd / priceUsd

  return Number.isFinite(amount)
    ? { amount, priceUsd, usesStagingFallback }
    : { priceUsd, usesStagingFallback }
}

export function formatFiatBuyTokenAmount(
  amount: number,
  locale: string,
): string {
  return new Intl.NumberFormat(locale, {
    maximumSignificantDigits: 8,
  }).format(amount)
}

export function formatFiatBuyTokenInputAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 8,
    useGrouping: false,
  }).format(amount)
}

export function getFiatBuyPaymentAmount({
  exchangeRate,
  minorUnits,
  tokenAmount,
  tokenPriceUsd,
}: {
  exchangeRate: number
  minorUnits: number
  tokenAmount: string
  tokenPriceUsd: number
}): string | undefined {
  if (tokenAmount === '') return ''

  const parsedTokenAmount = Number(tokenAmount)

  if (
    !Number.isFinite(parsedTokenAmount) ||
    parsedTokenAmount < 0 ||
    !Number.isFinite(tokenPriceUsd) ||
    tokenPriceUsd <= 0 ||
    !Number.isFinite(exchangeRate) ||
    exchangeRate <= 0 ||
    !Number.isInteger(minorUnits) ||
    minorUnits < 0
  ) {
    return undefined
  }

  const paymentAmount = parsedTokenAmount * tokenPriceUsd * exchangeRate

  if (!Number.isFinite(paymentAmount)) return undefined

  const [whole, fraction] = paymentAmount.toFixed(minorUnits).split('.')
  const trimmedFraction = fraction?.replace(/0+$/, '')
  const formattedAmount = trimmedFraction
    ? `${whole}.${trimmedFraction}`
    : whole

  return Number(formattedAmount) === 0 ? '' : formattedAmount
}
