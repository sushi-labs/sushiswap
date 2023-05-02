'use client'

import { FC, ReactNode } from 'react'
import { ToastContainer } from '../future/components/toast'

interface ThemeProvider {
  children: ReactNode | Array<ReactNode>
}

export const ThemeProvider: FC<ThemeProvider> = ({ children }) => {
  return (
    <>
      <div id="network-check-portal" />
      {children}
      <div id="popover-portal" />
      <ToastContainer />
    </>
  )
}
