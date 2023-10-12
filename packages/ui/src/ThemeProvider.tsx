'use client'

import {ThemeProvider as NextThemeProvider} from 'next-themes'
import {FC, ReactNode} from 'react'

import {OnramperProvider, Toaster} from './components'

interface ThemeProvider {
  children: ReactNode | ReactNode[]
  forcedTheme?: string
}

export const ThemeProvider: FC<ThemeProvider> = ({ children, forcedTheme }) => {
  return (
    <NextThemeProvider
      attribute="class"
      disableTransitionOnChange
      forcedTheme={forcedTheme}
    >
      <OnramperProvider>
        <Toaster />
        <div id="network-check-portal" />
        {children}
        <div id="popover-portal" />
        <div id="footer-portal" />
      </OnramperProvider>
    </NextThemeProvider>
  )
}
