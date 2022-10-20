/// <reference types="node" />
import { SpawnOptions } from 'child_process';
import { Meta, PackageJson, NodeVersion, Config } from '../types';
export declare type CliType = 'yarn' | 'npm' | 'pnpm';
export interface ScanParentDirsResult {
    /**
     * "yarn", "npm", or "pnpm" depending on the presence of lockfiles.
     */
    cliType: CliType;
    /**
     * The file path of found `package.json` file, or `undefined` if none was
     * found.
     */
    packageJsonPath?: string;
    /**
     * The contents of found `package.json` file, when the `readPackageJson`
     * option is enabled.
     */
    packageJson?: PackageJson;
    /**
     * The `lockfileVersion` number from the `package-lock.json` file,
     * when present.
     */
    lockfileVersion?: number;
}
export interface WalkParentDirsProps {
    /**
     * The highest directory, typically the workPath root of the project.
     * If this directory is reached and it doesn't contain the file, null is returned.
     */
    base: string;
    /**
     * The directory to start searching, typically the same directory of the entrypoint.
     * If this directory doesn't contain the file, the parent is checked, etc.
     */
    start: string;
    /**
     * The name of the file to search for, typically `package.json` or `Gemfile`.
     */
    filename: string;
}
export interface SpawnOptionsExtended extends SpawnOptions {
    /**
     * Pretty formatted command that is being spawned for logging purposes.
     */
    prettyCommand?: string;
    /**
     * Returns instead of throwing an error when the process exits with a
     * non-0 exit code. When relevant, the returned object will include
     * the error code, stdout and stderr.
     */
    ignoreNon0Exit?: boolean;
}
export declare function spawnAsync(command: string, args: string[], opts?: SpawnOptionsExtended): Promise<void>;
export declare function execAsync(command: string, args: string[], opts?: SpawnOptionsExtended): Promise<{
    stdout: string;
    stderr: string;
    code: number;
}>;
export declare function spawnCommand(command: string, options?: SpawnOptions): import("child_process").ChildProcess;
export declare function execCommand(command: string, options?: SpawnOptions): Promise<boolean>;
export declare function getNodeBinPath({ cwd, }: {
    cwd: string;
}): Promise<string>;
export declare function runShellScript(fsPath: string, args?: string[], spawnOpts?: SpawnOptions): Promise<boolean>;
export declare function getSpawnOptions(meta: Meta, nodeVersion: NodeVersion): SpawnOptions;
export declare function getNodeVersion(destPath: string, _nodeVersion?: string, config?: Config, meta?: Meta): Promise<NodeVersion>;
export declare function scanParentDirs(destPath: string, readPackageJson?: boolean): Promise<ScanParentDirsResult>;
export declare function walkParentDirs({ base, start, filename, }: WalkParentDirsProps): Promise<string | null>;
export declare function runNpmInstall(destPath: string, args?: string[], spawnOpts?: SpawnOptions, meta?: Meta, nodeVersion?: NodeVersion): Promise<boolean>;
export declare function getEnvForPackageManager({ cliType, lockfileVersion, nodeVersion, env, }: {
    cliType: CliType;
    lockfileVersion: number | undefined;
    nodeVersion: NodeVersion | undefined;
    env: {
        [x: string]: string | undefined;
    };
}): {
    [x: string]: string | undefined;
};
export declare function runCustomInstallCommand({ destPath, installCommand, nodeVersion, spawnOpts, }: {
    destPath: string;
    installCommand: string;
    nodeVersion: NodeVersion;
    spawnOpts?: SpawnOptions;
}): Promise<void>;
export declare function runPackageJsonScript(destPath: string, scriptNames: string | Iterable<string>, spawnOpts?: SpawnOptions): Promise<boolean>;
export declare function runBundleInstall(destPath: string, args?: string[], spawnOpts?: SpawnOptions, meta?: Meta): Promise<void>;
export declare function runPipInstall(destPath: string, args?: string[], spawnOpts?: SpawnOptions, meta?: Meta): Promise<void>;
export declare function getScriptName(pkg: Pick<PackageJson, 'scripts'> | null | undefined, possibleNames: Iterable<string>): string | null;
/**
 * @deprecate installDependencies() is deprecated.
 * Please use runNpmInstall() instead.
 */
export declare const installDependencies: typeof runNpmInstall;
