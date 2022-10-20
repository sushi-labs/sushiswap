import { Compilation, Compiler, Stats } from 'webpack';
export interface Options {
    /**
     * Simulate the removal of files
     *
     * default: false
     */
    dry?: boolean;
    /**
     * Write Logs to Console
     * (Always enabled when dry is true)
     *
     * default: false
     */
    verbose?: boolean;
    /**
     * Automatically remove all unused webpack assets on rebuild
     *
     * default: true
     */
    cleanStaleWebpackAssets?: boolean;
    /**
     * Do not allow removal of current webpack assets
     *
     * default: true
     */
    protectWebpackAssets?: boolean;
    /**
     * Removes files once prior to Webpack compilation
     *   Not included in rebuilds (watch mode)
     *
     * Use !negative patterns to exclude files
     *
     * default: ['**\/*']
     */
    cleanOnceBeforeBuildPatterns?: string[];
    /**
     * Removes files after every build (including watch mode) that match this pattern.
     * Used for files that are not created directly by Webpack.
     *
     * Use !negative patterns to exclude files
     *
     * default: []
     */
    cleanAfterEveryBuildPatterns?: string[];
    /**
     * Allow clean patterns outside of process.cwd()
     *
     * requires dry option to be explicitly set
     *
     * default: false
     */
    dangerouslyAllowCleanPatternsOutsideProject?: boolean;
}
declare class CleanWebpackPlugin {
    private readonly dry;
    private readonly verbose;
    private readonly cleanStaleWebpackAssets;
    private readonly protectWebpackAssets;
    private readonly cleanAfterEveryBuildPatterns;
    private readonly cleanOnceBeforeBuildPatterns;
    private readonly dangerouslyAllowCleanPatternsOutsideProject;
    private currentAssets;
    private initialClean;
    private outputPath;
    constructor(options?: Options);
    apply(compiler: Compiler): void;
    /**
     * Initially remove files from output directory prior to build.
     *
     * Only happens once.
     *
     * Warning: It is recommended to initially clean your build directory outside of webpack to minimize unexpected behavior.
     */
    handleInitial(compilation: Compilation): void;
    handleDone(stats: Stats): void;
    removeFiles(patterns: string[]): void;
}
export { CleanWebpackPlugin };
//# sourceMappingURL=clean-webpack-plugin.d.ts.map