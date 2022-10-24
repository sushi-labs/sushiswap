import { chainName, chainShortName } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { QueryResolvers } from '../../.graphclient'

export const crossChainUsers: QueryResolvers['crossChainUsers'] = async (root, args, context, info) => {
  const farms = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

  const transformer = (user, chainId) => {
    return {
      ...user,
      id: args.id,
      chainId,
      chainName: chainName[chainId],
      liquidityPositions:
        user?.liquidityPositions?.length > 0
          ? user.liquidityPositions.map((el) => {
              const volume1w = el.pair.daySnapshots
                ?.slice(0, 6)
                ?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.volumeUSD), 0)
              const farm = farms?.[chainId]?.farms?.[el.pair.id]
              const feeApr =
                Number(el.pair?.liquidityUSD) > 5000 ? (chainId === 1 ? el.pair?.apr / 100_000 : el.pair?.apr / 100) : 0

              const incentiveApr =
                farm?.incentives?.reduce(
                  (previousValue, currentValue) => previousValue + Number(currentValue.apr),
                  0
                ) ?? 0
              const apr = Number(feeApr) + Number(incentiveApr)
              return {
                ...el,
                balance: Math.floor(Number(el.balance / 2)),
                pair: {
                  ...el.pair,
                  volume1w,
                  id: `${chainShortName[chainId]}:${el.pair.id}`,
                  chainId,
                  chainName: chainName[chainId],
                  chainShortName: chainShortName[chainId],
                  apr: String(apr),
                  feeApr: String(feeApr),
                  incentiveApr: String(incentiveApr),
                  farm: farm
                    ? {
                        id: farm.id,
                        incentives: farm.incentives.map((incentive) => ({
                          apr: String(incentive.apr),
                          rewardPerDay: String(incentive.rewardPerDay),
                          rewardToken: {
                            address: incentive.rewardToken.address,
                            symbol: incentive.rewardToken.symbol,
                            decimals: Number(incentive.rewardToken.decimals),
                          },
                          rewarderAddress: incentive.rewarder.address,
                          rewarderType: incentive.rewarder.type,
                        })),
                        chefType: String(farm.chefType),
                        poolType: String(farm.poolType),
                      }
                    : null,
                },
              }
            })
          : [],
    }
  }

  return Promise.allSettled([
    ...args.chainIds
      .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.SushiSwap.Query.user({
          root,
          args,
          context: {
            ...context,
            chainId,
            chainName: chainName[chainId],
            subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((user) => transformer(user, chainId))
      ),
    ...args.chainIds
      .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.Trident.Query.user({
          root,
          args,
          context: {
            ...context,
            chainId,
            chainName: chainName[chainId],
            subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((user) => transformer(user, chainId))
      ),
  ]).then((users) => {
    return users.flat().reduce((acc, cur) => {
      if (cur.status === 'fulfilled') {
        acc.push(cur.value)
      }

      return acc
    }, [])
  })
}
