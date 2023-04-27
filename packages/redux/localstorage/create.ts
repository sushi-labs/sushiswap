import { CaseReducerActions, Middleware, Reducer, SliceCaseReducers } from '@reduxjs/toolkit'

import { StorageContext } from './context'
import {
  useAllCustomTokens as _useAllCustomTokens,
  useCustomTokens as _useCustomTokens,
  useSettings as _useSettings,
} from './hooks'
import { storageMiddleware } from './middleware'
import { createStorageSlice } from './slice'
import { StorageState } from './types'

type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? undefined
  : ((...b: T) => void) extends (a: any, ...b: infer I) => void
  ? I
  : []

type ParamsWithoutContext<T extends (...args: any) => any> = RemoveFirstFromTuple<Parameters<T>>

export interface StorageOptions {
  reducerPath?: string
}

export type StorageHooks = {
  useSettings: (...args: ParamsWithoutContext<typeof _useSettings>) => ReturnType<typeof _useSettings>
  useCustomTokens: (...args: ParamsWithoutContext<typeof _useCustomTokens>) => ReturnType<typeof _useCustomTokens>
  useAllCustomTokens: (
    ...args: ParamsWithoutContext<typeof _useAllCustomTokens>
  ) => ReturnType<typeof _useAllCustomTokens>
}

export function createStorage(options?: StorageOptions): {
  reducerPath: string
  reducer: Reducer<StorageState>
  actions: CaseReducerActions<SliceCaseReducers<StorageState>, string>
  hooks: StorageHooks
  middleware: Record<string, Middleware>
} {
  const reducerPath = options?.reducerPath ?? 'storage'
  const { actions, reducer } = createStorageSlice(reducerPath)
  const context: StorageContext = { reducerPath, actions }

  const useSettings = () => _useSettings(context)
  const useCustomTokens = (chainId?: number) => _useCustomTokens(context, chainId)
  const useAllCustomTokens = () => _useAllCustomTokens(context)

  const hooks = {
    useSettings,
    useCustomTokens,
    useAllCustomTokens,
  }

  const middleware = {
    storageMiddleware,
  }

  return {
    reducerPath,
    reducer,
    actions,
    hooks,
    middleware,
  }
}
