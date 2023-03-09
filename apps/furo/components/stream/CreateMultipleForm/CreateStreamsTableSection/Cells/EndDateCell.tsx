import { classNames } from '@sushiswap/ui'
import { DatePicker } from '@sushiswap/ui/input/DatePicker'
import React, { FC, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const EndDateCell: FC<CellProps> = ({ index }) => {
  const { control, watch, setError, clearErrors } = useFormContext<CreateMultipleStreamFormSchemaType>()
  const [startDate, endDate] = watch([`streams.${index}.dates.startDate`, `streams.${index}.dates.endDate`])

  // Temporary solution for when Zod fixes conditional validation
  // https://github.com/colinhacks/zod/issues/1394
  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      setError(`streams.${index}.dates.endDate`, {
        type: 'custom',
        message: 'Must be later than start date',
      })
    } else {
      clearErrors(`streams.${index}.dates.endDate`)
    }
  }, [clearErrors, endDate, index, setError, startDate])

  return (
    <Controller
      control={control}
      name={`streams.${index}.dates.endDate`}
      render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => (
        <DatePicker
          name={name}
          onBlur={onBlur}
          className={classNames(
            error?.message ? ' !border-red' : 'border-transparent border-none',
            'border-0 !border-b-[1px]',
            'py-2 without-ring !bg-transparent !px-0 truncate text-sm border-0 font-medium'
          )}
          onChange={onChange}
          selected={value}
          portalId="root-portal"
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          minDate={startDate ? new Date(startDate.getTime() + 5 * 60 * 1000) : new Date(Date.now() + 10 * 60 * 1000)}
          dateFormat="MMM d, yyyy HH:mm"
          placeholderText="Select date"
          autoComplete="off"
        />
      )}
    />
  )
}
