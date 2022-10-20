/// <reference types="node" />
import { FileBase } from './types';
interface FileRefOptions {
    mode?: number;
    digest: string;
    contentType?: string;
    mutable?: boolean;
}
export default class FileRef implements FileBase {
    type: 'FileRef';
    mode: number;
    digest: string;
    contentType: string | undefined;
    private mutable;
    constructor({ mode, digest, contentType, mutable, }: FileRefOptions);
    toStreamAsync(): Promise<NodeJS.ReadableStream>;
    toStream(): NodeJS.ReadableStream;
}
export {};
