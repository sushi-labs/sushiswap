import { Communicator, SafeInfo, ChainInfo, SafeBalances, GetBalanceParams, EnvironmentInfo, AddressBookItem, EIP712TypedData } from '../types';
declare class Safe {
    private readonly communicator;
    constructor(communicator: Communicator);
    getChainInfo(): Promise<ChainInfo>;
    getInfo(): Promise<SafeInfo>;
    experimental_getBalances({ currency }?: GetBalanceParams): Promise<SafeBalances>;
    private check1271Signature;
    private check1271SignatureBytes;
    calculateMessageHash(message: string): string;
    calculateTypedMessageHash(typedMessage: EIP712TypedData): string;
    isMessageSigned(message: string | EIP712TypedData, signature?: string): Promise<boolean>;
    isMessageHashSigned(messageHash: string, signature?: string): Promise<boolean>;
    getEnvironmentInfo(): Promise<EnvironmentInfo>;
    requestAddressBook(): Promise<AddressBookItem[]>;
}
export { Safe };
