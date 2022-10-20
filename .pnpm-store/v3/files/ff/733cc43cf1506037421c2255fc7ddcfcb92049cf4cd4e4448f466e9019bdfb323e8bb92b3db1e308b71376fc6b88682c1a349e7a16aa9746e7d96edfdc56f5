import { providers } from 'ethers';
import { Address } from '../../types';
export declare type SendTransactionPreparedRequest = {
    /**
     * `recklesslyUnprepared`: Allow to pass through an unprepared `request`. Note: This has
     * [UX pitfalls](/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks), it is highly recommended
     * to not use this and instead prepare the request upfront using the `prepareSendTransaction` function.
     *
     * `prepared`: The request has been prepared with parameters required for sending a transaction
     * via the `prepareSendTransaction` function
     * */
    mode: 'prepared';
    /** The prepared request for sending a transaction. */
    request: providers.TransactionRequest & {
        to: Address;
        gasLimit: NonNullable<providers.TransactionRequest['gasLimit']>;
    };
};
export declare type SendTransactionUnpreparedRequest = {
    mode: 'recklesslyUnprepared';
    /** The unprepared request for sending a transaction. */
    request: providers.TransactionRequest;
};
export declare type SendTransactionArgs = {
    /** Chain ID used to validate if the signer is connected to the target chain */
    chainId?: number;
} & (SendTransactionPreparedRequest | SendTransactionUnpreparedRequest);
export declare type SendTransactionResult = {
    hash: providers.TransactionResponse['hash'];
    wait: providers.TransactionResponse['wait'];
};
/**
 * @description Function to send a transaction.
 *
 * It is recommended to pair this with the `prepareSendTransaction` function to avoid
 * [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { prepareSendTransaction, sendTransaction } from '@wagmi/core'
 *
 * const config = await prepareSendTransaction({
 *  to: 'moxey.eth',
 *  value: parseEther('1'),
 * })
 * const result = await sendTransaction(config)
 */
export declare function sendTransaction({ chainId, mode, request, }: SendTransactionArgs): Promise<SendTransactionResult>;
