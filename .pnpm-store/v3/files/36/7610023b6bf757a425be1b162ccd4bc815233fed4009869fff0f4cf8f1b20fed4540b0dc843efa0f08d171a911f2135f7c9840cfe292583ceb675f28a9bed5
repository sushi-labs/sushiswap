import { providers } from 'ethers';
export declare type WaitForTransactionArgs = {
    /** Chain id to use for provider */
    chainId?: number;
    /**
     * Number of blocks to wait for after transaction is mined
     * @default 1
     */
    confirmations?: number;
    /** Transaction hash to monitor */
    hash?: string;
    timeout?: number;
    /** Function resolving to transaction receipt */
    wait?: providers.TransactionResponse['wait'];
};
export declare type WaitForTransactionResult = providers.TransactionReceipt;
export declare function waitForTransaction({ chainId, confirmations, hash, timeout, wait: wait_, }: WaitForTransactionArgs): Promise<WaitForTransactionResult>;
