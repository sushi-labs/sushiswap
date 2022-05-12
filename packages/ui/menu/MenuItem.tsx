import { ExtractProps } from '../types'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { FC, forwardRef } from 'react'
import classNames from 'classnames'

export type MenuItem = ExtractProps<typeof HeadlessMenu.Item> & {
  className?: string
}

export const MenuItem: FC<MenuItem> = forwardRef<HTMLDivElement, MenuItem>(({ className, children, ...props }, ref) => {
  return (
    <HeadlessMenu.Item
      {...props}
      ref={ref}
      as="div"
      className={({ active }: { active: boolean; selected: boolean }) =>
        classNames(
          active ? 'text-white bg-blue-500' : 'text-high-emphesis',
          'font-bold text-sm cursor-pointer select-none relative py-2 pl-4 pr-9 my-1 mx-1 rounded-xl',
          className,
        )
      }
    >
      {children}
    </HeadlessMenu.Item>
  )
})
