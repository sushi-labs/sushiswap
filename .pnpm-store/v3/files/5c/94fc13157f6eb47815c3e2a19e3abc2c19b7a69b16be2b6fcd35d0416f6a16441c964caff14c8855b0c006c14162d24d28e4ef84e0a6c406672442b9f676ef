import * as t from "io-ts";
import { BN } from "ethereumjs-util";
export declare type RpcTransactionReceipt = t.TypeOf<typeof rpcTransactionReceipt>;
export declare const rpcTransactionReceipt: t.TypeC<{
    transactionHash: t.Type<Buffer, Buffer, unknown>;
    transactionIndex: t.Type<BN, BN, unknown>;
    blockHash: t.Type<Buffer, Buffer, unknown>;
    blockNumber: t.Type<BN, BN, unknown>;
    from: t.Type<Buffer, Buffer, unknown>;
    to: t.Type<Buffer | null, Buffer | null, unknown>;
    cumulativeGasUsed: t.Type<BN, BN, unknown>;
    gasUsed: t.Type<BN, BN, unknown>;
    contractAddress: t.Type<Buffer | null, Buffer | null, unknown>;
    logs: t.ArrayC<t.TypeC<{
        logIndex: t.Type<BN | null, BN | null, unknown>;
        transactionIndex: t.Type<BN | null, BN | null, unknown>;
        transactionHash: t.Type<Buffer | null, Buffer | null, unknown>;
        blockHash: t.Type<Buffer | null, Buffer | null, unknown>;
        blockNumber: t.Type<BN | null, BN | null, unknown>;
        address: t.Type<Buffer, Buffer, unknown>;
        data: t.Type<Buffer, Buffer, unknown>;
        topics: t.ArrayC<t.Type<Buffer, Buffer, unknown>>;
    }>>;
    logsBloom: t.Type<Buffer, Buffer, unknown>;
    status: t.Type<BN | null | undefined, BN | null | undefined, unknown>;
    root: t.Type<Buffer | undefined, Buffer | undefined, unknown>;
    type: t.Type<BN | undefined, BN | undefined, unknown>;
    effectiveGasPrice: t.Type<BN | undefined, BN | undefined, unknown>;
}>;
//# sourceMappingURL=receipt.d.ts.map