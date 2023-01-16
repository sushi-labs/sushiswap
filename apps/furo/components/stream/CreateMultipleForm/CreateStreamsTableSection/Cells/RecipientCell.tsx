import { classNames } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const RecipientCell: FC<CellProps> = ({ index }) => {
  const { control } = useFormContext<CreateMultipleStreamFormSchemaType>()

  return (
    <Controller
      control={control}
      name={`streams.${index}.recipient`}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <Web3Input.Ens
          variant="unstyled"
          onBlur={onBlur}
          id={`recipient-${index}`}
          value={value}
          onChange={onChange}
          error={!!error?.message}
          placeholder="0x..."
          className={classNames(
            error?.message ? ' !border-red' : 'border-transparent border-none',
            'border-0 !border-b-[1px] py-2 flex items-center',
            'without-ring h-[37px]'
          )}
          inputClassName={classNames('')}
        />
      )}
    />
  )
}
