'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { FC, ReactNode } from 'react'

import { ToastContainer } from './components'
import { OnramperProvider } from './components/onramper'

interface ThemeProvider {
  children: ReactNode | Array<ReactNode>
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
        <ToastContainer />
        <div id="network-check-portal" />
        {children}
        <div id="popover-portal" />
        <div id="footer-portal" />
      </OnramperProvider>
    </NextThemeProvider>
  )
}
