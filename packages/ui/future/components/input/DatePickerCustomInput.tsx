import React from 'react'
import { classNames } from '../../../index'

interface DatePickerWrapper<T> {
  id: string
  label: string
  caption?: string
  value?: T
}

export const DatePickerCustomInput = <T extends string | number>({
  caption,
  id,
  label,
  ...rest
}: DatePickerWrapper<T>) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          {...rest}
          type="text"
          id="stream-update-end-date"
          className={classNames(
            'truncate font-medium block rounded-xl px-4 pb-2 pt-[22px] pr-14 w-full text-gray-900 bg-gray-200 dark:bg-slate-200/[0.04] border-0 appearance-none dark:text-slate-50 focus:outline-none focus:ring-0 peer'
          )}
          placeholder=" "
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
          testdata-id={id}
        />
        <label
          htmlFor="stream-update-end-date"
          className="font-medium peer-focus:font-normal absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-[15px] scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[15px]"
        >
          {label}
        </label>
      </div>
      {caption && <span className="inline-block px-4 text-xs text-gray-500">{caption}</span>}
    </div>
  )
}
