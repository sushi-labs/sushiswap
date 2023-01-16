import { Farm } from '../lib/farms'

export function transformFarm(farm?: Farm) {
  return farm
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
          rewarderAddress: String(incentive?.rewarder?.address),
          rewarderType: String(incentive?.rewarder?.type),
        })),
        chefType: String(farm.chefType),
        poolType: String(farm.poolType),
      }
    : null
}
