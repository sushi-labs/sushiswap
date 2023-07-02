import React, { ForwardedRef, forwardRef } from 'react'

import { Text, TextInput } from './Text'
import { escapeRegExp, inputRegex } from './utils'

interface NumericInput extends Omit<TextInput, 'onChange'> {
  variant?: 'default' | 'unstyled'
  onUserInput?: (input: string) => void
  maxDecimals?: number
}

function Component(
  { onUserInput, variant = 'default', maxDecimals, ...props }: NumericInput,
  ref: ForwardedRef<HTMLInputElement>
) {
  const enforcer = (nextUserInput: string | number | undefined) => {
    if (typeof nextUserInput === 'undefined') return
    const val = `${nextUserInput}`.replace(/,/g, '.')
    if (onUserInput && val === '') onUserInput('')
    if (inputRegex.test(escapeRegExp(val))) {
      if (onUserInput) {
        if (maxDecimals && val?.includes('.')) {
          const [, decimals] = val.split('.')
          if (decimals.length <= maxDecimals) {
            onUserInput(val)
          }
        } else {
          onUserInput(val)
        }
      }
    }
  }

  if (variant === 'unstyled') {
    return (
      <input
        {...props}
        placeholder="0.0"
        ref={ref}
        onChange={(e) => enforcer(e.target.value)}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        autoComplete="off"
      />
    )
  }

  return <Text {...props} placeholder="0.0" ref={ref} onChange={(val) => enforcer(val)} />
}

export const Numeric = forwardRef(Component)
