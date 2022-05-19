import type { LogsActions } from './slice'

export interface LogsContext {
  reducerPath: string
  actions: LogsActions
}
