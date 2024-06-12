import { ChainId } from 'sushi/chain';
export interface Incentive {
    poolId: string;
    type: 'MasterChefV1' | 'MasterChefV2' | 'MiniChef';
    pid: number;
    chainId: ChainId;
    apr: string;
    rewardPerDay: string;
    rewardToken: {
        address: string;
        decimals: number;
        symbol: string;
    };
    rewarderAddress: string;
    rewarderType: 'Primary' | 'Secondary';
}
export declare const getIncentives: () => Promise<Incentive[]>;
export declare const getIncentivesByPoolIds: (poolIds: string[]) => Promise<Incentive[]>;
export declare const getIncentivesByPoolId: (chainId: ChainId, address: string) => Promise<Incentive[]>;
//# sourceMappingURL=incentives.d.ts.map