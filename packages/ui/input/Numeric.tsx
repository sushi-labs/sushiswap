import classNames from 'classnames'
import React, { FC, forwardRef } from 'react'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const defaultClassName = 'w-0 p-0 text-2xl bg-transparent'

export type NumericProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'as'> & {
  onUserInput?: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
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
        {...rest}
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
        className={classNames(
          'flex-auto w-full px-0 py-3 overflow-hidden bg-transparent border-none shadow-none outline-none focus:ring-0 overflow-ellipsis disabled:cursor-not-allowed placeholder-slate-500 focus:placeholder-slate-400',
          className
        )}
      />
    )
  }
)

export default Input
