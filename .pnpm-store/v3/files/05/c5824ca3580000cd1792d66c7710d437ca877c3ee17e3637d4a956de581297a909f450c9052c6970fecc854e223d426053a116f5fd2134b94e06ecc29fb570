import { providers } from 'ethers';
import { Address } from '../../types';
export declare type PrepareSendTransactionArgs = {
    /** Chain ID used to validate if the signer is connected to the target chain */
    chainId?: number;
    /** Request data to prepare the transaction */
    request: providers.TransactionRequest & {
        to: NonNullable<providers.TransactionRequest['to']>;
    };
    signerOrProvider?: providers.JsonRpcSigner | providers.Provider;
};
export declare type PrepareSendTransactionResult = {
    chainId?: number;
    request: providers.TransactionRequest & {
        to: Address;
        gasLimit: NonNullable<providers.TransactionRequest['gasLimit']>;
    };
    mode: 'prepared';
};
/**
 * @description Prepares the parameters required for sending a transaction.
 *
 * Returns config to be passed through to `sendTransaction`.
 *
 * @example
 * import { prepareSendTransaction, sendTransaction } from '@wagmi/core'
 *
 * const config = await prepareSendTransaction({
 *  request: {
 *    to: 'moxey.eth',
 *    value: parseEther('1'),
 *  }
 * })
 * const result = await sendTransaction(config)
 */
export declare function prepareSendTransaction({ chainId, request, signerOrProvider, }: PrepareSendTransactionArgs): Promise<PrepareSendTransactionResult>;
