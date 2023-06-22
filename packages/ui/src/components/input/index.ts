import { DatePickerCustomInput } from './DatePickerCustomInput'
import { Numeric } from './Numeric'
import { Text } from './Text'
import { DatePicker } from './DatePicker'
import { Select } from './Select'
import { ComponentProps, FC } from 'react'
import { Percent } from './Percent'

export const Input: {
  DatePicker: typeof DatePicker
  DatePickerCustomInput: FC<ComponentProps<typeof DatePickerCustomInput>>
  Numeric: FC<ComponentProps<typeof Numeric>>
  Text: FC<ComponentProps<typeof Text>>
  Select: FC<ComponentProps<typeof Select>>
  Percent: FC<ComponentProps<typeof Percent>>
} = {
  DatePicker,
  DatePickerCustomInput,
  Numeric,
  Text,
  Select,
  Percent,
}
