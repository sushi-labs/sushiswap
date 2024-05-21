import {
  Query,
  QueryResolvers,
  UserPosition,
  getBuiltGraphSDK,
} from '../../.graphclient/index.js'
import { fetchBalances } from '../../lib/wagmi.js'

export const crossChainUserPositions: QueryResolvers['crossChainUserPositions'] =
  async (
    root,
    args,
    context,
    info,
  ): Promise<Query['crossChainUserPositions']> => {
    const sdk = getBuiltGraphSDK()

    const [{ liquidityPositions }, { crossChainChefUser: chefUser }] =
      await Promise.all([
        sdk.LiquidityPositions({
          chainIds: args.chainIds,
          where: {
            user: args.id.toLowerCase(),
            liquidityTokenBalance_gt: 0,
          },
        }),
        sdk.CrossChainChefUser({
          chainIds: args.chainIds,
          where: {
            address: args.id.toLowerCase(),
            amount_gt: 0,
          },
        }),
      ])

    const stakedBalances: Record<string, string> = Object.fromEntries(
      chefUser.map((chefUser) => [
        `${chefUser.chainId}:${chefUser?.pool?.pair}`,
        chefUser?.amount,
      ]),
    )

    // Subgraph is unreliable currently, have to fetch from the chain directly
    const unstakedBalances = await fetchBalances(
      liquidityPositions.map((lp) => ({
        token: lp.id.split('-')[0],
        chainId: lp.chainId,
        user: args.id,
      })),
    )

    const poolIds = Object.keys({ ...stakedBalances, ...unstakedBalances })

    return poolIds.map((poolId) => {
      const unstakedBalance = Number(unstakedBalances[poolId] ?? 0)
      const stakedBalance = Number(stakedBalances[poolId] ?? 0)

      const balance = unstakedBalance + stakedBalance

      return {
        id: `${args.id.toLowerCase()}:${poolId}`,
        pool: poolId,
        chainId: Number(poolId.split(':')[0]),
        balance,
        stakedBalance,
        unstakedBalance,
      } as UserPosition
    })
  }
