import { Tab as HeadlessTab } from '@headlessui/react'
import classNames from 'classnames'
import { FC, forwardRef } from 'react'

import { ExtractProps } from '../types'

export type TabListProps = ExtractProps<typeof HeadlessTab.List>

export const TabList: FC<TabListProps> = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <HeadlessTab.List
        {...props}
        ref={ref}
        className={classNames(
          'bg-slate-900 border-2 border-slate-900 rounded-xl overflow-hidden grid grid-flow-col',
          className
        )}
      >
        {children}
      </HeadlessTab.List>
    )
  }
)
