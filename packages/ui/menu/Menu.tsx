import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { FC, Fragment, FunctionComponent, ReactElement, ReactNode } from 'react'

import { MenuButton } from './MenuButton'
import { MenuItem } from './MenuItem'
import { MenuItems } from './MenuItems'

interface MenuProps {
  className?: string
  button: ReactNode
  children: ReactElement<typeof HeadlessMenu.Items>
}

const MenuRoot: FC<MenuProps> = ({ className, button, children }) => {
  return (
    <HeadlessMenu as="div" className={classNames(className, 'relative inline-block text-left')}>
      <div>{button}</div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {children}
      </Transition>
    </HeadlessMenu>
  )
}

export const Menu: FunctionComponent<MenuProps> & {
  Item: FC<MenuItem>
  Items: FC<MenuItems>
  Button: FC<MenuButton>
} = Object.assign(MenuRoot, {
  Item: MenuItem,
  Items: MenuItems,
  Button: MenuButton,
})
