/// <reference types="node" />
import BN from "bn.js";
import { AddressString, IntNumber } from "../types";
export interface EthereumTransactionParams {
    fromAddress: AddressString;
    toAddress: AddressString | null;
    weiValue: BN;
    data: Buffer;
    nonce: IntNumber | null;
    gasPriceInWei: BN | null;
    maxFeePerGas: BN | null;
    maxPriorityFeePerGas: BN | null;
    gasLimit: BN | null;
    chainId: IntNumber;
}
