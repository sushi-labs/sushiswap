import { type VariantProps } from 'class-variance-authority'
import { FC } from 'react'
import { default as ReactDatePicker, ReactDatePickerProps } from 'react-datepicker'

import { textFieldVariants } from './text-field'

interface DateFieldProps extends ReactDatePickerProps, VariantProps<typeof textFieldVariants> {
  testId?: string
}

export const DateField: FC<DateFieldProps> = ({ testId, className, variant, ...props }) => {
  return (
    <ReactDatePicker
      {...props}
      wrapperClassName="w-full"
      customInput={<input testdata-id={testId} className={textFieldVariants({ variant, className })} />}
    />
  )
}
