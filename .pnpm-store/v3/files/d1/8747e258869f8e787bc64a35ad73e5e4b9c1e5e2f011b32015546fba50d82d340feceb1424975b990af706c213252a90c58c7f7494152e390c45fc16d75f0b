import * as t from "io-ts";
import { BN } from "ethereumjs-util";
export declare const rpcNewBlockTagObjectWithNumber: t.TypeC<{
    blockNumber: t.Type<BN, BN, unknown>;
}>;
export declare const rpcNewBlockTagObjectWithHash: t.TypeC<{
    blockHash: t.Type<Buffer, Buffer, unknown>;
    requireCanonical: t.Type<boolean | undefined, boolean | undefined, unknown>;
}>;
export declare const rpcBlockTagName: t.KeyofC<{
    earliest: null;
    latest: null;
    pending: null;
}>;
export declare const rpcNewBlockTag: t.UnionC<[t.Type<BN, BN, unknown>, t.TypeC<{
    blockNumber: t.Type<BN, BN, unknown>;
}>, t.TypeC<{
    blockHash: t.Type<Buffer, Buffer, unknown>;
    requireCanonical: t.Type<boolean | undefined, boolean | undefined, unknown>;
}>, t.KeyofC<{
    earliest: null;
    latest: null;
    pending: null;
}>]>;
export declare type RpcNewBlockTag = t.TypeOf<typeof rpcNewBlockTag>;
export declare const optionalRpcNewBlockTag: t.Type<BN | "pending" | "earliest" | "latest" | {
    blockNumber: BN;
} | {
    blockHash: Buffer;
    requireCanonical: boolean | undefined;
} | undefined, BN | "pending" | "earliest" | "latest" | {
    blockNumber: BN;
} | {
    blockHash: Buffer;
    requireCanonical: boolean | undefined;
} | undefined, unknown>;
export declare type OptionalRpcNewBlockTag = t.TypeOf<typeof optionalRpcNewBlockTag>;
export declare const rpcOldBlockTag: t.UnionC<[t.Type<BN, BN, unknown>, t.KeyofC<{
    earliest: null;
    latest: null;
    pending: null;
}>]>;
export declare type RpcOldBlockTag = t.TypeOf<typeof rpcOldBlockTag>;
export declare const optionalRpcOldBlockTag: t.Type<BN | "pending" | "earliest" | "latest" | undefined, BN | "pending" | "earliest" | "latest" | undefined, unknown>;
export declare type OptionalRpcOldBlockTag = t.TypeOf<typeof optionalRpcOldBlockTag>;
//# sourceMappingURL=blockTag.d.ts.map