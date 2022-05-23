import { Menu as HeadlessMenu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import React, { FC, forwardRef, ReactNode } from 'react'

import { ExtractProps } from '../types'
import { Typography } from '../typography/Typography'

export type MenuButton = ExtractProps<typeof HeadlessMenu.Button> & {
  children?: ReactNode
  standalone?: boolean
}

export const MenuButton: FC<MenuButton> = forwardRef(({ className, children, standalone, ...props }, ref) => {
  return React.createElement(
    standalone ? 'div' : HeadlessMenu.Button,
    {
      ...props,
      ref,
      className: classNames(
        'relative w-full cursor-pointer rounded-xl bg-slate-900 hover:bg-slate-800 focus:bg-slate-800 py-3 pl-4 pr-10 text-left shadow-md ring-1 ring-slate-900/10',
        className
      ),
    },
    <>
      <Typography
        variant="sm"
        weight={children ? 700 : 400}
        className={classNames(children ? '' : 'text-slate-600', 'block truncate')}
      >
        {children}
      </Typography>
      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
      </span>
    </>
  )
})
