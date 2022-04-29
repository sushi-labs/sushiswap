import { ExtractProps } from '../types'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { FC, forwardRef } from 'react'
import classNames from 'classnames'
import { ChevronDownIcon } from '@heroicons/react/solid'

export type MenuButton = ExtractProps<typeof HeadlessMenu.Button> & {
  className?: string
}

export const MenuButton: FC<MenuButton> = forwardRef<HTMLDivElement, MenuButton>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref}>
        <HeadlessMenu.Button
          {...props}
          className={classNames(
            className,
            'inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500',
          )}
        >
          {children}
          <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
        </HeadlessMenu.Button>
      </div>
    )
  },
)
