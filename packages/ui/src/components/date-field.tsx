'use client'

import type { VariantProps } from 'class-variance-authority'
import { type FC, useState } from 'react'
import {
  default as ReactDatePicker,
  type DatePickerProps as ReactDatePickerProps,
} from 'react-datepicker'

import { CalendarIcon } from '../icons/CalendarIcon'
import { textFieldVariants } from './text-field'

type DateFieldProps = ReactDatePickerProps &
  VariantProps<typeof textFieldVariants> & {
    testId?: string
  }

const DateField: FC<DateFieldProps> = ({
  testId,
  className,
  variant,
  ...props
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative w-full">
      <ReactDatePicker
        open={open}
        onCalendarOpen={() => setOpen(true)}
        onCalendarClose={() => setOpen(false)}
        onClickOutside={() => setOpen(false)}
        wrapperClassName="w-full"
        customInput={
          <input
            testdata-id={testId}
            className={textFieldVariants({ variant, className })}
          />
        }
        {...props}
      />
      {variant !== 'naked' ? (
        <div
          onClick={() => setOpen((open) => !open)}
          onKeyDown={() => setOpen((open) => !open)}
          className="cursor-pointer absolute right-3 top-0 bottom-0 flex items-center"
        >
          <CalendarIcon
            width={20}
            height={20}
            className="text-muted-foreground mt-[-1.5px]"
          />
        </div>
      ) : null}
    </div>
  )
}

export { DateField }
