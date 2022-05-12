import React, { FC, forwardRef } from 'react'
import classNames from 'classnames'
import { DEFAULT_INPUT_CLASSNAME } from './index'

export type AddressProps = Omit<React.HTMLProps<HTMLInputElement> | 'ref' | 'as' | 'onChange'> & {
  value: string
  onChange(x: string): void
}

const matchSpaces = /\s+/g

export const Address: FC<AddressProps> = forwardRef(
  (
    { value, onChange, placeholder = 'Address or ENS name', title = 'Address or ENS name', className = '', ...rest },
    ref,
  ) => {
    return (
      <>
        <input
          ref={ref}
          title={title}
          placeholder={placeholder}
          value={value}
          type="text"
          className={classNames(DEFAULT_INPUT_CLASSNAME, className)}
          onChange={(event) => onChange && onChange(event.target.value.replace(matchSpaces, ''))}
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          pattern="^(0x[a-fA-F0-9]{40})$"
          {...rest}
        />
      </>
    )
  },
)

export default Address
