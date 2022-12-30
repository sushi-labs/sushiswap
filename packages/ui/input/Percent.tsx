import React, { forwardRef } from 'react'

import { classNames } from '../index'
import { DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME } from './index'
import { escapeRegExp, inputRegex } from './utils'

const defaultClassName = 'w-0 p-0 text-2xl bg-transparent'

export type PercentProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'as'> & {
  onUserInput?: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
  variant?: 'default' | 'unstyled'
}

export const Input = forwardRef<HTMLInputElement, PercentProps>(
  ({ value, onUserInput, placeholder, className = defaultClassName, variant = 'default', error, ...rest }, ref) => {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        if (onUserInput) {
          onUserInput(nextUserInput)
        }
      }
    }

    return (
      <>
        <input
          ref={ref}
          value={value}
          onChange={(event) => {
            // replace commas with periods, because uniswap exclusively uses period as the decimal separator
            enforcer(event.target.value.replace(/,/g, '.').replace(/%/g, ''))
          }}
          // universal input options
          inputMode="decimal"
          title="Token Amount"
          autoComplete="off"
          autoCorrect="off"
          // text-specific options
          type="text"
          pattern="^[0-9]*$"
          placeholder={placeholder || '100%'}
          maxLength={3}
          className={
            variant === 'default'
              ? classNames(DEFAULT_INPUT_CLASSNAME, error ? ERROR_INPUT_CLASSNAME : '', className)
              : className
          }
          {...rest}
        />
      </>
    )
  }
)

Input.displayName = 'PercentInput'

export default Input
