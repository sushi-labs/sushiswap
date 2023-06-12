import { Menu as HeadlessMenu } from '@headlessui/react'
import classNames from 'classnames'
import { FC, forwardRef, ReactNode } from 'react'

import { ExtractProps } from '../types'

export type MenuItem = ExtractProps<typeof HeadlessMenu.Item> & {
  children?: ReactNode | Array<ReactNode>
  className?: string
  startIcon?: ReactNode
}

export const MenuItem: FC<MenuItem> = forwardRef<HTMLDivElement, MenuItem>(
  ({ className, startIcon, children, as, ...props }, ref) => {
    return (
      <HeadlessMenu.Item
        {...props}
        ref={ref}
        as={as || 'div'}
        className={({ active }: { active: boolean; selected: boolean }) =>
          classNames(
            active ? 'text-white bg-blue-500' : 'text-high-emphesis',
            'whitespace-nowrap flex gap-2 items-center font-medium text-sm cursor-pointer select-none relative py-2 pl-4 pr-9 my-1 mx-1 rounded-xl',
            className
          )
        }
      >
        {startIcon && startIcon}
        {children}
      </HeadlessMenu.Item>
    )
  }
)
