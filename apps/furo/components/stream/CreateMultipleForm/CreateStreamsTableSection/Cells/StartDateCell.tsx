import { classNames } from '@sushiswap/ui'
import { DatePicker } from '@sushiswap/ui/input/DatePicker'
import React, { FC, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'

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
          minDate={new Date(Date.now() + 5 * 60 * 1000)}
          dateFormat="MMM d, yyyy HH:mm"
          placeholderText="Select date"
          autoComplete="off"
        />
      )}
    />
  )
}
