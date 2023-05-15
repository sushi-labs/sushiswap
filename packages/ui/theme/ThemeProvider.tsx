'use client'

import { FC, ReactNode } from 'react'
import { ToastContainer } from '../future/components/toast'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

interface ThemeProvider {
  children: ReactNode | Array<ReactNode>
  forcedTheme?: string
}

export const ThemeProvider: FC<ThemeProvider> = ({ children, forcedTheme }) => {
  return (
    <NextThemeProvider attribute="class" disableTransitionOnChange forcedTheme={forcedTheme}>
      <div id="network-check-portal" />
      {children}
      <div id="popover-portal" />
      <ToastContainer />
    </NextThemeProvider>
  )
}
