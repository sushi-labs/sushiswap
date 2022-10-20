import { LazyLoggerMessage, Logger } from '@graphql-mesh/types';
declare type MessageTransformer = (msg: string) => string;
export declare const warnColor: MessageTransformer;
export declare const infoColor: MessageTransformer;
export declare const errorColor: MessageTransformer;
export declare const debugColor: MessageTransformer;
export declare const titleBold: MessageTransformer;
export declare class DefaultLogger implements Logger {
    name?: string;
    constructor(name?: string);
    private getLoggerMessage;
    private handleLazyMessage;
    private get isDebug();
    private get prefix();
    log(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    error(...args: any[]): void;
    debug(...lazyArgs: LazyLoggerMessage[]): void;
    child(name: string): Logger;
}
export {};
