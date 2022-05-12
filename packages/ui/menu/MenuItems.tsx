import { FC, forwardRef } from 'react'
import { ExtractProps } from '../types'
import { classNames } from '../index'
import { Menu as HeadlessMenu } from '@headlessui/react'

export type MenuItems = ExtractProps<typeof HeadlessMenu.Items> & {
  className?: string
}

export const MenuItems: FC<MenuItems> = forwardRef(({ className, ...props }, ref) => {
  return (
    <HeadlessMenu.Items
      ref={ref}
      className={classNames(
        className,
        'z-10 bg-dark-800 absolute right-0 mt-2 w-56 origin-top-right rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-dark-800 shadow-sm shadow-dark-1000',
      )}
      {...props}
    />
  )
})
