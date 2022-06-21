import { SettingsContext } from './context'
import { useSettings as _useSettings } from './hooks'
import { settingsMiddleware } from './middleware'
import { createSettingsSlice } from './slice'

export interface SettingsOptions {
  reducerPath?: string
}

export function createSettings(options?: SettingsOptions) {
  const reducerPath = options?.reducerPath ?? 'settings'
  const { actions, reducer } = createSettingsSlice(reducerPath)
  const context: SettingsContext = { reducerPath, actions }

  const useSettings = () => _useSettings(context)

  const hooks = {
    useSettings,
  }

  return {
    reducerPath,
    reducer,
    actions,
    hooks,
    middleware: [settingsMiddleware],
  }
}
