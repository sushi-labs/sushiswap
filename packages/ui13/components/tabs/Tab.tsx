import { Tab as HeadlessTab } from '@headlessui/react'
import classNames from 'classnames'
import React, { FC, forwardRef, Fragment, FunctionComponent } from 'react'

import { ExtractProps } from '../../types'
import { TabGroup, TabGroupProps } from './TabGroup'
import { TabList, TabListProps } from './TabList'

export type TabButton = ExtractProps<typeof HeadlessTab>

const _Tab: React.ForwardRefExoticComponent<React.PropsWithoutRef<TabButton> & React.RefAttributes<HTMLButtonElement>> =
  forwardRef<HTMLButtonElement, TabButton>(function _Tab({ children, className, ...props }, ref) {
    return (
      // @ts-ignore
      <HeadlessTab as={Fragment} ref={ref}>
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
            {/* @ts-ignore*/}
            {children}
          </button>
        )}
      </HeadlessTab>
    )
  })

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
