import { LayoutProps } from '.next/types/app/terms-of-use/layout.js'
import React, { FC } from 'react'

const Layout: FC<LayoutProps> = ({ children }) => {
  return <div className="pb-4 mt-10 mb-4 lg:mb-40 lg:mt-20">{children}</div>
}

export default Layout
