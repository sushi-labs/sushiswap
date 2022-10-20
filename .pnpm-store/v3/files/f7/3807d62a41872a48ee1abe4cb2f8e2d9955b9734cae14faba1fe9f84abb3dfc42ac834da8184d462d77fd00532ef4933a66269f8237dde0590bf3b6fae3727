import _ts from 'typescript';
/**
 * Registration options.
 */
interface Options {
    basePath?: string;
    pretty?: boolean | null;
    logError?: boolean | null;
    files?: boolean | null;
    compiler?: string;
    ignore?: string[];
    project?: string;
    compilerOptions?: _ts.CompilerOptions;
    ignoreDiagnostics?: Array<number | string>;
    readFile?: (path: string) => string | undefined;
    fileExists?: (path: string) => boolean;
    transformers?: _ts.CustomTransformers;
    nodeVersionMajor?: number;
}
/**
 * Return type for registering `ts-node`.
 */
export declare type Register = (code: string, fileName: string, skipTypeCheck?: boolean) => SourceOutput;
/**
 * Register TypeScript compiler.
 */
export declare function register(opts?: Options): Register;
/**
 * Do post-processing on config options to support `ts-node`.
 */
export declare function fixConfig(config: {
    compilerOptions: any;
}, nodeVersionMajor?: number): {
    compilerOptions: any;
};
/**
 * Internal source output.
 */
declare type SourceOutput = {
    code: string;
    map: string;
};
export {};
