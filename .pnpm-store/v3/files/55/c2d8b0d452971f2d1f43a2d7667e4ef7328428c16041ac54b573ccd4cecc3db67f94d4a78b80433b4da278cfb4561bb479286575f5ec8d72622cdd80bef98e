import { IJsonRpcRequest, IJsonRpcResponseSuccess, IJsonRpcResponseError, IEncryptionPayload } from "@walletconnect/types";
export declare function generateKey(length?: number): Promise<ArrayBuffer>;
export declare function verifyHmac(payload: IEncryptionPayload, key: Uint8Array): Promise<boolean>;
export declare function encrypt(data: IJsonRpcRequest | IJsonRpcResponseSuccess | IJsonRpcResponseError, key: ArrayBuffer, providedIv?: ArrayBuffer): Promise<IEncryptionPayload>;
export declare function decrypt(payload: IEncryptionPayload, key: ArrayBuffer): Promise<IJsonRpcRequest | IJsonRpcResponseSuccess | IJsonRpcResponseError | null>;
//# sourceMappingURL=index.d.ts.map