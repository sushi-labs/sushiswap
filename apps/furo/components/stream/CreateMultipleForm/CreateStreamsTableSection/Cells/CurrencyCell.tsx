import { ChevronDownIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Native, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames, Form } from '@sushiswap/ui'
import React, { FC, useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useTokenFromZToken } from '../../../../../lib/zod'
import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'
import { Button } from '@sushiswap/ui/future/components/button'
import { Input } from '@sushiswap/ui/future/components/input'

export const CurrencyCell: FC<CellProps> = ({ row, index, chainId = ChainId.ETHEREUM }) => {
  const { control, setValue } = useFormContext<CreateMultipleStreamFormSchemaType>()

  const onSelect = useCallback(
    (onChange: (...event: any[]) => void, currency: Type) => {
      if (currency.isNative) {
        const { chainId, decimals, symbol, name, isNative } = currency
        onChange({
          chainId,
          decimals,
          address: undefined,
          symbol,
          name,
          isNative,
        })
        setValue(`streams.${index}.fundSource`, FundSource.WALLET)
      } else {
        const { chainId, decimals, symbol, name, isNative, wrapped } = currency
        onChange({
          chainId,
          decimals,
          address: wrapped.address,
          symbol,
          name,
          isNative,
        })
      }
    },
    [index, setValue]
  )

  const _currency = useTokenFromZToken(row.currency)

  return (
    <Controller
      control={control}
      name={`streams.${index}.currency`}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <>
          <TokenSelector
            id={'create-single-stream'}
            chainId={chainId}
            onSelect={(currency) => onSelect(onChange, currency)}
            selected={_currency}
          >
            {({ setOpen }) => (
              <Input.Select
                onBlur={onBlur}
                label={
                  <>
                    Token<sup>*</sup>
                  </>
                }
                value={value?.isNative ? Native.onChain(value.chainId).wrapped.address : value?.address}
                onClick={() => setOpen(true)}
                id={'create-single-stream-select'}
                caption={error?.message ?? value?.symbol}
                isError={Boolean(error?.message)}
                className="min-w-[200px]"
              />
            )}
          </TokenSelector>
          <Form.Error message={error?.message} />
        </>
      )}
    />
  )
}
