import { GatewayTransactionDetails, SendTransactionsParams, Communicator, SendTransactionsResponse, EIP712TypedData } from '../types';
declare class TXs {
    private readonly communicator;
    constructor(communicator: Communicator);
    getBySafeTxHash(safeTxHash: string): Promise<GatewayTransactionDetails>;
    signMessage(message: string): Promise<SendTransactionsResponse>;
    signTypedMessage(typedData: EIP712TypedData): Promise<SendTransactionsResponse>;
    send({ txs, params }: SendTransactionsParams): Promise<SendTransactionsResponse>;
}
export { TXs };
