import { ComponentProps, FC } from 'react'

import { DatePicker } from './DatePicker'
import { DatePickerCustomInput } from './DatePickerCustomInput'
import { Numeric } from './Numeric'
import { Percent } from './Percent'
import { Select } from './Select'
import { Text } from './Text'

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
