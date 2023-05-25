import { ChevronDownIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import React, { FC, useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useTokenFromZToken } from '../../../../../lib/zod'
import { CreateMultipleVestingFormSchemaType } from '../../schema'
import { CellProps } from './types'
import { Button } from '@sushiswap/ui/future/components/button'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'

export const CurrencyCell: FC<CellProps> = ({ row, index, chainId = ChainId.ETHEREUM }) => {
  const { control, setValue } = useFormContext<CreateMultipleVestingFormSchemaType>()

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
        setValue(`vestings.${index}.fundSource`, FundSource.WALLET)
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
      name={`vestings.${index}.currency`}
      render={({ field: { onChange }, fieldState: { error } }) => {
        return (
          <div
            className={classNames(
              error?.message ? ' !border-red' : 'border-transparent border-none',
              'border-0 !border-b-[1px]',
              'h-[37px] flex items-center'
            )}
          >
            <TokenSelector
              id={'create-single-stream'}
              chainId={chainId}
              onSelect={(currency) => onSelect(onChange, currency)}
              selected={_currency}
            >
              {({ setOpen }) => (
                <Button
                  onClick={() => setOpen(true)}
                  variant="empty"
                  className={classNames('!px-0 text-left !text-slate-50')}
                  type="button"
                  testdata-id={`vesting-currency-selector-row-${index}-button`}
                >
                  <span className="text-sm font-medium truncate">{_currency?.symbol || 'Select'}</span>
                  <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                </Button>
              )}
            </TokenSelector>
          </div>
        )
      }}
    />
  )
}
