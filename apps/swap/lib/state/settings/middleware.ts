import { Middleware } from '@reduxjs/toolkit'

export const settingsMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  if (action.type?.startsWith('settings/')) {
    const settingsState = store.getState().settings
    localStorage.setItem('settings', JSON.stringify(settingsState))
  }

  return result
}
