import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React, { ForwardedRef, forwardRef } from 'react'

import { Text, TextInput } from './Text'

interface SelectProps extends Omit<TextInput, 'onChange'> {
  onClick?(): void
}

function Component({ onClick, ...props }: SelectProps, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <div role="button" onClick={onClick}>
      <Text
        {...props}
        role="button"
        ref={ref}
        customButton={
          <div
            role="button"
            className="bg-black/[0.05] dark:bg-white/[0.08] hover:dark:bg-white/[0.16] hover:bg-gray-300 rounded-full p-0.5"
          >
            <ChevronUpDownIcon width={20} height={20} className="text-gray-600 dark:text-slate-400" />
          </div>
        }
        className={classNames(props.className, 'pointer-events-none')}
      />
    </div>
  )
}

export const Select = forwardRef(Component)
