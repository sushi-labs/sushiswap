import {
  AuctionType,
  BONDS_SUBGRAPH_URL,
  getBondDiscount,
  getMarketIdFromChainIdAuctioneerMarket,
  getMarketsPrices,
} from '@sushiswap/bonds-sdk'
import {
  type BondMarketsQueryVariables,
  getBuiltGraphSDK,
} from '@sushiswap/graph-client'
import { config } from '@sushiswap/viem-config'
import { getIdFromChainIdAddress, isPromiseFulfilled } from 'sushi'
import { createPublicClient, getAddress } from 'viem'
import { type BondsApiSchema } from '../../../pure/bonds/bonds/schema'
import { getTokenPricesChainV2 } from '../../../pure/token-price/v2/chainId/tokenPricesChain'
import { BondSchema } from '../schema'

const onlyOpen = (start: bigint | null, end: bigint | null) =>
  (!start || Date.now() / 1000 > start) && end && Date.now() / 1000 < end

const convertAuctionTypes = (auctionTypes: AuctionType[]) => {
  const map = {
    [AuctionType.Dynamic]: 'dynamic',
    [AuctionType.Static]: 'static',
  } as const

  return auctionTypes.map((type) => map[type])
}

export async function getBondsFromSubgraph(
  args: typeof BondsApiSchema._output,
) {
  const auctioneers =
    args.ids?.map(({ auctioneerAddress }) => auctioneerAddress) || null
  const marketIdFilter =
    args.ids?.map(({ marketNumber }) => Number(marketNumber)) || null

  const auctionTypes = convertAuctionTypes(args.auctionTypes)

  const query = {
    first: args.take,
    where: {
      auctioneer_in: auctioneers,
      marketId_in: marketIdFilter,
      hasClosed: args.onlyOpen ? false : null,
      owner_in: args.issuerIds || null,
      type_in: auctionTypes,
    },
  } satisfies BondMarketsQueryVariables

  Object.entries(query.where).map(([key, value]) => {
    if (value === null) delete query.where[key as keyof typeof query.where]
  })

  const bonds = await Promise.allSettled(
    args.chainIds.map(async (chainId) => {
      const sdk = getBuiltGraphSDK({ url: BONDS_SUBGRAPH_URL[chainId] })

      const { bonds } = await sdk.BondMarkets(query)
      const prices = await getTokenPricesChainV2({ chainId })

      const bondsParsed = bonds
        .map((bond) => BondSchema.safeParse(bond))
        .flatMap((bond) => {
          if (!bond.success) {
            console.log(bond.error)
            return []
          }
          return bond.data
        })
        .filter((bond) => {
          if (auctioneers && !auctioneers?.includes(bond.auctioneer))
            return false
          if (
            marketIdFilter &&
            !marketIdFilter?.includes(Number(bond.marketId))
          )
            return false
          if (
            typeof args.onlyOpen !== 'undefined' &&
            args.onlyOpen !== onlyOpen(bond.start, bond.conclusion)
          ) {
            return false
          }

          return true
        })

      const marketIds = bondsParsed.map((bond) =>
        getMarketIdFromChainIdAuctioneerMarket({
          chainId,
          auctioneerAddress: bond.auctioneer,
          marketNumber: bond.marketId,
        }),
      )

      const marketPrices = await getMarketsPrices({
        client: createPublicClient(config[chainId]),
        marketIds,
      })

      return bondsParsed
        .flatMap((bond, i) => {
          const quoteTokenPriceUSD = prices[getAddress(bond.quoteToken.address)]
          const payoutTokenPriceUSD =
            prices[getAddress(bond.payoutToken.address)]

          const marketId = marketIds[i]
          const marketPrice = marketPrices.find(
            (el) => el.marketId === marketId,
          )?.marketPrice

          if (
            !quoteTokenPriceUSD ||
            !payoutTokenPriceUSD ||
            !marketPrice ||
            !bond.scale
          )
            return []

          const { discount, discountedPrice, quoteTokensPerPayoutToken } =
            getBondDiscount({
              marketScale: bond.scale,
              marketPrice: marketPrice,
              payoutToken: {
                priceUSD: payoutTokenPriceUSD,
                decimals: Number(bond.payoutToken.decimals),
              },
              quoteToken: {
                priceUSD: quoteTokenPriceUSD,
                decimals: Number(bond.quoteToken.decimals),
              },
            })

          return {
            id: marketIds[i]!,
            chainId,

            marketId: Number(bond.marketId),
            auctionType: bond.type,

            tellerAddress: bond.teller,
            auctioneerAddress: bond.auctioneer,

            start: Number(bond.start),
            end: Number(bond.conclusion),

            marketScale: String(bond.scale),
            discount,

            price: marketPrice ? String(marketPrice) : null,
            minPrice: bond.minPrice ? String(bond.minPrice) : null,

            capacity:
              Number(bond.capacity) / 10 ** Number(bond.payoutToken.decimals),
            capacityInQuote: bond.capacityInQuote,

            vesting: Number(bond.vesting),
            vestingType: bond.vestingType,

            issuerId: bond.owner,

            quoteToken: {
              ...bond.quoteToken,
              id: getIdFromChainIdAddress(chainId, bond.quoteToken.address),
              decimals: Number(bond.quoteToken.decimals),
              chainId,
              priceUSD: quoteTokenPriceUSD,
            },

            payoutToken: {
              ...bond.payoutToken,
              id: getIdFromChainIdAddress(chainId, bond.payoutToken.address),
              decimals: Number(bond.payoutToken.decimals),
              chainId,
              priceUSD: payoutTokenPriceUSD,
              discountedPriceUSD: discountedPrice,
            },

            quoteTokensPerPayoutToken,

            totalBondedAmount: bond.totalBondedAmount,
            totalPayoutAmount: bond.totalPayoutAmount,
          }
        })
        .filter((bond) => {
          if (typeof args.onlyDiscounted !== 'undefined') {
            return args.onlyDiscounted ? bond.discount > 0 : true
          }

          return true
        })
    }),
  )

  return bonds.filter(isPromiseFulfilled).flatMap((bond) => bond.value)
}
