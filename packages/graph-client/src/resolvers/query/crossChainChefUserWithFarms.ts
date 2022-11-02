import { ChainId } from '@sushiswap/chain'

import { getBuiltGraphSDK, QueryResolvers, UserWithFarm } from '../../../.graphclient'
import { getTokenBalances } from '../../fetchers'

export const crossChainUserWithFarms: QueryResolvers['crossChainUserWithFarms'] = async (root, args) => {
  const sdk = getBuiltGraphSDK()

  // ugly but good for performance because of the pair fetch
  const [unstakedPools, stakedPools] = await Promise.all([
    sdk
      .CrossChainLiquidityPositions({
        where: { balance_gt: 0, user: args.id.toLowerCase() },
        chainIds: args.chainIds,
      })
      .then(async ({ crossChainLiquidityPositions }) => {
        const balances = await getTokenBalances(
          crossChainLiquidityPositions.map((lp) => ({
            token: lp.pair.id.split(':')[1],
            user: args.id,
            chainId: lp.chainId,
          }))
        )

        return crossChainLiquidityPositions
          .map((lp) => ({
            ...lp,
            unstakedBalance: balances.find((el) => el.token === lp.pair.id.split(':')[1])?.balance ?? '0',
            stakedBalance: '0',
          }))
          .filter((entry) => entry.unstakedBalance !== '0')
      }),

    sdk
      .CrossChainChefUser({ where: { address: args.id, amount_gt: 0 }, chainIds: args.chainIds })
      .then(async ({ crossChainChefUser }) => {
        // TODO?: move pair fetch to crossChainChefUser resolver
        const stakedPairs = (
          await Promise.all(
            // @ts-ignore
            crossChainChefUser.map(({ chainId, pool }) =>
              sdk
                .CrossChainPair({ id: (pool as { pair: string }).pair, chainId, now: 0 })
                .then(({ crossChainPair: pair }) => pair)
            )
          )
        ).filter((pair) => !(pair && pair.chainId === ChainId.POLYGON && pair.source === 'LEGACY'))
        // TODO: remove when polygon subgraph is synced

        // @ts-ignore
        return crossChainChefUser
          .map((user) => {
            // @ts-ignore
            const pair = stakedPairs.find((stakedPair) => stakedPair?.id?.split(':')[1] === user.pool?.pair)

            if (!pair) return

            return {
              id: pair.id,
              unstakedBalance: '0',
              // @ts-ignore
              stakedBalance: String(user.amount),
              pair: pair,
              // @ts-ignore
              chainId: user.chainId,
              // @ts-ignore
              chainName: user.chainName,
            }
          })
          .filter((user): user is NonNullable<typeof user> => !!user && !!user.pair.id)
      }),
  ])

  const allPairIds = Array.from(new Set([...unstakedPools, ...stakedPools].map((el) => el.id)))

  return allPairIds.reduce((acc, cur) => {
    const unstaked = unstakedPools.find((el) => el.id === cur)
    const staked = stakedPools.find((el) => el.id === cur)
    const combined = (staked
      ? unstaked
        ? { ...unstaked, stakedBalance: staked.stakedBalance }
        : staked
      : (unstaked as NonNullable<typeof unstaked>)) as unknown as UserWithFarm // pair type doesn't match, problem for a future somebody

    const pair = unstaked?.pair ?? staked?.pair

    const totalBalance = Number(unstaked?.unstakedBalance ?? 0) + Number(staked?.stakedBalance ?? 0)
    // @ts-ignore
    const valueUSD = (totalBalance / pair.liquidity) * pair.liquidityUSD

    acc.push({ ...combined, valueUSD })
    return acc
  }, [] as UserWithFarm[])
}
