import { Package } from "@manypkg/get-packages";
export declare function add(pathToFile: string, cwd: string): Promise<boolean>;
export declare function commit(message: string, cwd: string): Promise<boolean>;
export declare function getAllTags(cwd: string): Promise<Set<string>>;
export declare function tag(tagStr: string, cwd: string): Promise<boolean>;
export declare function getDivergedCommit(cwd: string, ref: string): Promise<string>;
export declare const getCommitThatAddsFile: (gitPath: string, cwd: string) => Promise<string | undefined>;
/**
 * Get the short SHAs for the commits that added files, including automatically
 * extending a shallow clone if necessary to determine any commits.
 * @param gitPaths - Paths to fetch
 * @param cwd - Location of the repository
 */
export declare function getCommitsThatAddFiles(gitPaths: string[], cwd: string): Promise<(string | undefined)[]>;
export declare function isRepoShallow({ cwd }: {
    cwd: string;
}): Promise<boolean>;
export declare function deepenCloneBy({ by, cwd }: {
    by: number;
    cwd: string;
}): Promise<void>;
export declare function getChangedFilesSince({ cwd, ref, fullPath, }: {
    cwd: string;
    ref: string;
    fullPath?: boolean;
}): Promise<Array<string>>;
export declare function getChangedChangesetFilesSinceRef({ cwd, ref, }: {
    cwd: string;
    ref: string;
}): Promise<Array<string>>;
export declare function getChangedPackagesSinceRef({ cwd, ref, }: {
    cwd: string;
    ref: string;
}): Promise<Package[]>;
export declare function tagExists(tagStr: string, cwd: string): Promise<boolean>;
export declare function getCurrentCommitId({ cwd, }: {
    cwd: string;
}): Promise<string>;
export declare function remoteTagExists(tagStr: string): Promise<boolean>;
