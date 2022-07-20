import { Menu as HeadlessMenu } from '@headlessui/react'
import classNames from 'classnames'
import React, { FC, FunctionComponent, ReactElement } from 'react'
import ReactDOM from 'react-dom'

import { AppearOnMount } from '../animation'
import { MenuButton } from './MenuButton'
import { MenuItem } from './MenuItem'
import { MenuItems } from './MenuItems'
import { usePopper } from './usePopper'

interface MenuProps {
  className?: string
  button: ReactElement
  children: ReactElement
}

const MenuRoot: FC<MenuProps> = ({ className, button, children }) => {
  const [trigger, container] = usePopper({
    placement: 'bottom-end',
    modifiers: [
      { name: 'flip', enabled: true, options: { padding: 8 } },
      { name: 'offset', options: { offset: [0, 10] } },
    ],
  })

  return (
    <AppearOnMount>
      {(mounted) =>
        mounted ? (
          <HeadlessMenu as="div" className={classNames(className, 'relative')}>
            {React.cloneElement(button, { ref: trigger })}
            {ReactDOM.createPortal(React.cloneElement(children, { ref: container }), document.body)}
          </HeadlessMenu>
        ) : (
          <></>
        )
      }
    </AppearOnMount>
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
