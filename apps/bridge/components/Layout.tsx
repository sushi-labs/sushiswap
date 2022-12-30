import { FC, ReactNode } from 'react'

export const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  return <div className="px-2 pt-10 space-y-12 sm:pt-20 pb-60">{children}</div>
}
