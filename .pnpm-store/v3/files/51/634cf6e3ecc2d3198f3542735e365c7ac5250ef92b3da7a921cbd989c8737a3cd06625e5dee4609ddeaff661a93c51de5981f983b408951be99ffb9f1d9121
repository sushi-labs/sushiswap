import * as t from "io-ts";
import { BN } from "ethereumjs-util";
export declare const rpcTransactionRequest: t.TypeC<{
    from: t.Type<Buffer, Buffer, unknown>;
    to: t.Type<Buffer | undefined, Buffer | undefined, unknown>;
    gas: t.Type<BN | undefined, BN | undefined, unknown>;
    gasPrice: t.Type<BN | undefined, BN | undefined, unknown>;
    value: t.Type<BN | undefined, BN | undefined, unknown>;
    nonce: t.Type<BN | undefined, BN | undefined, unknown>;
    data: t.Type<Buffer | undefined, Buffer | undefined, unknown>;
    accessList: t.Type<{
        address: Buffer;
        storageKeys: Buffer[] | null;
    }[] | undefined, {
        address: Buffer;
        storageKeys: Buffer[] | null;
    }[] | undefined, unknown>;
    chainId: t.Type<BN | undefined, BN | undefined, unknown>;
    maxFeePerGas: t.Type<BN | undefined, BN | undefined, unknown>;
    maxPriorityFeePerGas: t.Type<BN | undefined, BN | undefined, unknown>;
}>;
export interface RpcTransactionRequestInput {
    from: string;
    to?: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
    nonce?: string;
    data?: string;
    accessList?: Array<{
        address: string;
        storageKeys: string[];
    }>;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
}
export declare type RpcTransactionRequest = t.TypeOf<typeof rpcTransactionRequest>;
//# sourceMappingURL=transactionRequest.d.ts.map