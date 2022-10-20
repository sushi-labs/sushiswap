import 'hardhat/types/config'
import 'hardhat/types/runtime'

declare module 'hardhat/types/config' {
  export type HardhatTask = string | ExpandedHardhatTask

  export type ExpandedHardhatTask = {
    command: string
    params?: {
      [key: string]: any
    }
  }

  export type WatcherTask = {
    tasks?: HardhatTask[]
    files?: string[]
    ignoredFiles?: string[]
    verbose?: boolean
  }

  // User facing config
  export interface HardhatUserConfig {
    watcher?: { [key: string]: WatcherTask }
  }

  export type WatcherConfig = {
    [key: string]: {
      tasks: Required<ExpandedHardhatTask>[]
      files: string[]
      ignoredFiles: string[]
      verbose: boolean
    }
  }

  // Fully resolved config
  export interface HardhatConfig {
    watcher: WatcherConfig
  }
}
