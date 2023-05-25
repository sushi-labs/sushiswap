import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon'
import React, { useCallback } from 'react'
import classNames from 'classnames'

interface TextInput<T> {
  label: string
  value: T
  onChange(val: T): void
  id: string
  caption?: string
  className?: string
  hideCloseButton?: boolean
}

export function Text<T extends string | number>({
  label,
  value,
  onChange,
  id,
  caption,
  hideCloseButton = false,
  className = '',
}: TextInput<T>) {
  const _onChange = useCallback(
    (e: T) => {
      onChange(e)
    },
    [onChange]
  )

  return (
    <div className="space-y-1 w-full">
      <div className="relative w-full">
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => _onChange(e.target.value as T)}
          className={classNames(
            className,
            'truncate font-medium block rounded-xl px-4 pb-2 pt-[22px] pr-14 w-full text-gray-900 bg-gray-200 dark:bg-slate-800 border-0 appearance-none dark:text-slate-50 focus:outline-none focus:ring-0 peer'
          )}
          placeholder=" "
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
          testdata-id={id}
        />
        <label
          htmlFor={id}
          className="font-medium peer-focus:font-normal absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-[15px] scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[15px]"
        >
          {label}
        </label>
        {value !== '' && !hideCloseButton && (
          <div className="absolute top-0 bottom-0 flex items-center justify-center right-4">
            <button
              onClick={() => onChange('' as T)}
              className="bg-black/[0.05] dark:bg-white/[0.08] hover:dark:bg-white/[0.16] hover:bg-gray-300 rounded-full p-0.5"
            >
              <XMarkIcon width={20} height={20} className="text-gray-600 dark:text-slate-400" />
            </button>
          </div>
        )}
      </div>
      {caption && <span className="inline-block px-4 text-xs text-gray-500">{caption}</span>}
    </div>
  )
}
