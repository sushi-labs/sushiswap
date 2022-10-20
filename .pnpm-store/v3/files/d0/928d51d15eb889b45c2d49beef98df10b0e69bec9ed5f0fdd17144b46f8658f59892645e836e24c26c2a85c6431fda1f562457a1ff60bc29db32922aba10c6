import { Contract } from 'ethers/lib/ethers';
import { GetContractArgs } from './getContract';
declare type Config = {
    /** Chain id to use for provider */
    chainId?: number;
    /** Receive only a single event */
    once?: boolean;
};
export declare function watchContractEvent<TContract extends Contract = Contract>(
/** Contract configuration */
contractArgs: GetContractArgs, 
/** Event name to listen to */
eventName: Parameters<TContract['on']>[0], callback: Parameters<TContract['on']>[1], { chainId, once }?: Config): () => void;
export {};
