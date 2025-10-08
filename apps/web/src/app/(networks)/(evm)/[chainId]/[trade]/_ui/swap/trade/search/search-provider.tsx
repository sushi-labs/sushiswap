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
    clearSearchValue(): void
    setIsOpen(value: boolean): void
  }
  state: {
    searchValue: string
    debouncedSearchValue: string
    isOpen: boolean
  }
}

const SearchContext = createContext<State>({} as State)

interface SearchProviderProps {
  children: React.ReactNode
}

const SearchProvider: FC<SearchProviderProps> = ({ children }) => {
  const [searchValue, _setSearchValue] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const debouncedSearchValue = useDebounce(searchValue, 200)

  const setSearchValue = useCallback((value: string) => {
    _setSearchValue(value)
  }, [])

  const clearSearchValue = useCallback(() => {
    _setSearchValue('')
  }, [])

  return (
    <SearchContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setSearchValue,
            clearSearchValue,
            setIsOpen,
          },
          state: {
            searchValue,
            debouncedSearchValue,
            isOpen,
          },
        }
      }, [
        searchValue,
        setSearchValue,
        debouncedSearchValue,
        clearSearchValue,
        isOpen,
      ])}
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
