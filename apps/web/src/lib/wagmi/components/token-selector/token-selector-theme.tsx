'use client'

import { type ReactNode, createContext, useContext } from 'react'

export type TokenSelectorTheme = 'default' | 'perps'

const TokenSelectorThemeContext = createContext<TokenSelectorTheme>('default')

export function TokenSelectorThemeProvider({
  children,
  theme,
}: {
  children: ReactNode
  theme: TokenSelectorTheme
}) {
  return (
    <TokenSelectorThemeContext.Provider value={theme}>
      {children}
    </TokenSelectorThemeContext.Provider>
  )
}

export function useTokenSelectorTheme(): TokenSelectorTheme {
  return useContext(TokenSelectorThemeContext)
}
