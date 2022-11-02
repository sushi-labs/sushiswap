import { classNames, Input } from '@sushiswap/ui'
import { format } from 'date-fns'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const StartDateCell: FC<CellProps> = ({ index }) => {
  const { control } = useFormContext<CreateMultipleStreamFormSchemaType>()

  return (
    <Controller
      control={control}
      name={`streams.${index}.dates.startDate`}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <Input.DatetimeLocal
          min={new Date(Date.now() + 5 * 60 * 1000)?.toISOString().slice(0, 16)}
          onBlur={onBlur}
          variant="unstyled"
          className={classNames(
            error?.message ? ' !border-red' : 'border-transparent border-none',
            'border-0 !border-b-[1px] py-2 flex items-center',
            'without-ring !bg-transparent !px-0 truncate text-sm'
          )}
          value={value ? format(value, "yyyy-MM-dd'T'HH:mm") : ''}
          onChange={(value) => onChange(new Date(value))}
          error={!!error?.message}
        />
      )}
    />
  )
}
