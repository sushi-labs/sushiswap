import create, { StoreApi, UseBoundStore } from 'zustand'
import { useLayoutEffect } from 'react'
import createContext from 'zustand/context'

export type StoreState = {}

let store: UseBoundStore<StoreState, StoreApi<StoreState>>

const initialState = {}
const zustandContext = createContext()

export const Provider = zustandContext.Provider
export const useStore = zustandContext.useStore

export const initializeStore = (preloadedState = {}) => {
  return create(() => ({
    ...initialState,
    ...preloadedState,
  }))
}

export function useCreateStore(initialState = {}) {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeStore(initialState)
  }

  // For CSR, always re-use same store.
  store = store ?? initializeStore(initialState)

  // And if initialState changes, then merge states in the next render cycle.
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (initialState) {
      store.setState({
        ...store.getState(),
        ...initialState,
      })
    }
  }, [initialState])

  return () => store
}

export default useStore
