import { FC, ReactNode } from 'react'

export const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  return <div className="pt-10 sm:pt-20 space-y-12 pb-60 px-2">{children}</div>
}
