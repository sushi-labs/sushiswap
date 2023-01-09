'use client'

import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react'

import { SearchButton } from './SearchButton'
import { SearchPanel } from './SearchPanel'

interface SearchContext {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const SearchContext = createContext<SearchContext | undefined>(undefined)

interface SearchProvider<P> extends FC<P> {
  Panel: FC
  Button: FC
}

interface ProviderProps {
  children: (({ open, setOpen }: { open: boolean; setOpen(open: boolean): void }) => ReactNode) | ReactNode
}

export const Search: SearchProvider<ProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {typeof children === 'function' ? children({ open, setOpen }) : children}
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('Hook can only be used inside Search Context')
  }

  return context
}

Search.Panel = SearchPanel
Search.Button = SearchButton
