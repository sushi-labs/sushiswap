import { classNames, Input } from '@sushiswap/ui'
import React, { FC, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const EndDateCell: FC<CellProps> = ({ index }) => {
  const { control, watch, setError, clearErrors } = useFormContext<CreateMultipleStreamFormSchemaType>()
  const [startDate, endDate] = watch([`streams.${index}.dates.startDate`, `streams.${index}.dates.endDate`])

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      setError(`streams.${index}.dates.endDate`, { type: 'custom', message: 'Must be later than start date' })
    } else {
      clearErrors(`streams.${index}.dates.endDate`)
    }
  }, [clearErrors, endDate, index, setError, startDate])

  return (
    <Controller
      control={control}
      name={`streams.${index}.dates.endDate`}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <Input.DatetimeLocal
          min={
            startDate
              ? new Date(startDate.getTime() + 5 * 60 * 1000)?.toISOString().slice(0, 16)
              : new Date(Date.now() + 10 * 60 * 1000)?.toISOString().slice(0, 16)
          }
          onBlur={onBlur}
          variant="unstyled"
          className={classNames(
            error?.message ? ' !border-red' : 'border-transparent border-none',
            'border-0 !border-b-[1px] py-2 flex items-center',
            'without-ring !bg-transparent !px-0 truncate text-sm'
          )}
          value={value?.toISOString().slice(0, 16) || ''}
          onChange={(value) => onChange(new Date(value))}
          error={!!error?.message}
        />
      )}
    />
  )
}
