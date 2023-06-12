import classNames from 'classnames'
import React, { forwardRef } from 'react'

import { DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME } from './index'
import { escapeRegExp, inputRegex } from './utils'

const defaultClassName = 'w-0 p-0 text-2xl bg-transparent'

export type NumericProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'as'> & {
  onUserInput?: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
  variant?: 'default' | 'unstyled'
}

export const Input = forwardRef<HTMLInputElement, NumericProps>(
  (
    {
      value,
      onUserInput,
      placeholder = '0',
      className = defaultClassName,
      title = 'Token Amount',
      inputMode = 'decimal',
      type = 'text',
      pattern = '^[0-9]*[.,]?[0-9]*$',
      min = 0,
      minLength = 1,
      maxLength = 79,
      variant = 'default',
      error,
      ...rest
    },
    ref
  ) => {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        if (onUserInput) {
          onUserInput(nextUserInput)
        }
      }
    }

    return (
      <input
        ref={ref}
        value={value}
        onChange={(event) => {
          // replace commas with periods, because uniswap exclusively uses period as the decimal separator
          enforcer(event.target.value.replace(/,/g, '.'))
        }}
        // universal input options
        inputMode={inputMode}
        title={title}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        // text-specific options
        type={type}
        pattern={pattern}
        placeholder={placeholder}
        min={min}
        minLength={minLength}
        maxLength={maxLength}
        className={
          variant === 'default'
            ? classNames(DEFAULT_INPUT_CLASSNAME, error ? ERROR_INPUT_CLASSNAME : '', className)
            : className
        }
        {...rest}
      />
    )
  }
)

export default Input
