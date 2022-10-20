/// <reference types="node" />
import { FileBase } from './types';
interface FileFsRefOptions {
    mode?: number;
    contentType?: string;
    fsPath: string;
}
interface FromStreamOptions {
    mode: number;
    contentType?: string;
    stream: NodeJS.ReadableStream;
    fsPath: string;
}
declare class FileFsRef implements FileBase {
    type: 'FileFsRef';
    mode: number;
    fsPath: string;
    contentType: string | undefined;
    constructor({ mode, contentType, fsPath }: FileFsRefOptions);
    static fromFsPath({ mode, contentType, fsPath, }: FileFsRefOptions): Promise<FileFsRef>;
    static fromStream({ mode, contentType, stream, fsPath, }: FromStreamOptions): Promise<FileFsRef>;
    toStreamAsync(): Promise<NodeJS.ReadableStream>;
    toStream(): NodeJS.ReadableStream;
}
export default FileFsRef;
