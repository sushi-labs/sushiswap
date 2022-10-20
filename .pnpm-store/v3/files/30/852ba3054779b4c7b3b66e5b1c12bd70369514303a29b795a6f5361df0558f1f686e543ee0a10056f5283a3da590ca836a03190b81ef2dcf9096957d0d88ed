import { Methods } from './methods';
import { Communicator, SuccessResponse } from '../types';
declare class PostMessageCommunicator implements Communicator {
    private readonly allowedOrigins;
    private callbacks;
    private debugMode;
    private isServer;
    constructor(allowedOrigins?: RegExp[] | null, debugMode?: boolean);
    private isValidMessage;
    private logIncomingMessage;
    private onParentMessage;
    private handleIncomingMessage;
    send: <M extends Methods, P, R>(method: M, params: P) => Promise<SuccessResponse<R>>;
}
export default PostMessageCommunicator;
export * from './methods';
