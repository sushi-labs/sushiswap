'use client'

import { FC, ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'
import { ToastContainer } from './components/toast'

interface BaseProvidersProps {
  children: ReactNode | ReactNode[]
  forcedTheme?: string
}

export const BaseProviders: FC<BaseProvidersProps> = ({
  children,
  forcedTheme,
}) => {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      forcedTheme={forcedTheme}
    >
      <ToastContainer />
      <div id="network-check-portal" />
      {children}
      <div id="popover-portal" />
      <div id="footer-portal" />
    </ThemeProvider>
  )
}
