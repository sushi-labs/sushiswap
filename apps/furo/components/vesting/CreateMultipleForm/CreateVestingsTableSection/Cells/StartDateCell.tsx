import { classNames, Input } from '@sushiswap/ui'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleVestingFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const StartDateCell: FC<CellProps> = ({ index }) => {
  const { control } = useFormContext<CreateMultipleVestingFormSchemaType>()

  return (
    <Controller
      control={control}
      name={`vestings.${index}.startDate`}
      render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
        return (
          <Input.DatetimeLocal
            name={name}
            min={new Date(Date.now() + 5 * 60 * 1000)?.toISOString().slice(0, 16)}
            onBlur={onBlur}
            variant="unstyled"
            className={classNames(
              error?.message ? ' !border-red' : 'border-transparent border-none',
              'border-0 !border-b-[1px]',
              'py-2 without-ring !bg-transparent !px-0 truncate text-sm border-0'
            )}
            value={value?.toISOString().slice(0, 16) || ''}
            onChange={(value) => onChange(new Date(value))}
            error={!!error?.message}
          />
        )
      }}
    />
  )
}
