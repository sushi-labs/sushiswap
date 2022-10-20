import { ImportFn, Logger, MeshFetch } from '@graphql-mesh/types';
export interface ReadFileOrUrlOptions extends RequestInit {
    allowUnknownExtensions?: boolean;
    fallbackFormat?: 'json' | 'yaml' | 'js' | 'ts';
    cwd: string;
    fetch: MeshFetch;
    importFn: ImportFn;
    logger: Logger;
}
export declare function isUrl(str: string): boolean;
export declare function readFileOrUrl<T>(filePathOrUrl: string, config: ReadFileOrUrlOptions): Promise<T>;
export declare function loadYaml(filepath: string, content: string, logger: Logger): any;
export declare function readFile<T>(fileExpression: string, { allowUnknownExtensions, cwd, fallbackFormat, importFn, logger }: ReadFileOrUrlOptions): Promise<T>;
export declare function readUrl<T>(path: string, config: ReadFileOrUrlOptions): Promise<T>;
