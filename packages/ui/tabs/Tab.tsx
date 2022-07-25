import { Tab as HeadlessTab } from '@headlessui/react'
import classNames from 'classnames'
import React, { FC, forwardRef, Fragment, FunctionComponent } from 'react'

import { Button } from '../button'
import { ExtractProps } from '../types'
import { TabGroup, TabGroupProps } from './TabGroup'
import { TabList, TabListProps } from './TabList'

export type TabButton = ExtractProps<typeof HeadlessTab>

const _Tab: React.ForwardRefExoticComponent<React.PropsWithoutRef<TabButton> & React.RefAttributes<HTMLButtonElement>> =
  forwardRef<HTMLButtonElement, TabButton>(({ children, className, ...props }, ref) => {
    return (
      // @ts-ignore
      <HeadlessTab as={Fragment} ref={ref}>
        {({ selected }) => (
          <Button
            {...props}
            size="sm"
            className={classNames('hover:ring-0 focus:ring-0', className)}
            color="gray"
            variant={selected ? 'filled' : 'empty'}
          >
            {/* @ts-ignore*/}
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
