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
  const where = (
    currency === Currency.USD
      ? { AND: { chainId, address, status: 'APPROVED', derivedUSD: { gt: 0 }, updatedAt: { gt: date } } }
      : { AND: { chainId, address, status: 'APPROVED', derivedNative: { gt: 0 }, updatedAt: { gt: date } } }
  ) as any // TODO: fix this, need to export TokenWhereInput from @sushiswap/database

  const token = await prisma.token.findFirst({
    select: { address: true, derivedUSD: true, derivedNative: true },
    where,
  })
  await prisma.$disconnect()

  if (
    !token ||
    (currency === Currency.USD && !token.derivedUSD) ||
    (currency === Currency.NATIVE && !token.derivedNative)
  ) {
    return undefined
  }

  return currency === Currency.USD ? Number(token.derivedUSD) : Number(token.derivedNative)
}

/**
 * Get all token prices given a chain id.
 * @param chainId
 * @param date Prices that are updated after this date will be returned
 * @param currency
 * @returns
 */
export async function getPricesByChainId(chainId: number, date: Date, currency: Currency = Currency.USD) {
  const where = (
    currency === Currency.USD
      ? { AND: { chainId, status: 'APPROVED', derivedUSD: { gt: 0 }, updatedAt: { gt: date } } }
      : { AND: { chainId, status: 'APPROVED', derivedNative: { gt: 0 }, updatedAt: { gt: date } } }
  ) as any // TODO: fix this, need to export TokenWhereInput from @sushiswap/database

  const tokens = await prisma.token.findMany({
    select: { address: true, derivedUSD: true, derivedNative: true },
    where,
  })
  await prisma.$disconnect()
  if (!tokens.length) {
    return []
  }
  return tokens.reduce<Record<string, number>>((acc, token) => {
    acc[token.address] = currency === Currency.USD ? Number(token.derivedUSD) : Number(token.derivedNative)
    return acc
  }, {})

  // return tokens.map((token) => ({
  //   [token.address]: currency === Currency.USD ? Number(token.derivedUSD) : Number(token.derivedNative),
  // })).flat()
}
