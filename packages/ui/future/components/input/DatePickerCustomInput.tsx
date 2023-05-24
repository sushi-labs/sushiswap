import React, { ForwardedRef, forwardRef } from 'react'
import { Text, TextInput } from './Text'

type DatePickerCustomInput = Omit<TextInput, 'value'>

function Component(props: DatePickerCustomInput, ref: ForwardedRef<HTMLInputElement>) {
  return <Text {...props} ref={ref} hideCloseButton />
}

export const DatePickerCustomInput = forwardRef(Component)
