import React, { ForwardedRef, forwardRef } from 'react'
import { escapeRegExp, inputRegex } from './utils'
import { TextInput, Text } from './Text'

interface NumericInput extends Omit<TextInput, 'onChange'> {
  variant?: 'default' | 'unstyled'
  onUserInput?: (input: string) => void
  maxDecimals?: number
}

function Component({ onUserInput, variant = 'default', ...props }: NumericInput, ref: ForwardedRef<HTMLInputElement>) {
  const enforcer = (nextUserInput: string | number | undefined) => {
    if (typeof nextUserInput === 'undefined') return
    const val = `${nextUserInput}`.replace(/,/g, '.')
    if (onUserInput && val === '') onUserInput('')
    if (inputRegex.test(escapeRegExp(val))) {
      if (onUserInput) {
        if (props.maxDecimals && val?.includes('.')) {
          const [, decimals] = val.split('.')
          if (decimals.length <= props.maxDecimals) {
            onUserInput(val)
          }
        } else {
          onUserInput(val)
        }
      }
    }
  }

  if (variant === 'unstyled') {
    return <input {...props} ref={ref} onChange={(e) => enforcer(e.target.value)} />
  }

  return <Text {...props} ref={ref} onChange={(val) => enforcer(val)} />
}

export const Numeric = forwardRef(Component)
