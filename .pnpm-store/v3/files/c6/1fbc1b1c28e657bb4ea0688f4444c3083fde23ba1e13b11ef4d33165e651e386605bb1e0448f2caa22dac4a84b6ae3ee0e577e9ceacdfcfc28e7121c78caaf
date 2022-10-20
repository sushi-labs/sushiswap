import { BigNumber } from 'ethers/lib/ethers';
import { Unit } from '../../types';
export declare type FetchBalanceArgs = {
    /** Address or ENS name */
    addressOrName: string;
    /** Chain id to use for provider */
    chainId?: number;
    /** Units for formatting output */
    formatUnits?: Unit | number;
    /** ERC-20 address */
    token?: string;
};
export declare type FetchBalanceResult = {
    decimals: number;
    formatted: string;
    symbol: string;
    value: BigNumber;
};
export declare function fetchBalance({ addressOrName, chainId, formatUnits: unit, token, }: FetchBalanceArgs): Promise<FetchBalanceResult>;
