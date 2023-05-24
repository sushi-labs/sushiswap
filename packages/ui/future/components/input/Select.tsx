import React, { ForwardedRef, forwardRef } from 'react'
import { TextInput, Text } from './Text'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

interface SelectProps extends Omit<TextInput, 'onChange'> {
  onClick(): void
}

function Component({ onClick, ...props }: SelectProps, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <div role="button" onClick={onClick} className="relative">
      <Text
        {...props}
        role="button"
        ref={ref}
        onChange={() => {}}
        className={classNames(props.className, 'pointer-events-none')}
        hideCloseButton
      />
      <div className="absolute top-0 bottom-0 flex items-center justify-center right-4">
        <div
          onClick={onClick}
          role="button"
          className="bg-black/[0.05] dark:bg-white/[0.08] hover:dark:bg-white/[0.16] hover:bg-gray-300 rounded-full p-0.5"
        >
          <ChevronUpDownIcon width={20} height={20} className="text-gray-600 dark:text-slate-400" />
        </div>
      </div>
    </div>
  )
}

export const Select = forwardRef(Component)
