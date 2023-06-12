import { Tab as HeadlessTab } from '@headlessui/react'
import classNames from 'classnames'
import React, { FC } from 'react'
import { ExtractProps } from '../../../types'

export type TabListProps = ExtractProps<typeof HeadlessTab.List>

export const TabList: FC<TabListProps> = ({ className, children, ...props }) => {
  return (
    <HeadlessTab.List
      {...props}
      className={classNames(
        'relative bg-black/[0.08] dark:bg-white/[0.04] ring-4 ring-black/[0.08] dark:ring-white/[0.04] rounded-lg overflow-hidden flex gap-1',
        className
      )}
    >
      {children}
    </HeadlessTab.List>
  )
}
