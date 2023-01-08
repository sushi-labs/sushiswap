import { Tab as HeadlessTab } from '@headlessui/react'
import classNames from 'classnames'
import React, { FC, Fragment, FunctionComponent, ReactNode } from 'react'

import { ExtractProps } from '../../types'
import { TabGroup, TabGroupProps } from './TabGroup'
import { TabList, TabListProps } from './TabList'

export type TabButton = Omit<ExtractProps<typeof HeadlessTab>, 'children'> & { children: ReactNode }

const _Tab: FC<TabButton> = ({ children, className, ...props }) => {
  return (
    <HeadlessTab as={Fragment}>
      {({ selected }) => (
        <button
          color="default"
          className={classNames(
            selected ? 'text-gray-900 dark:text-slate-50' : 'text-gray-500 dark:text-slate-500',
            'z-[1] relative rounded-lg text-sm h-[28px] font-medium',
            className
          )}
          {...props}
        >
          {children}
        </button>
      )}
    </HeadlessTab>
  )
}

export const Tab: FunctionComponent<TabButton> & {
  Group: FC<TabGroupProps>
  List: FC<TabListProps>
  Panels: FC<ExtractProps<typeof HeadlessTab.Panels>>
  Panel: FC<ExtractProps<typeof HeadlessTab.Panel>>
} = Object.assign(_Tab, {
  Group: TabGroup,
  List: TabList,
  Panels: HeadlessTab.Panels,
  Panel: HeadlessTab.Panel,
})
