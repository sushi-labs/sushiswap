import type { Middleware } from 'redux';
export declare function getTimeMeasureUtils(maxDelay: number, fnName: string): {
    measureTime<T>(fn: () => T): T;
    warnIfExceeded(): void;
};
/**
 * @public
 */
export declare class MiddlewareArray<Middlewares extends Middleware<any, any>[]> extends Array<Middlewares[number]> {
    constructor(...items: Middlewares);
    static get [Symbol.species](): any;
    concat<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(items: AdditionalMiddlewares): MiddlewareArray<[...Middlewares, ...AdditionalMiddlewares]>;
    concat<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(...items: AdditionalMiddlewares): MiddlewareArray<[...Middlewares, ...AdditionalMiddlewares]>;
    prepend<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(items: AdditionalMiddlewares): MiddlewareArray<[...AdditionalMiddlewares, ...Middlewares]>;
    prepend<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(...items: AdditionalMiddlewares): MiddlewareArray<[...AdditionalMiddlewares, ...Middlewares]>;
}
export declare function freezeDraftable<T>(val: T): T;
