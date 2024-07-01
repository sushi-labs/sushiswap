import { type BondChainId, isBondChainId } from '@sushiswap/bonds-sdk'
import {
  type GetBondUserPositions,
  getBondUserPositions,
} from '@sushiswap/graph-client/bonds'
import { getChainIdAddressFromId, isPromiseFulfilled } from 'sushi'
import { getAddress } from 'viem'
import { type BondsPositionsApiSchema } from '../../../pure/bonds/positions/schema'
import { getTokenPricesChainV2 } from '../price'
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

  const where: GetBondUserPositions['where'] = {
    owner_contains_nocase: args.userAddress,
  }

  if (args.onlyUnclaimedBonds) {
    where.balance_gt = '0'
  }

  if (payoutTokenAddress) {
    where.bondToken_ = {
      underlying_contains_nocase: payoutTokenAddress,
    }
  }

  Object.entries(where!).map(([key, value]) => {
    if (value === null) delete where[key as keyof typeof where]
  })

  const positions = await Promise.allSettled(
    chainIds.map(async (chainId) => {
      const positions = await getBondUserPositions({
        chainId,
        where,
      })
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
