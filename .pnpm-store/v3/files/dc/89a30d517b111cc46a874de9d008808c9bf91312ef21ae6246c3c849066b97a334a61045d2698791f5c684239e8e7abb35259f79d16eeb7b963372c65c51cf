import { providers } from 'ethers';
export declare type DeprecatedSendTransactionArgs = {
    /**
     * Chain id to use for write
     * If signer is not active on this chain, it will attempt to programmatically switch
     */
    chainId?: number;
    /** Object to use when creating transaction */
    request: providers.TransactionRequest;
};
export declare type DeprecatedSendTransactionResult = providers.TransactionResponse;
export declare function deprecatedSendTransaction({ chainId, request, }: DeprecatedSendTransactionArgs): Promise<DeprecatedSendTransactionResult>;
