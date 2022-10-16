import { chainName, chainShortName } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { QueryResolvers } from '../../.graphclient'

export const crossChainToken: QueryResolvers['crossChainToken'] = async (root, args, context, info) => {
  const farms = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

  const token = SUSHISWAP_ENABLED_NETWORKS.includes(args.chainId)
    ? await context.SushiSwap.Query.token({
        root,
        args,
        context: {
          ...context,
          now: args.now,
          chainId: args.chainId,
          chainName: chainName[args.chainId],
          chainShortName: chainShortName[args.chainId],
          subgraphName: SUSHISWAP_SUBGRAPH_NAME[args.chainId],
          subgraphHost: SUBGRAPH_HOST[args.chainId],
        },
        info,
      })
    : await context.Trident.Query.token({
        root,
        args,
        context: {
          ...context,
          now: args.now,
          chainId: args.chainId,
          chainName: chainName[args.chainId],
          chainShortName: chainShortName[args.chainId],
          subgraphName: TRIDENT_SUBGRAPH_NAME[args.chainId],
          subgraphHost: SUBGRAPH_HOST[args.chainId],
        },
        info,
      })

  return {
    ...token,
    id: `${chainShortName[args.chainId]}:${token.id}`,
    chainId: args.chainId,
    chainName: chainName[args.chainId],
    chainShortName: chainShortName[args.chainId],
    source: SUSHISWAP_ENABLED_NETWORKS.includes(args.chainId) ? 'LEGACY' : 'TRIDENT',
    pairs: token.pairs
      ? token.pairs.map(({ pair }) => {
          const volume1w = pair.daySnapshots
            ?.slice(0, 6)
            ?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.volumeUSD), 0)
          const farm = farms?.[args.chainId]?.farms?.[pair.id]
          const feeApr = pair?.apr
          const incentiveApr =
            farm?.incentives?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.apr), 0) ?? 0
          const apr = Number(feeApr) + Number(incentiveApr)

          return {
            pair: {
              ...pair,
              volume1w,
              id: `${chainShortName[args.chainId]}:${pair.id}`,
              chainId: args.chainId,
              chainName: chainName[args.chainId],
              chainShortName: chainShortName[args.chainId],
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
