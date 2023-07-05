import { Tab as HeadlessTab } from '@headlessui/react'
import classNames from 'classnames'
import React, { FC, forwardRef, Fragment, FunctionComponent, ReactNode } from 'react'

import { ExtractProps } from '../../types'
import { Button } from '../button'
import { TabGroup, TabGroupProps } from './TabGroup'
import { TabList, TabListProps } from './TabList'

export type TabButton = Omit<ExtractProps<typeof HeadlessTab>, 'children'> & { children: ReactNode }

const _Tab: FC<TabButton> = forwardRef<HTMLButtonElement, TabButton>(function _Tab(
  { children, className, ...props },
  ref
) {
  return (
    <HeadlessTab as={Fragment}>
      {({ selected }) => (
        <Button
          ref={ref}
          variant="secondary"
          className={classNames(
            selected
              ? 'text-gray-900 dark:text-slate-50 bg-white dark:bg-slate-700'
              : 'text-gray-500 dark:text-slate-500 hover:bg-gray-100 hover:dark:bg-white/[0.04]',
            'z-[1] relative rounded-lg text-sm h-8 font-medium flex flex-grow items-center justify-center',
            className
          )}
          {...props}
        >
          {children}
        </Button>
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
