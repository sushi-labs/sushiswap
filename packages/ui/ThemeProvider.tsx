import { FC, ReactNode } from 'react'

import { ToastContainer } from './toast'

interface ThemeProvider {
  children: ReactNode | Array<ReactNode>
}

export const ThemeProvider: FC<ThemeProvider> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer />
      <div id="popover-portal" />
    </>
  )
}
