import { RelayMessage, RelayMessageType } from "./RelayMessage";
import { Web3Response } from "./Web3Response";
export interface Web3ResponseMessage extends RelayMessage<RelayMessageType.WEB3_RESPONSE> {
    type: RelayMessageType.WEB3_RESPONSE;
    id: string;
    response: Web3Response;
}
export declare function Web3ResponseMessage(params: Omit<Web3ResponseMessage, "type">): Web3ResponseMessage;
export declare function isWeb3ResponseMessage(msg: any): msg is Web3ResponseMessage;
