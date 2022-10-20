import vanillaGlob_ from 'glob';
import FileFsRef from '../file-fs-ref';
export declare type GlobOptions = vanillaGlob_.IOptions;
interface FsFiles {
    [filePath: string]: FileFsRef;
}
export default function glob(pattern: string, opts: GlobOptions | string, mountpoint?: string): Promise<FsFiles>;
export {};
