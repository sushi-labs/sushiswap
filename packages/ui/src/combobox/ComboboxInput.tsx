import { Combobox as HeadlessCombobox } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React, { FC, forwardRef } from 'react'

import { ExtractProps } from '../types'
import { Typography } from '../typography/Typography'

export type ComboboxInputProps = ExtractProps<typeof HeadlessCombobox.Input> & {
  children?: string
  standalone?: boolean
}

const ComboboxInput: FC<ComboboxInputProps> = forwardRef(({ className, standalone, children, ...props }, ref) => {
  return React.createElement(
    standalone ? 'div' : HeadlessCombobox.Input,
    {
      ...props,
      ref,
      className: classNames(
        className,
        'relative w-full cursor-default rounded-xl bg-slate-800 py-3 pl-4 pr-10 text-left'
      ),
    },
    <>
      <Typography
        variant="sm"
        weight={children ? 700 : 400}
        className={classNames(children ? '' : 'text-slate-600', 'block truncate')}
      >
        {children || 'Combobox a token'}
      </Typography>
      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronUpDownIcon className="w-5 h-5" aria-hidden="true" />
      </span>
    </>
  )
})

export default ComboboxInput
