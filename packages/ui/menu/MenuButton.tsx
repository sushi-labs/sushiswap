import { Menu as HeadlessMenu } from '@headlessui/react'
import React, { FC, ReactNode } from 'react'

import { Button } from '..'
import { ExtractProps } from '../types'

export type MenuButton = ExtractProps<typeof HeadlessMenu.Button> & {
  children?: ReactNode
}

export const MenuButton: FC<MenuButton> = ({ className, children, ...props }) => {
  return (
    <HeadlessMenu.Button as={React.Fragment}>
      {React.createElement(
        Button,
        {
          ...props,
          className: className,
        },
        children
      )}
    </HeadlessMenu.Button>
  )
}
