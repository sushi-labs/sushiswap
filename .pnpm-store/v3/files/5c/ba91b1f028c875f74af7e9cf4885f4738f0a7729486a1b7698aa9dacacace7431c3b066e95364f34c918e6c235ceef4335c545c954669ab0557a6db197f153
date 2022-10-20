import FileFsRef from '../file-fs-ref';
import { Files, Meta } from '../types';
export interface DownloadedFiles {
    [filePath: string]: FileFsRef;
}
export declare function isSymbolicLink(mode: number): boolean;
export default function download(files: Files, basePath: string, meta?: Meta): Promise<DownloadedFiles>;
