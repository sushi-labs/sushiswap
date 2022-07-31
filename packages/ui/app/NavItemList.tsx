import { FC, ReactElement } from 'react'

import { classNames } from '../index'
import { NavItem } from './NavItem'

export interface NavItemListProps {
  className?: string
  children: ReactElement<typeof NavItem> | Array<ReactElement<typeof NavItem>>
}

export const NavItemList: FC<NavItemListProps> = ({ children, className }) => {
  return <div className={classNames(className, 'gap-4 hidden lg:flex')}>{children}</div>
}
