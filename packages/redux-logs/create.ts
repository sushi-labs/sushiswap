import type { LogsContext } from './context'
import { useLogs as _useLogs } from './hooks'
import { createLogsSlice } from './slice'
import { createUpdater } from './updater'

type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? undefined
  : ((...b: T) => void) extends (a: any, ...b: infer I) => void
  ? I
  : []
type ParamsWithoutContext<T extends (...args: any) => any> = RemoveFirstFromTuple<Parameters<T>>

export interface LogsOptions {
  reducerPath?: string
}

// Inspired by RTK Query's createApi
export function createLogs(options?: LogsOptions) {
  const reducerPath = options?.reducerPath ?? 'logs'
  const slice = createLogsSlice(reducerPath)
  const { actions, reducer } = slice
  const context: LogsContext = { reducerPath, actions }

  const useLogs = (...args: ParamsWithoutContext<typeof _useLogs>) => _useLogs(context, ...args)
  const hooks = {
    useLogs,
  }

  const Updater = createUpdater(context)

  return {
    reducerPath,
    reducer,
    actions,
    hooks,
    Updater,
  }
}
