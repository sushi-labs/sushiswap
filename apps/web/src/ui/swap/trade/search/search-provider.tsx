'use client'

import { useDebounce } from '@sushiswap/hooks'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

interface State {
  mutate: {
    setSearchValue(value: string): void
  }
  state: {
    searchValue: string
  }
}

const SearchContext = createContext<State>({} as State)

interface SearchProviderProps {
  children: React.ReactNode
}

const SearchProvider: FC<SearchProviderProps> = ({ children }) => {
  const [_searchValue, _setSearchValue] = useState<string>('')
  const searchValue = useDebounce(_searchValue, 200)

  const setSearchValue = useCallback((value: string) => {
    _setSearchValue(value)
  }, [])

  return (
    <SearchContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setSearchValue,
          },
          state: {
            searchValue,
          },
        }
      }, [searchValue, setSearchValue])}
    >
      {children}
    </SearchContext.Provider>
  )
}

const useSearchContext = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('Hook can only be used inside Search Context')
  }

  return context
}

export { SearchProvider, useSearchContext }
