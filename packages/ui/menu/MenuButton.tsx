import { Menu as HeadlessMenu } from '@headlessui/react'
import React, { forwardRef, ReactNode } from 'react'

import { Button } from '..'
import { ExtractProps } from '../types'

export type MenuButton = ExtractProps<typeof HeadlessMenu.Button> & {
  children?: ReactNode
}

export const MenuButton: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<MenuButton> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, MenuButton>(({ className, children, ...props }, ref) => {
  return (
    // @ts-ignore
    <HeadlessMenu.Button as={React.Fragment} ref={ref} role="button">
      <Button {...props} className={className}>
        {children}
      </Button>
    </HeadlessMenu.Button>
  )
})
