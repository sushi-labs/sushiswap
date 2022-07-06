import classNames from 'classnames'
import React, { FC, forwardRef, Ref } from 'react'

import { DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME } from './index'

export type DatetimeLocalProps = Omit<React.HTMLProps<HTMLInputElement>, 'as' | 'onChange' | 'value'> & {
  error: boolean
  value: string | undefined
  onChange(x: string): void
  ref?: Ref<HTMLInputElement> | undefined
}

export const DatetimeLocal: FC<DatetimeLocalProps> = forwardRef<HTMLInputElement, DatetimeLocalProps>(
  ({ value, onChange, className, error, ...rest }, ref) => {
    return (
      <>
        <input
          ref={ref}
          type="datetime-local"
          className={classNames(
            DEFAULT_INPUT_CLASSNAME,
            error ? ERROR_INPUT_CLASSNAME : '',
            className,
            'min-w-0 w-full'
          )}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      </>
    )
  }
)
