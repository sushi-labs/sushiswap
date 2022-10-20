import { providers } from 'ethers';
import { Hash } from '../../types';
export declare type FetchTransactionArgs = {
    /** Chain ID used to validate if the signer is connected to the target chain */
    chainId?: number;
    /** Transaction hash */
    hash: Hash;
};
export declare type FetchTransactionResult = providers.TransactionResponse;
/**
 * @description Fetches transaction for hash
 *
 * @example
 * import { fetchTransaction } from '@wagmi/core'
 *
 * const transaction = await fetchTransaction({
 *  chainId: 1,
 *  hash: '0x...',
 * })
 */
export declare function fetchTransaction({ chainId, hash, }: FetchTransactionArgs): Promise<FetchTransactionResult>;
