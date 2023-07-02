import React, { forwardRef } from 'react'

import { Text, TextInput } from './Text'
import { escapeRegExp, inputRegex } from './utils'

interface PercentInput extends Omit<TextInput, 'onChange'> {
  variant?: 'default' | 'unstyled'
  onUserInput?: (input: string) => void
}

const Percent = forwardRef<HTMLInputElement, PercentInput>(
  ({ onUserInput, placeholder, variant = 'default', ...props }, ref) => {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        if (onUserInput) {
          onUserInput(nextUserInput)
        }
      }
    }

    if (variant === 'unstyled') {
      return (
        <input
          ref={ref}
          placeholder="100%"
          pattern="^[0-9]*$"
          inputMode="decimal"
          onChange={(event) => {
            // replace commas with periods, because uniswap exclusively uses period as the decimal separator
            enforcer(event.target.value.replace(/,/g, '.').replace(/%/g, ''))
          }}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
          maxLength={3}
          {...props}
        />
      )
    }

    return (
      <Text
        {...props}
        ref={ref}
        pattern="^[0-9]*$"
        placeholder="100%"
        maxLength={3}
        inputMode="decimal"
        onChange={(val) => {
          enforcer(`${val}`?.replace(/,/g, '.').replace(/%/g, ''))
        }}
      />
    )
  }
)

Percent.displayName = 'PercentInput'

export { Percent }
