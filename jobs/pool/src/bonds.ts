import './lib/wagmi.js'

import {
  BONDS_ENABLED_NETWORKS,
  BONDS_SUBGRAPH_URL,
  BondChainId,
  getBondDiscount,
  getBondMarketsPrices,
  getMarketIdFromChainIdAuctioneerMarket,
} from '@sushiswap/bonds-sdk'
import { getTokenPricesChainV2 } from '@sushiswap/client'
import {
  BondMarketType,
  BondVestingType,
  Prisma,
  Token,
} from '@sushiswap/database'
import { getPublicClient } from '@wagmi/core'
import { getIdFromChainIdAddress, isPromiseFulfilled } from 'sushi'
import { Address, getAddress } from 'viem'
import { getBuiltGraphSDK } from '.graphclient'

export async function bonds() {
  console.log('Starting bonds')

  try {
    const startTime = performance.now()

    const bonds = await extract()
    const transformed = transform(bonds)

    const endTime = performance.now()
    console.log(
      `COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(
        1,
      )} seconds. `,
    )
  } catch (e) {
    console.error(e)
  }
}

async function extract() {
  const result = await Promise.allSettled(
    BONDS_ENABLED_NETWORKS.map(extractChain),
  )

  return result.filter(isPromiseFulfilled).map((r) => r.value)
}

async function extractChain(chainId: BondChainId) {
  const client = getPublicClient({ chainId })
  const sdk = getBuiltGraphSDK({
    url: BONDS_SUBGRAPH_URL[chainId],
  })

  const { bonds } = await sdk.BondMarkets()

  const prices = await getTokenPricesChainV2({ chainId })

  const marketIds = bonds.map((bond) =>
    getMarketIdFromChainIdAuctioneerMarket({
      auctioneerAddress: bond.auctioneer as Address,
      chainId,
      marketNumber: bond.marketId,
    }),
  )
  const marketPrices = await getBondMarketsPrices({ client, marketIds })

  const tokenSet = new Set<string>()
  const tokens: Pick<
    Token,
    'address' | 'chainId' | 'decimals' | 'symbol' | 'name'
  >[] = []

  const bondsWithDiscounts = await Promise.allSettled(
    bonds.flatMap((bond, i) => {
      const marketId = marketIds[i]!
      const marketPrice = marketPrices.find(
        (p) => p.marketId === marketId,
      )?.marketPrice

      if (!marketPrice) return []

      if (!tokenSet.has(bond.quoteToken.address)) {
        tokenSet.add(bond.quoteToken.address)
        tokens.push({
          id: getIdFromChainIdAddress(
            chainId,
            bond.quoteToken.address as Address,
          ),
          chainId,
          address: bond.quoteToken.address as Address,
          decimals: bond.quoteToken.decimals,
          symbol: bond.quoteToken.symbol,
        })
      }

      const quoteTokenPriceUSD = prices[getAddress(bond.quoteToken.address)]
      const payoutTokenPriceUSD = prices[getAddress(bond.payoutToken.address)]

      const discount = getBondDiscount({
        marketScale: bond.scale,
        marketPrice: marketPrice,
        payoutToken: {
          priceUSD: payoutTokenPriceUSD,
          decimals: bond.payoutToken.decimals,
        },
        quoteToken: {
          priceUSD: quoteTokenPriceUSD,
          decimals: bond.quoteToken.decimals,
        },
      })

      return { ...bond, discount }
    }),
  )

  return {
    chainId,
    tokens,
    bonds: bondsWithDiscounts.filter(isPromiseFulfilled).map((r) => r.value),
  }
}

const MarketTypes: Record<string, BondMarketType> = {
  dynamic: BondMarketType.Dynamic,
  static: BondMarketType.Static,
}

// TODO: Add support for other vesting types
const VestingTypes: Record<string, BondVestingType> = {
  'fixed-term': BondVestingType.Fixed,
}

function transform(
  chainsWithBonds: Awaited<ReturnType<typeof extract>>,
): Prisma.BondMarketCreateManyInput[] {
  return chainsWithBonds.flatMap(({ chainId, bonds }) =>
    bonds.flatMap((bond) => {
      const id = getMarketIdFromChainIdAuctioneerMarket({
        auctioneerAddress: bond.auctioneer as Address,
        chainId,
        marketNumber: bond.marketId,
      })

      const marketType = MarketTypes[bond.type]
      if (!marketType) {
        console.error(`Unknown market type: ${bond.type} for ${id}`)
        return []
      }

      const vestingType = VestingTypes[bond.vestingType]
      if (!vestingType) {
        console.error(`Unknown vesting type: ${bond.vestingType} for ${id}`)
        return []
      }

      return {
        id,
        chainId,

        marketId: bond.marketId,
        marketType: marketType,
        tellerAddress: bond.teller as Address,

        start: bond.start,
        end: bond.conclusion,

        discount: bond.discount,

        minPrice: bond.minPrice,
        capacity: bond.capacity,
        capacityInQuote: bond.capacityInQuote,

        vesting: bond.vesting,
        vestingType: vestingType,

        issuerId: getIdFromChainIdAddress(chainId, bond.owner as Address),

        quoteTokenId: getIdFromChainIdAddress(
          chainId,
          bond.quoteToken.address as Address,
        ),
        totalBondedAmount: bond.totalBondedAmount,

        payoutTokenId: getIdFromChainIdAddress(
          chainId,
          bond.payoutToken.address as Address,
        ),
        totalPayoutAmount: bond.totalPayoutAmount,
      } satisfies Prisma.BondMarketCreateManyInput
    }),
  )
}
