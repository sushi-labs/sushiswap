/// <reference types="node" />
import type { Readable } from 'stream';
export declare function isBlob(obj: any): obj is Blob;
interface GraphQLUpload {
    filename: string;
    mimetype: string;
    createReadStream: () => Readable;
}
export declare function isGraphQLUpload(upload: any): upload is GraphQLUpload;
export declare function isPromiseLike(obj: any): obj is PromiseLike<any>;
export declare enum LEGACY_WS {
    CONNECTION_INIT = "connection_init",
    CONNECTION_ACK = "connection_ack",
    CONNECTION_ERROR = "connection_error",
    CONNECTION_KEEP_ALIVE = "ka",
    START = "start",
    STOP = "stop",
    CONNECTION_TERMINATE = "connection_terminate",
    DATA = "data",
    ERROR = "error",
    COMPLETE = "complete"
}
export {};
