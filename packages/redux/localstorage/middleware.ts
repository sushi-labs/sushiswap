import { Middleware } from '@reduxjs/toolkit'

export const storageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  if (action.type?.startsWith('storage/')) {
    const storageState = store.getState().storage
    localStorage.setItem('userPreferences', JSON.stringify(storageState))
  }

  return result
}
