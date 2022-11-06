import { Prisma, PrismaClient } from '@prisma/client'

/**
 * Filters token prices to only include the ones that are new or have changed.
 * @param client
 * @param prices
 * @returns
 */
export async function filterTokenPrices(
  client: PrismaClient,
  prices: Prisma.TokenPriceCreateManyInput[]
): Promise<{ pricesToCreate: Prisma.TokenPriceCreateManyInput[]; pricesToUpdate: Prisma.TokenPriceCreateManyInput[] }> {
  const tokenPriceSelect = Prisma.validator<Prisma.TokenPriceSelect>()({
    id: true,
    derivedNative: true,
    usd: true,
  })

  const priceFound = await client.tokenPrice.findMany({
    where: {
      id: { in: prices.map((price) => price.id) },
    },
    select: tokenPriceSelect,
  })

  const pricesToCreate = prices.filter((price) => {
    const priceExists = priceFound.find((p) => p.id === price.id)
    if (!priceExists) {
      return true
    }
    return false
  })

  const pricesToUpdate = prices.filter((price) => {
    const priceExists = priceFound.find((p) => p.id === price.id)
    if (!priceExists) {
      return false
    }
    if (price.derivedNative != priceExists.derivedNative || price.usd != priceExists.usd) {
      return true
    }
    return false
  })
  console.log(
    `TRANSFORM - Filtering prices, ${pricesToCreate.length} prices should be created and ${pricesToUpdate.length} prices should be updated.`
  )
  return { pricesToCreate, pricesToUpdate }
}
