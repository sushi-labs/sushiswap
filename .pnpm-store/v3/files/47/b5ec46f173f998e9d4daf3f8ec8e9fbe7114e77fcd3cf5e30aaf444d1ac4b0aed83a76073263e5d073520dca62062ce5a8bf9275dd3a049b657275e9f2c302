import * as t from "io-ts";
import { BN } from "ethereumjs-util";
export declare type RpcTransaction = t.TypeOf<typeof rpcTransaction>;
export declare const rpcTransaction: t.TypeC<{
    blockHash: t.Type<Buffer | null, Buffer | null, unknown>;
    blockNumber: t.Type<BN | null, BN | null, unknown>;
    from: t.Type<Buffer, Buffer, unknown>;
    gas: t.Type<BN, BN, unknown>;
    gasPrice: t.Type<BN, BN, unknown>;
    hash: t.Type<Buffer, Buffer, unknown>;
    input: t.Type<Buffer, Buffer, unknown>;
    nonce: t.Type<BN, BN, unknown>;
    to: t.Type<Buffer | null | undefined, Buffer | null | undefined, unknown>;
    transactionIndex: t.Type<BN | null, BN | null, unknown>;
    value: t.Type<BN, BN, unknown>;
    v: t.Type<BN, BN, unknown>;
    r: t.Type<BN, BN, unknown>;
    s: t.Type<BN, BN, unknown>;
    type: t.Type<BN | undefined, BN | undefined, unknown>;
    chainId: t.Type<BN | null | undefined, BN | null | undefined, unknown>;
    accessList: t.Type<{
        address: Buffer;
        storageKeys: Buffer[] | null;
    }[] | undefined, {
        address: Buffer;
        storageKeys: Buffer[] | null;
    }[] | undefined, unknown>;
    maxFeePerGas: t.Type<BN | undefined, BN | undefined, unknown>;
    maxPriorityFeePerGas: t.Type<BN | undefined, BN | undefined, unknown>;
}>;
//# sourceMappingURL=transaction.d.ts.map