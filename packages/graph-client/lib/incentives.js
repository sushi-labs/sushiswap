export const getIncentives = async () => fetch('https://incentives.sushi.com/v0').then((data) => data.json());
export const getIncentivesByPoolIds = async (poolIds) => fetch(`https://incentives.sushi.com/v0?poolIds=${poolIds.join(',')}`).then((data) => data.json());
export const getIncentivesByPoolId = async (chainId, address) => fetch(`https://incentives.sushi.com/v0/${chainId}/${address}`).then((data) => data.json());
//# sourceMappingURL=incentives.js.map