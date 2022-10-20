export declare type Params = Record<string, string | number | boolean | null>;
export declare type ErrorResponse = {
    code: number;
    message: string;
};
export declare function insertParams(template: string, params?: Params): string;
export declare function stringifyQuery(query?: Params): string;
export declare function fetchData<T>(url: string, body?: unknown): Promise<T>;
