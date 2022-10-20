import { providers } from 'ethers';
import { Unit } from '../../types';
export declare type FetchFeeDataArgs = {
    /** Units for formatting output */
    formatUnits?: Unit | number;
    /** Chain id to use for provider */
    chainId?: number;
};
export declare type FetchFeeDataResult = providers.FeeData & {
    formatted: {
        gasPrice: string | null;
        maxFeePerGas: string | null;
        maxPriorityFeePerGas: string | null;
    };
};
export declare function fetchFeeData({ chainId, formatUnits: units, }?: FetchFeeDataArgs): Promise<FetchFeeDataResult>;
