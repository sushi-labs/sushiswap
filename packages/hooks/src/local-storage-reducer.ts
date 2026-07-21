import type { SetStateAction } from 'react'

export interface LocalStorageState<T> {
  value: T
  persistence: 'none' | 'set' | 'remove'
  revision: number
}

export type LocalStorageAction<T> =
  | { type: 'set'; value: SetStateAction<T> }
  | { type: 'remove'; initialValue: T }
  | { type: 'sync'; value: T }

export function localStorageReducer<T>(
  state: LocalStorageState<T>,
  action: LocalStorageAction<T>,
): LocalStorageState<T> {
  switch (action.type) {
    case 'set':
      return {
        value:
          action.value instanceof Function
            ? action.value(state.value)
            : action.value,
        persistence: 'set',
        revision: state.revision + 1,
      }
    case 'remove':
      return {
        value: action.initialValue,
        persistence: 'remove',
        revision: state.revision + 1,
      }
    case 'sync':
      return {
        value: action.value,
        persistence: 'none',
        revision: state.revision,
      }
  }
}
