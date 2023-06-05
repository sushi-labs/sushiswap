import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateMultipleVestingFormSchemaType } from '../../schema'
import { CellProps } from './types'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'

export const RecipientCell: FC<CellProps> = ({ index }) => {
  const { control } = useFormContext<CreateMultipleVestingFormSchemaType>()

  return (
    <Controller
      control={control}
      name={`vestings.${index}.recipient`}
      render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
        return (
          <Web3Input.Ens
            isError={Boolean(error?.message)}
            caption={error?.message}
            label={
              <>
                Address or ENS<sup>*</sup>
              </>
            }
            name={name}
            onBlur={onBlur}
            id="create-stream-recipient-input"
            value={value}
            onChange={onChange}
          />
        )
      }}
    />
  )
}
