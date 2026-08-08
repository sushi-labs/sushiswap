'use client'

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useReducer,
} from 'react'
import {
  type LocalStorageState,
  localStorageReducer,
} from './local-storage-reducer'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>, () => void] => {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (_error) {
      // If error also return initialValue
      return initialValue
    }
  }, [initialValue, key])

  const [state, dispatch] = useReducer(
    localStorageReducer<T>,
    undefined,
    (): LocalStorageState<T> => ({
      value: readValue(),
      persistence: 'none',
      revision: 0,
    }),
  )

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
    dispatch({ type: 'set', value })
  }, [])

  const removeItem = useCallback(() => {
    dispatch({ type: 'remove', initialValue })
  }, [initialValue])

  useEffect(() => {
    if (state.persistence === 'none' || typeof window === 'undefined') return

    try {
      if (state.persistence === 'remove') {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(state.value))
      }

      window.dispatchEvent(new Event(key))
    } catch (error) {
      console.log(error)
    }
  }, [key, state])

  // To trigger rerenders globally
  useEffect(() => {
    const listener = () => {
      dispatch({ type: 'sync', value: readValue() })
    }
    window.addEventListener(key, listener)

    return () => window.removeEventListener(key, listener)
  }, [key, readValue])

  return [state.value, setValue, removeItem]
}
