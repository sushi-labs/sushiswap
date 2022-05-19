import { Listbox } from '@headlessui/react'
import { SelectorIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import React, { FC, forwardRef, ReactNode } from 'react'

import { ExtractProps } from '../types'
import { Typography } from '../typography'

export type SelectButtonProps = ExtractProps<typeof Listbox.Button> & {
  children?: ReactNode
  standalone?: boolean
}

const SelectButton: FC<SelectButtonProps> = forwardRef(({ className, children, standalone, ...props }, ref) => {
  return React.createElement(
    standalone ? 'div' : Listbox.Button,
    {
      ...props,
      ref,
      className: classNames(
        'relative w-full cursor-default rounded-xl bg-slate-800 py-3 pl-4 pr-10 text-left shadow-md',
        className,
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
        <SelectorIcon className="w-5 h-5" aria-hidden="true" />
      </span>
    </>,
  )
})

export default SelectButton
