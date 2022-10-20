import * as t from "io-ts";
import { BN } from "ethereumjs-util";
export declare const rpcFilterRequest: t.TypeC<{
    fromBlock: t.Type<BN | "pending" | "earliest" | "latest" | undefined, BN | "pending" | "earliest" | "latest" | undefined, unknown>;
    toBlock: t.Type<BN | "pending" | "earliest" | "latest" | undefined, BN | "pending" | "earliest" | "latest" | undefined, unknown>;
    address: t.Type<Buffer | Buffer[] | undefined, Buffer | Buffer[] | undefined, unknown>;
    topics: t.Type<(Buffer | (Buffer | null)[] | null)[] | undefined, (Buffer | (Buffer | null)[] | null)[] | undefined, unknown>;
    blockHash: t.Type<Buffer | undefined, Buffer | undefined, unknown>;
}>;
export declare type RpcFilterRequest = t.TypeOf<typeof rpcFilterRequest>;
export declare const optionalRpcFilterRequest: t.Type<{
    fromBlock: BN | "pending" | "earliest" | "latest" | undefined;
    toBlock: BN | "pending" | "earliest" | "latest" | undefined;
    address: Buffer | Buffer[] | undefined;
    topics: (Buffer | (Buffer | null)[] | null)[] | undefined;
    blockHash: Buffer | undefined;
} | undefined, {
    fromBlock: BN | "pending" | "earliest" | "latest" | undefined;
    toBlock: BN | "pending" | "earliest" | "latest" | undefined;
    address: Buffer | Buffer[] | undefined;
    topics: (Buffer | (Buffer | null)[] | null)[] | undefined;
    blockHash: Buffer | undefined;
} | undefined, unknown>;
export declare type OptionalRpcFilterRequest = t.TypeOf<typeof optionalRpcFilterRequest>;
//# sourceMappingURL=filterRequest.d.ts.map