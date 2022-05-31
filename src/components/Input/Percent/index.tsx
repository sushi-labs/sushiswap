import { classNames, escapeRegExp } from 'app/functions'
import React from 'react'

const inputRegex = RegExp(`^\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(
  ({
    value,
    onUserInput,
    placeholder,
    className,
    align,
    fontSize,
    ...rest
  }: {
    value: string | number
    onUserInput: (input: string) => void
    error?: boolean
    fontSize?: string
    align?: 'right' | 'left'
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        if (Number(nextUserInput) <= 100) {
          onUserInput(nextUserInput)
        }
      }
    }

    return (
      <>
        <input
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
          className={classNames(
            align === 'right' && 'text-right',
            'relative font-bold outline-none border-none flex-auto overflow-hidden overflow-ellipsis placeholder-low-emphesis focus:placeholder-primary',
            className
          )}
          style={{ fontSize }}
          {...rest}
        />
      </>
    )
  }
)

Input.displayName = 'PercentInput'

export default Input
