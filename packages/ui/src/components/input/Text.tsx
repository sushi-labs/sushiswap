import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon'
import classNames from 'classnames'
import React, { ForwardedRef, forwardRef, HTMLProps, ReactNode, useCallback } from 'react'

export interface TextInput extends Omit<HTMLProps<HTMLInputElement>, 'label' | 'onChange' | 'id' | 'testdata-id'> {
  label: ReactNode
  id: string
  value?: string | number
  onChange?(val: string | number | undefined): void
  className?: string
  customButton?: ReactNode
  hideCloseButton?: boolean
}

function Component(
  { label, value, onChange, id, customButton, className = '', hideCloseButton, ...props }: TextInput,
  ref: ForwardedRef<HTMLInputElement>
) {
  const _onChange = useCallback(
    (e: string | number | undefined) => {
      if (onChange) {
        onChange(e)
      }
    },
    [onChange]
  )

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          {...props}
          ref={ref}
          type="text"
          id={id}
          value={value}
          onChange={(e) => _onChange(e.target.value)}
          className={classNames(
            className,
            'truncate font-medium block rounded-xl px-4 pb-2 pt-[22px] pr-14 w-full text-gray-900 bg-secondary hover:bg-muted focus:bg-accent border-0 appearance-none dark:text-slate-50 focus:outline-none focus:ring-0 peer'
          )}
          placeholder=" "
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
        />
        <label
          htmlFor={id}
          className="pointer-events-none font-medium peer-focus:font-normal absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-[15px] scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[15px]"
        >
          {label}
        </label>
        {value !== '' && !hideCloseButton && (
          <div className="absolute top-0 bottom-0 flex items-center justify-center right-4">
            {customButton ? (
              customButton
            ) : (
              <div
                role="button"
                onClick={() => onChange && onChange('')}
                className="bg-black/[0.05] dark:bg-white/[0.08] hover:dark:bg-white/[0.16] hover:bg-gray-300 rounded-full p-0.5"
              >
                <XMarkIcon width={20} height={20} className="text-gray-600 dark:text-slate-400" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const Text = forwardRef(Component)
