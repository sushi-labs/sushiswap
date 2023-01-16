import prisma from '@sushiswap/database'

import { Currency } from './enums'

/**
 * Get the price of a token
 * @param chainId
 * @param address
 * @param date Prices that are updated after this date will be returned
 * @param currency
 * @returns
 */
export async function getPrice(chainId: number, address: string, date: Date, currency: Currency = Currency.USD) {
  const price = await prisma.token.findFirst({
    select: { address: true, derivedUSD: true, derivedNative: true },
    where:
      currency === Currency.USD
        ? { AND: { chainId, address, status: 'APPROVED', derivedUSD: { gt: 0 }, updatedAt: { gt: date } } }
        : { AND: { chainId, address, status: 'APPROVED', derivedNative: { gt: 0 }, updatedAt: { gt: date } } },
  })
  await prisma.$disconnect()

  if (
    !price ||
    (currency === Currency.USD && !price.derivedUSD) ||
    (currency === Currency.NATIVE && !price.derivedNative)
  ) {
    return undefined
  }

  return currency === Currency.USD ? Number(price.derivedUSD) : Number(price.derivedNative)
}

/**
 * Get all token prices given a chain id.
 * @param chainId
 * @param date Prices that are updated after this date will be returned
 * @param currency
 * @returns
 */
export async function getPricesByChainId(chainId: number, date: Date, currency: Currency = Currency.USD) {
  const prices = await prisma.token.findMany({
    select: { address: true, derivedUSD: true, derivedNative: true },
    where:
      currency === Currency.USD
        ? { AND: { chainId, status: 'APPROVED', derivedUSD: { gt: 0 }, updatedAt: { gt: date } } }
        : { AND: { chainId, status: 'APPROVED', derivedNative: { gt: 0 }, updatedAt: { gt: date } } },
  })
  await prisma.$disconnect()
  if (!prices.length) {
    return {}
  }

  return prices.reduce((acc, token) => {
    acc[token.address] = currency === Currency.USD ? Number(token.derivedUSD) : Number(token.derivedNative)
    return acc
  }, {} as Record<string, number>)

  
}
