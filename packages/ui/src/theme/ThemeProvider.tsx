'use client'

import { FC, ReactNode } from 'react'
import { ToastContainer } from '../future/components/toast'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { Modal } from '../future/components/modal/Modal'

interface ThemeProvider {
  children: ReactNode | Array<ReactNode>
  forcedTheme?: string
}

export const ThemeProvider: FC<ThemeProvider> = ({ children, forcedTheme }) => {
  return (
    <NextThemeProvider attribute="class" disableTransitionOnChange forcedTheme={forcedTheme}>
      <Modal.Provider>
        <ToastContainer />
        <div id="network-check-portal" />
        {children}
        <div id="popover-portal" />
        <div id="footer-portal" />
      </Modal.Provider>
    </NextThemeProvider>
  )
}
