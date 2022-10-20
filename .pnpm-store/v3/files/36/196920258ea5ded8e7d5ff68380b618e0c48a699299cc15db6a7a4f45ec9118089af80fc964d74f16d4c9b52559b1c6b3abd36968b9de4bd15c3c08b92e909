import 'hardhat/types/config';
import 'hardhat/types/runtime';
declare module 'hardhat/types/config' {
    type HardhatTask = string | ExpandedHardhatTask;
    type ExpandedHardhatTask = {
        command: string;
        params?: {
            [key: string]: any;
        };
    };
    type WatcherTask = {
        tasks?: HardhatTask[];
        files?: string[];
        ignoredFiles?: string[];
        verbose?: boolean;
    };
    interface HardhatUserConfig {
        watcher?: {
            [key: string]: WatcherTask;
        };
    }
    type WatcherConfig = {
        [key: string]: {
            tasks: Required<ExpandedHardhatTask>[];
            files: string[];
            ignoredFiles: string[];
            verbose: boolean;
        };
    };
    interface HardhatConfig {
        watcher: WatcherConfig;
    }
}
//# sourceMappingURL=type-extensions.d.ts.map