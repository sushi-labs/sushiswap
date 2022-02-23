import { ExtractProps } from '../types'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { FC, forwardRef } from 'react'
import { classNames } from '../lib/classNames'

export type MenuItems = ExtractProps<typeof HeadlessMenu.Items> & {
  className?: string
}

export const MenuItems: FC<MenuItems> = forwardRef<HTMLDivElement, MenuItems>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref}>
        <HeadlessMenu.Items
          {...props}
          className={classNames(
            className,
            'absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
          )}
        >
          <div className="py-1">{children}</div>
        </HeadlessMenu.Items>
      </div>
    )
  },
)
