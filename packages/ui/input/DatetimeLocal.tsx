import classNames from 'classnames'
import React, { FC, forwardRef } from 'react'

import { DEFAULT_INPUT_CLASSNAME } from './index'

export type DatetimeLocalProps = Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as' | 'onChange'> & {
  value: string
  onChange(x: string): void
}

export const Address: FC<DatetimeLocalProps> = forwardRef<HTMLInputElement, DatetimeLocalProps>(
  ({ value, onChange, className, ...rest }, ref) => {
    return (
      <>
        <input
          ref={ref}
          type="datetime-local"
          className={classNames(DEFAULT_INPUT_CLASSNAME, className)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      </>
    )
  },
)

export default Address
