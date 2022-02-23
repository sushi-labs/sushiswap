import { ExtractProps } from '../types'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { FC, forwardRef } from 'react'

export type MenuItem = ExtractProps<typeof HeadlessMenu.Item> & {
  className?: string
}

export const MenuItem: FC<MenuItem> = forwardRef<HTMLDivElement, MenuItem>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className="py-1">
      <HeadlessMenu.Item {...props}>{children}</HeadlessMenu.Item>
    </div>
  )
})
