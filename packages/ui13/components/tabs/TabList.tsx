import { Tab as HeadlessTab } from '@headlessui/react'
import classNames from 'classnames'
import { Children, FC, useLayoutEffect, useRef, useState } from 'react'

import { ExtractProps } from '../../types'

export type TabListProps = ExtractProps<typeof HeadlessTab.List> & {
  islandClassName?: string
}

export const TabList: FC<TabListProps> = ({ className, children, islandClassName, ...props }) => {
  const [width, setWidth] = useState<number>()
  const ref = useRef<HTMLDivElement>()
  const tabs = Children.count(children)

  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth)
    }
  }, [])

  return (
    <HeadlessTab.List
      ref={ref}
      {...props}
      className={classNames(
        'relative bg-gray-200 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-900 rounded-xl overflow-hidden grid grid-flow-col',
        className
      )}
    >
      {({ selectedIndex }) => (
        <>
          {children}
          {tabs && width && (
            <span
              className={classNames(
                islandClassName,
                'z-[0] rounded-lg transition-all bg-white dark:!bg-slate-700 absolute pointer-events-none top-0 bottom-0'
              )}
              style={{ transform: `translateX(${(width / tabs) * selectedIndex}px)`, width: width / tabs }}
            />
          )}
        </>
      )}
    </HeadlessTab.List>
  )
}
