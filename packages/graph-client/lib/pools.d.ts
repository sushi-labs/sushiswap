declare enum PoolType {
    CONSTANT_PRODUCT_POOL = "CONSTANT_PRODUCT_POOL",
    STABLE_POOL = "STABLE_POOL",
    CONCENTRATED_LIQUIDITY_POOL = "CONCENTRATED_LIQUIDITY_POOL"
}
declare enum PoolVersion {
    LEGACY = "LEGACY",
    TRIDENT = "TRIDENT"
}
declare enum RewarderType {
    Primary = "Primary",
    Secondary = "Secondary"
}
type PartialWithUndefined<T extends object> = Partial<{
    [K in keyof T]: T[K] | undefined;
}>;
export type GetPoolsArgs = PartialWithUndefined<{
    take: number;
    ids: string[];
    chainIds: number[];
    poolTypes: PoolType[];
    isIncentivized: boolean;
    isWhitelisted: boolean;
    cursor: string;
    orderBy: string;
    orderDir: 'asc' | 'desc';
    count: boolean;
}>;
interface Token {
    address: string;
    decimals: number;
    id: string;
    name: string;
    symbol: string;
}
export interface Pool {
    address: string;
    feeApr: number;
    incentiveApr: number;
    chainId: number;
    fees1d: string;
    fees1w: string;
    id: string;
    incentives: {
        apr: number;
        chainId: number;
        id: string;
        pid: number;
        rewarderAddress: string;
        rewarderType: RewarderType;
        rewardPerDay: number;
        rewardToken: Token;
        chefType: string;
    }[];
    isBlacklisted: boolean;
    isIncentivized: boolean;
    liquidityUSD: string;
    totalSupply: string;
    name: string;
    swapFee: number;
    token0: Token;
    token1: Token;
    totalApr: number;
    twapEnabled: boolean;
    type: PoolType;
    version: PoolVersion;
    volume1d: string;
    volume1w: string;
    volumeUSD: string;
}
export declare const EVM_APP_BASE_URL: string;
export declare function parseArgs<T>(args?: Partial<T>): string;
export declare const getPool: (poolId: string) => Promise<Pool>;
export declare const getPools: (args?: GetPoolsArgs) => Promise<Pool[]>;
export declare const getPoolCount: (args?: GetPoolsArgs) => Promise<number>;
export {};
//# sourceMappingURL=pools.d.ts.map