/// <reference types="node" />
import { ServerResponse, IncomingMessage } from 'http';
export declare type VercelRequestCookies = {
    [key: string]: string;
};
export declare type VercelRequestQuery = {
    [key: string]: string | string[];
};
export declare type VercelRequestBody = any;
export declare type VercelRequest = IncomingMessage & {
    query: VercelRequestQuery;
    cookies: VercelRequestCookies;
    body: VercelRequestBody;
};
export declare type VercelResponse = ServerResponse & {
    send: (body: any) => VercelResponse;
    json: (jsonBody: any) => VercelResponse;
    status: (statusCode: number) => VercelResponse;
    redirect: (statusOrUrl: string | number, url?: string) => VercelResponse;
};
export declare type VercelApiHandler = (req: VercelRequest, res: VercelResponse) => void;
/** @deprecated Use VercelRequestCookies instead. */
export declare type NowRequestCookies = VercelRequestCookies;
/** @deprecated Use VercelRequestQuery instead. */
export declare type NowRequestQuery = VercelRequestQuery;
/** @deprecated Use VercelRequestBody instead. */
export declare type NowRequestBody = any;
/** @deprecated Use VercelRequest instead. */
export declare type NowRequest = VercelRequest;
/** @deprecated Use VercelResponse instead. */
export declare type NowResponse = VercelResponse;
/** @deprecated Use VercelApiHandler instead. */
export declare type NowApiHandler = VercelApiHandler;
