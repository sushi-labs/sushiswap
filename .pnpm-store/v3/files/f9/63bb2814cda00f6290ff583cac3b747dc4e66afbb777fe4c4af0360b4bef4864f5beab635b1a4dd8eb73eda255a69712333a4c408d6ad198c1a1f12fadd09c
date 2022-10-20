export interface JsonRpcRoutesConfig {
    [target: string]: string[];
}
export interface JsonRpcRouterMap {
    [route: string]: string;
}
export declare abstract class IJsonRpcRouter {
    routes: JsonRpcRoutesConfig;
    abstract map: JsonRpcRouterMap;
    constructor(routes: JsonRpcRoutesConfig);
    abstract isSupported(method: string): boolean;
    abstract getRouteTarget(method: string): string | undefined;
    abstract getLeadingWildcardRoutes(): string[];
    abstract getTrailingWildcardRoutes(): string[];
    abstract register(routes: JsonRpcRoutesConfig): JsonRpcRouterMap;
}
//# sourceMappingURL=router.d.ts.map