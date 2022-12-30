import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists'

import { DEFAULT_ACTIVE_LIST_URLS, DEFAULT_LIST_OF_LISTS } from './constants'
import {
  AcceptPayload,
  AddPayload,
  DisablePayload,
  EnablePayload,
  FulfilledPayload,
  PendingPayload,
  RejectedPayload,
  RemovePayload,
  TokenListsState,
  TokenListState,
} from './types'

const NEW_TOKEN_LIST_STATE: TokenListState = {
  error: null,
  current: null,
  loadingRequestId: null,
  pendingUpdate: null,
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P]
}

export const initialState: TokenListsState = {
  lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
  byUrl: {
    ...DEFAULT_LIST_OF_LISTS.reduce<Mutable<TokenListsState['byUrl']>>((memo, listUrl) => {
      memo[listUrl] = NEW_TOKEN_LIST_STATE
      return memo
    }, {}),
  },
  activeListUrls: DEFAULT_ACTIVE_LIST_URLS,
}

const reducers = {
  pending: (state: TokenListsState, action: PayloadAction<PendingPayload>) => {
    const { requestId, url } = action.payload
    const current = state.byUrl[url]?.current ?? null
    const pendingUpdate = state.byUrl[url]?.pendingUpdate ?? null
    state.byUrl[url] = {
      current,
      pendingUpdate,
      loadingRequestId: requestId,
      error: null,
    }
  },
  fulfilled: (state: TokenListsState, action: PayloadAction<FulfilledPayload>) => {
    const { url, tokenList, requestId } = action.payload
    const current = state.byUrl[url]?.current
    const loadingRequestId = state.byUrl[url]?.loadingRequestId

    // no-op if update does nothing
    if (current) {
      const upgradeType = getVersionUpgrade(current.version, tokenList.version)

      if (upgradeType === VersionUpgrade.NONE) return
      if (loadingRequestId === null || loadingRequestId === requestId) {
        state.byUrl[url] = {
          current,
          pendingUpdate: tokenList,
          loadingRequestId: null,
          error: null,
        }
      }
    } else {
      // activate if on default active
      if (DEFAULT_ACTIVE_LIST_URLS.includes(url)) {
        state.activeListUrls?.push(url)
      }

      state.byUrl[url] = {
        current: tokenList,
        pendingUpdate: null,
        loadingRequestId: null,
        error: null,
      }
    }
  },
  rejected: (state: TokenListsState, action: PayloadAction<RejectedPayload>) => {
    const { url, errorMessage, requestId } = action.payload
    if (state.byUrl[url]?.loadingRequestId !== requestId) {
      // no-op since it's not the latest request
      return
    }

    state.byUrl[url] = {
      current: state.byUrl[url].current ? state.byUrl[url].current : null,
      pendingUpdate: null,
      loadingRequestId: null,
      error: errorMessage,
    }
  },

  add: (state: TokenListsState, action: PayloadAction<AddPayload>) => {
    const url = action.payload
    if (!state.byUrl[url]) {
      state.byUrl[url] = NEW_TOKEN_LIST_STATE
    }
  },

  remove: (state: TokenListsState, action: PayloadAction<RemovePayload>) => {
    const url = action.payload
    if (state.activeListUrls && state.activeListUrls.includes(url)) {
      state.activeListUrls = state.activeListUrls.filter((u) => u !== url)
    }
  },
  enable: (state: TokenListsState, action: PayloadAction<EnablePayload>) => {
    const url = action.payload
    if (!state.byUrl[url]) {
      state.byUrl[url] = NEW_TOKEN_LIST_STATE
    }

    if (state.activeListUrls && !state.activeListUrls.includes(url)) {
      state.activeListUrls.push(url)
    }

    if (!state.activeListUrls) {
      state.activeListUrls = [url]
    }
  },
  disabled: (state: TokenListsState, action: PayloadAction<DisablePayload>) => {
    const url = action.payload
    if (state.activeListUrls && state.activeListUrls.includes(url)) {
      state.activeListUrls = state.activeListUrls.filter((u) => u !== url)
    }
  },

  accept: (state: TokenListsState, action: PayloadAction<AcceptPayload>) => {
    const url = action.payload
    if (!state.byUrl[url]?.pendingUpdate) {
      throw new Error('accept token list update called without pending update')
    }
    state.byUrl[url] = {
      ...state.byUrl[url],
      current: state.byUrl[url].pendingUpdate,
      pendingUpdate: null,
    }
  },

  update: (state: TokenListsState) => {
    // state loaded from localStorage, but new lists have never been initialized
    if (!state.lastInitializedDefaultListOfLists) {
      state.byUrl = initialState.byUrl
      state.activeListUrls = initialState.activeListUrls
    } else if (state.lastInitializedDefaultListOfLists) {
      const lastInitializedSet = state.lastInitializedDefaultListOfLists.reduce<Set<string>>(
        (s, l) => s.add(l),
        new Set()
      )
      const newListOfListsSet = DEFAULT_LIST_OF_LISTS.reduce<Set<string>>((s, l) => s.add(l), new Set())

      DEFAULT_LIST_OF_LISTS.forEach((listUrl) => {
        if (!lastInitializedSet.has(listUrl)) {
          state.byUrl[listUrl] = NEW_TOKEN_LIST_STATE
        }
      })

      state.lastInitializedDefaultListOfLists.forEach((listUrl) => {
        if (!newListOfListsSet.has(listUrl)) {
          delete state.byUrl[listUrl]
        }
      })
    }

    state.lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS

    // if no active lists, activate defaults
    if (!state.activeListUrls) {
      state.activeListUrls = DEFAULT_ACTIVE_LIST_URLS

      // for each list on default list, initialize if needed
      DEFAULT_ACTIVE_LIST_URLS.map((listUrl: string) => {
        if (!state.byUrl[listUrl]) {
          state.byUrl[listUrl] = NEW_TOKEN_LIST_STATE
        }
        return true
      })
    }
  },
}

export function createTokenListsSlice(reducerPath: string): Slice<TokenListsState> {
  return createSlice({
    name: reducerPath,
    initialState,
    reducers,
  })
}

export type TokenListsActions = ReturnType<typeof createTokenListsSlice>['actions']
