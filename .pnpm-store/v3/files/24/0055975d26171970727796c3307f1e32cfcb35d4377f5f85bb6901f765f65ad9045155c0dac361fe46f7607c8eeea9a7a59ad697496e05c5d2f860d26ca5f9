import { BytesLike } from 'ethers';
export declare type SignTypedDataArgs = {
    /** Domain or domain signature for origin or contract */
    domain: {
        name?: string;
        version?: string;
        /**
         * Chain permitted for signing
         * If signer is not active on this chain, it will attempt to programmatically switch
         */
        chainId?: string | number | bigint;
        verifyingContract?: string;
        salt?: BytesLike;
    };
    /** Named list of all type definitions */
    types: Record<string, Array<{
        name: string;
        type: string;
    }>>;
    /** Data to sign */
    value: Record<string, any>;
};
export declare type SignTypedDataResult = string;
export declare function signTypedData({ domain, types, value, }: SignTypedDataArgs): Promise<SignTypedDataResult>;
