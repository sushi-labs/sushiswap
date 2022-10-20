import { File } from './types';
import { Lambda } from './lambda';
interface PrerenderOptions {
    expiration: number | false;
    lambda: Lambda;
    fallback: File | null;
    group?: number;
    bypassToken?: string | null;
    allowQuery?: string[];
}
export declare class Prerender {
    type: 'Prerender';
    expiration: number | false;
    lambda: Lambda;
    fallback: File | null;
    group?: number;
    bypassToken: string | null;
    allowQuery?: string[];
    constructor({ expiration, lambda, fallback, group, bypassToken, allowQuery, }: PrerenderOptions);
}
export {};
