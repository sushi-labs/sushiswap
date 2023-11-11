import { createClient } from '@sushiswap/database'

import { Currency } from '../enums.js'

/**
 * Get the price of a token
 * @param chainId
 * @param address
 * @param date Prices that are updated after this date will be returned
 * @param currency
 * @returns
 */
export async function getPrice(
  chainId: number,
  address: string,
  date: Date,
  currency: Currency = Currency.USD,
) {
  const client = await createClient()
  const price = await client.token.findFirst({
    select: { address: true, derivedUSD: true, derivedNative: true },
    where:
      currency === Currency.USD
        ? {
            AND: {
              chainId,
              address,
              derivedUSD: { gt: 0 },
              updatedAt: { gt: date },
            },
          }
        : {
            AND: {
              chainId,
              address,
              derivedNative: { gt: 0 },
              updatedAt: { gt: date },
            },
          },
  })
  await client.$disconnect()

  if (
    !price ||
    (currency === Currency.USD && !price.derivedUSD) ||
    (currency === Currency.NATIVE && !price.derivedNative)
  ) {
    return undefined
  }

  return currency === Currency.USD
    ? Number(price.derivedUSD)
    : Number(price.derivedNative)
}

/**
 * Get all token prices.
 * @param chainId
 * @param date Prices that are updated after this date will be returned
 * @param currency
 * @returns
 */
export async function getPrices(date: Date, currency: Currency = Currency.USD) {
  const client = await createClient()
  const prices = await client.token.findMany({
    select: {
      address: true,
      derivedUSD: true,
      derivedNative: true,
      chainId: true,
    },
    where:
      currency === Currency.USD
        ? {
            AND: {
              derivedUSD: { gt: 0 },
              status: 'APPROVED',
              updatedAt: { gt: date },
            },
          }
        : {
            AND: {
              derivedNative: { gt: 0 },
              status: 'APPROVED',
              updatedAt: { gt: date },
            },
          },
  })
  await client.$disconnect()
  if (!prices.length) {
    return {}
  }

  return prices.reduce((acc, token) => {
    acc[token.chainId] = acc[token.chainId] || {}
    ;(acc[token.chainId] || {})[token.address] =
      currency === Currency.USD
        ? Number(token.derivedUSD)
        : Number(token.derivedNative)

    return acc
  }, {} as Record<number, Record<string, number>>)
}

/**
 * Get all token prices given a chain id.
 * @param chainId
 * @param date Prices that are updated after this date will be returned
 * @param currency
 * @returns
 */
export async function getPricesByChainId(
  chainId: number,
  date: Date,
  currency: Currency = Currency.USD,
) {
  const client = await createClient()
  const prices = await client.token.findMany({
    select: { address: true, derivedUSD: true, derivedNative: true },
    where:
      currency === Currency.USD
        ? {
            AND: {
              chainId,
              status: 'APPROVED',
              derivedUSD: { gt: 0 },
              updatedAt: { gt: date },
            },
          }
        : {
            AND: {
              chainId,
              status: 'APPROVED',
              derivedNative: { gt: 0 },
              updatedAt: { gt: date },
            },
          },
  })
  await client.$disconnect()
  if (!prices.length) {
    return {}
  }

  return prices.reduce((acc, token) => {
    acc[token.address] =
      currency === Currency.USD
        ? Number(token.derivedUSD)
        : Number(token.derivedNative)
    return acc
  }, {} as Record<string, number>)
}
