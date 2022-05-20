import classNames from 'classnames'
import React, { FC, forwardRef } from 'react'

import { DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME } from './index'

export type DatetimeLocalProps = Omit<React.HTMLProps<HTMLInputElement> | 'ref' | 'as' | 'onChange'> & {
  error: boolean
  value: string
  onChange(x: string): void
}

export const DatetimeLocal: FC<DatetimeLocalProps> = forwardRef(
  ({ value, onChange, className, error, ...rest }, ref) => {
    return (
      <>
        <input
          ref={ref}
          type="datetime-local"
          className={classNames(DEFAULT_INPUT_CLASSNAME, error ? ERROR_INPUT_CLASSNAME : '', className)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      </>
    )
  },
)
