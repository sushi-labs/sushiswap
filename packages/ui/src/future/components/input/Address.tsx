import classNames from 'classnames'
import React, { forwardRef } from 'react'

import { DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME } from './index'

export type AddressProps = Omit<React.HTMLProps<HTMLInputElement>, 'as' | 'onChange' | 'value' | 'ref'> & {
  id: string
  error?: boolean
  value: string | undefined
  onChange(x: string): void
  variant?: 'default' | 'unstyled'
}

const matchSpaces = /\s+/g

export const Address = forwardRef<HTMLInputElement, AddressProps>(
  (
    {
      id,
      value = '',
      onChange,
      placeholder = 'Address or ENS name',
      title = 'Address or ENS name',
      className = '',
      error,
      variant = 'default',
      ...rest
    },
    ref
  ) => {
    return (
      <>
        <input
          id={id}
          ref={ref}
          title={title}
          placeholder={placeholder}
          value={value}
          type="search"
          className={
            variant === 'default'
              ? classNames(DEFAULT_INPUT_CLASSNAME, error ? ERROR_INPUT_CLASSNAME : '', className)
              : className
          }
          onChange={(event) => onChange && onChange(event.target.value.replace(matchSpaces, ''))}
          inputMode="search"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="new-password"
          spellCheck="false"
          pattern="^(0x[a-fA-F0-9]{40})$"
          {...rest}
        />
      </>
    )
  }
)
