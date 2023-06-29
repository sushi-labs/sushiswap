import React, { ForwardedRef, forwardRef } from 'react'
import { Text, TextInput } from './Text'

type DatePickerCustomInput = Omit<TextInput, 'value' | 'onChange' | 'testdata-id'>

function Component(props: DatePickerCustomInput, ref: ForwardedRef<HTMLInputElement>) {
  return <Text {...props} ref={ref} onChange={() => {}} />
}

export const DatePickerCustomInput = forwardRef(Component)
