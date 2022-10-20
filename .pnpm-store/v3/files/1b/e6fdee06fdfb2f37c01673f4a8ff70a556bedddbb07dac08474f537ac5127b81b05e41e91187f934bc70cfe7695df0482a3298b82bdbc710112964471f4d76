import { NextConfig, NextApiHandler, NextApiResponse, NextApiRequest } from 'next';
import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { Logger } from './logger';
declare global {
    var EdgeRuntime: string;
}
export declare type AxiomAPIRequest = NextApiRequest & {
    log: Logger;
};
export declare type AxiomApiHandler = (request: AxiomAPIRequest, response: NextApiResponse) => NextApiHandler | Promise<NextApiHandler> | Promise<void>;
export declare type AxiomRequest = NextRequest & {
    log: Logger;
};
export declare type AxiomMiddleware = (request: AxiomRequest, event: NextFetchEvent) => NextMiddlewareResult | Promise<NextMiddlewareResult>;
declare type WithAxiomParam = NextConfig | NextApiHandler | NextMiddleware;
export declare function withAxiom<T extends WithAxiomParam>(param: T): T;
export {};
