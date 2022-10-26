import { Input } from '@sushiswap/ui'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleStreamBaseSchemaType } from '../../schema'
import { CellProps } from './types'

export const StartDateCell: FC<CellProps> = ({ index }) => {
  const { control } = useFormContext<CreateMultipleStreamBaseSchemaType>()

  return (
    <Controller
      control={control}
      name={`streams.${index}.dates.startDate`}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <Input.DatetimeLocal
          onBlur={onBlur}
          variant="unstyled"
          className="without-ring !bg-transparent !px-0 truncate border-none text-sm"
          value={value?.toISOString().slice(0, 16) || ''}
          onChange={(value) => onChange(new Date(value))}
          error={!!error?.message}
        />
      )}
    />
  )
}
