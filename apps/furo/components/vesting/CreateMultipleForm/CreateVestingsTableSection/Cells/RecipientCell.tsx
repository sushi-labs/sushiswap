import { classNames } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleVestingFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const RecipientCell: FC<CellProps> = ({ index }) => {
  const { control } = useFormContext<CreateMultipleVestingFormSchemaType>()

  return (
    <Controller
      control={control}
      name={`vestings.${index}.recipient`}
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
            'without-ring py-2',
            error?.message ? ' !border-red' : 'border-transparent border-none',
            'border-0 !border-b-[1px] h-[37px]'
          )}
          inputClassName={classNames('')}
        />
      )}
    />
  )
}
