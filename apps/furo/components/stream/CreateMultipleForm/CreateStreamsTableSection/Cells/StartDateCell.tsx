import React, { FC, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'
import { Input } from '@sushiswap/ui/future/components/input'

export const StartDateCell: FC<CellProps> = ({ index }) => {
  const { control, watch, setError, clearErrors } = useFormContext<CreateMultipleStreamFormSchemaType>()

  const [startDate] = watch([`streams.${index}.dates.startDate`])

  // Temporary solution for when Zod fixes conditional validation
  // https://github.com/colinhacks/zod/issues/1394
  useEffect(() => {
    if (startDate && startDate.getTime() <= new Date(Date.now() + 5 * 60 * 1000).getTime()) {
      setError(`streams.${index}.dates.startDate`, {
        type: 'custom',
        message: 'Must be at least 5 minutes from now',
      })
    } else {
      clearErrors(`streams.${index}.dates.startDate`)
    }
  }, [clearErrors, index, setError, startDate])

  return (
    <Controller
      control={control}
      name={`streams.${index}.dates.startDate`}
      render={({ field: { name, onChange, value, onBlur }, fieldState: { error } }) => {
        return (
          <Input.DatePicker
            name={name}
            onBlur={onBlur}
            customInput={
              <Input.DatePickerCustomInput
                isError={Boolean(error?.message)}
                caption={error?.message}
                testdata-id={'stream-start-date'}
                id="stream-start-date"
                label={
                  <>
                    Start date<sup>*</sup>
                  </>
                }
              />
            }
            onChange={onChange}
            selected={value}
            portalId="root-portal"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            minDate={new Date(Date.now() + 5 * 60 * 1000)}
            dateFormat="MMM d, yyyy HH:mm"
            placeholderText="Select date"
            autoComplete="off"
            testdata-id={'TEST'}
          />
        )
      }}
    />
  )
}
