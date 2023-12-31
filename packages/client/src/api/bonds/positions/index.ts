import {
  BONDS_SUBGRAPH_URL,
  type BondChainId,
  isBondChainId,
} from '@sushiswap/bonds-sdk'
import {
  type BondPositionsQueryVariables,
  getBuiltGraphSDK,
} from '@sushiswap/graph-client'
import { getChainIdAddressFromId, isPromiseFulfilled } from 'sushi'
import { getAddress } from 'viem'
import { type BondsPositionsApiSchema } from '../../../pure/bonds/positions/schema'
import { getTokenPricesChainV2 } from '../../../pure/token-price/v2/chainId/tokenPricesChain'
import { BondPositionSchema } from '../schema'

export async function getBondPositionsFromSubgraph(
  args: typeof BondsPositionsApiSchema._output,
) {
  let chainIds = args.chainIds

  let payoutTokenAddress = null
  if (args.payoutTokenId) {
    const { chainId, address } = getChainIdAddressFromId(args.payoutTokenId)
    if (!isBondChainId(chainId)) throw new Error('Invalid payout token chain')
    chainIds = [chainId]
    payoutTokenAddress = address
  }

  const query = {
    where: {
      balance_gt: args.onlyUnredeemed ? 0 : null,
      bondToken_: payoutTokenAddress
        ? {
            underlying_contains_nocase: payoutTokenAddress,
          }
        : null,
      owner_contains_nocase: args.userAddress,
    },
  } satisfies BondPositionsQueryVariables

  Object.entries(query.where).map(([key, value]) => {
    if (value === null) delete query.where[key as keyof typeof query.where]
  })

  const positions = await Promise.allSettled(
    chainIds.map(async (chainId) => {
      const sdk = getBuiltGraphSDK({ url: BONDS_SUBGRAPH_URL[chainId] })

      const { positions } = await sdk.BondPositions(query)
      const prices = await getTokenPricesChainV2({ chainId })

      const positionsParsed = positions
        .map((position) => BondPositionSchema.safeParse(position))
        .flatMap((position) => {
          if (!position.success) {
            console.log(position.error)
            return []
          }

          return position.data
        })

      return positionsParsed.map((position) => {
        const payoutTokenPriceUSD =
          prices[getAddress(position.bondToken.underlying.address)] || 0
        const payoutToken = {
          id: `${chainId}:${position.bondToken.underlying.address}`,
          chainId,
          ...position.bondToken.underlying,
          decimals: Number(position.bondToken.underlying.decimals),
          priceUSD: payoutTokenPriceUSD,
        }

        return {
          owner: position.owner,
          chainId: position.chainId as BondChainId,

          balance: String(position.balance),
          balanceUSD:
            (Number(position.balance) / 10 ** payoutToken.decimals) *
            payoutTokenPriceUSD,

          maturity: Number(position.bondToken.expiry),
          tellerAddress: position.bondToken.teller,

          bondTokenId: position.bondToken.id,

          payoutToken,
        }
      })
    }),
  )

  return positions.filter(isPromiseFulfilled).flatMap((p) => p.value)
}
