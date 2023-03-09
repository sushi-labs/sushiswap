import { FC, ReactNode } from 'react'

interface ThemeProvider {
  children: ReactNode | Array<ReactNode>
}

export const ThemeProvider: FC<ThemeProvider> = ({ children }) => {
  return (
    <>
      {children}
      <div id="popover-portal" />
    </>
  )
}
