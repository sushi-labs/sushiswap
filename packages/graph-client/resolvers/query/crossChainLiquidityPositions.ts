import { chainName, chainShortName } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { LiquidityPosition, QueryResolvers } from '../../.graphclient'

export const crossChainLiquidityPositions: QueryResolvers['crossChainLiquidityPositions'] = async (
  root,
  args,
  context,
  info
) => {
  const farms = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

  const transformer = (liquidityPosition, chainId) => {
    const farm = farms?.[chainId]?.farms?.[liquidityPosition.pair.id]
    const feeApr =
      Number(liquidityPosition.pair?.liquidityUSD) > 5000
        ? chainId === 1
          ? liquidityPosition.pair?.apr / 100_000
          : liquidityPosition.pair?.apr / 100
        : 0

    const incentiveApr =
      farm?.incentives?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.apr), 0) ?? 0
    const apr = Number(feeApr) + Number(incentiveApr)

    return {
      ...liquidityPosition,
      id: `${chainShortName[chainId]}:${liquidityPosition.pair.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName: chainShortName[chainId],
      balance: Math.floor(Number(liquidityPosition.balance / 2)),
      pair: {
        ...liquidityPosition.pair,
        id: `${chainShortName[chainId]}:${liquidityPosition.pair.id}`,
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
  }

  return Promise.allSettled([
    ...args.chainIds
      .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.SushiSwap.Query.liquidityPositions({
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
        }).then((positions) => positions.map((position) => transformer(position, chainId)))
      ),
    ...args.chainIds
      .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.Trident.Query.liquidityPositions({
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
        }).then((positions) => positions.map((position) => transformer(position, chainId)))
      ),
  ]).then((positions) => {
    return positions.flat().reduce<LiquidityPosition[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled') {
        previousValue.push(...currentValue.value)
      }
      return previousValue
    }, [])
  })
}
