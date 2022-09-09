import { FC, ReactNode } from 'react'

import { Drawer } from '../drawer'

interface ThemeProvider {
  children: ReactNode | Array<ReactNode>
}

export const ThemeProvider: FC<ThemeProvider> = ({ children }) => {
  return (
    <div className="flex">
      <Drawer.Provider>{children}</Drawer.Provider>
      <div id="popover-portal" />
    </div>
  )
}
