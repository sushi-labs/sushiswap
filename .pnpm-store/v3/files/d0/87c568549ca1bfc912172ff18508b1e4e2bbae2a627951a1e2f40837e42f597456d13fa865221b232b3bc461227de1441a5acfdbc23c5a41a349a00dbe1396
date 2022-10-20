import { BigNumber } from 'ethers/lib/ethers';
import { Unit } from '../../types';
export declare type FetchTokenArgs = {
    /** Address of ERC-20 token */
    address: string;
    /** Chain id to use for provider */
    chainId?: number;
    /** Units for formatting output */
    formatUnits?: Unit | number;
};
export declare type FetchTokenResult = {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    totalSupply: {
        formatted: string;
        value: BigNumber;
    };
};
export declare function fetchToken({ address, chainId, formatUnits: units, }: FetchTokenArgs): Promise<FetchTokenResult>;
