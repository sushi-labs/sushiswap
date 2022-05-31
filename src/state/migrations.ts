import { initialState as initialListsState } from './lists/reducer'
import { initialState as initialUserState } from './user/reducer'

// https://github.com/rt2zz/redux-persist/blob/master/docs/migrations.md#example-with-createmigrate
const migrations = {
  // @ts-ignore
  0: (state) => {
    return {
      ...state,
      lists: undefined,
    }
  },
  // @ts-ignore
  1: (state) => {
    return {
      ...state,
      user: initialUserState,
    }
  },
  // @ts-ignore
  2: (state) => {
    return {
      ...state,
      lists: undefined,
    }
  },
  // @ts-ignore
  3: (state) => {
    return {
      ...state,
      lists: initialListsState,
    }
  },
}

export default migrations
