import type { Incentive } from '../lib/incentives.js';
export declare function transformIncentives(incentives: Incentive[]): {
    apr: string;
    rewardPerDay: string;
    rewardToken: {
        address: string;
        symbol: string;
        decimals: number;
    };
    rewarderAddress: string;
    rewarderType: "Primary" | "Secondary";
    type: "MasterChefV1" | "MasterChefV2" | "MiniChef";
}[];
//# sourceMappingURL=transformIncentives.d.ts.map