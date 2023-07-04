import React, { ForwardedRef, forwardRef } from 'react'

import { Text, TextInput } from './Text'

type DatePickerCustomInput = Omit<TextInput, 'value' | 'onChange' | 'testdata-id'>

export const DatePickerCustomInput = forwardRef(function Component(
  props: DatePickerCustomInput,
  ref: ForwardedRef<HTMLInputElement>
) {
  return <Text {...props} ref={ref} onChange={() => {}} />
})
