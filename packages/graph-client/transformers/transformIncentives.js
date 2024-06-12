export function transformIncentives(incentives) {
    return incentives
        ? incentives.map((incentive) => ({
            apr: String(incentive.apr),
            rewardPerDay: String(incentive.rewardPerDay),
            rewardToken: {
                address: incentive.rewardToken.address,
                symbol: incentive.rewardToken.symbol,
                decimals: Number(incentive.rewardToken.decimals),
            },
            rewarderAddress: incentive.rewarderAddress,
            rewarderType: incentive.rewarderType,
            type: incentive.type,
        }))
        : null;
}
//# sourceMappingURL=transformIncentives.js.map