import { type VariantProps } from 'class-variance-authority'
import { FC } from 'react'
import { default as ReactDatePicker, ReactDatePickerProps } from 'react-datepicker'

import { CalendarIcon } from './icons'
import { textFieldVariants } from './text-field'

interface DateFieldProps extends ReactDatePickerProps, VariantProps<typeof textFieldVariants> {
  testId?: string
}

export const DateField: FC<DateFieldProps> = ({ testId, className, variant, ...props }) => {
  return (
    <div className="relative w-full">
      <ReactDatePicker
        {...props}
        wrapperClassName="w-full"
        customInput={<input testdata-id={testId} className={textFieldVariants({ variant, className })} />}
      />
      {variant !== 'naked' ? (
        <div className="absolute right-3 top-0 bottom-0 flex items-center">
          <CalendarIcon width={20} height={20} className="text-muted-foreground mt-[-1.5px]" />
        </div>
      ) : null}
    </div>
  )
}
