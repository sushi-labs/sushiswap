import { ChevronDownIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, classNames } from '@sushiswap/ui'
import { TokenSelector } from '@sushiswap/wagmi'
import React, { FC, useCallback, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useCustomTokens } from '../../../../../lib/state/storage'
import { useTokens } from '../../../../../lib/state/token-lists'
import { useTokenFromZToken } from '../../../../../lib/zod'
import { CreateMultipleVestingFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const CurrencyCell: FC<CellProps> = ({ row, index, chainId = ChainId.ETHEREUM }) => {
  const tokenMap = useTokens(chainId)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const [open, setOpen] = useState(false)
  const { control, setValue } = useFormContext<CreateMultipleVestingFormSchemaType>()

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

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
            <Button
              variant="empty"
              className={classNames('!px-0 text-left !text-slate-50')}
              color="gray"
              type="button"
              onClick={handleOpen}
            >
              <span className="text-sm font-medium truncate">{_currency?.symbol || 'Select'}</span>
              <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
            </Button>
            <TokenSelector
              id={`create-multiple-vests-${index}`}
              open={open}
              variant="dialog"
              chainId={chainId}
              tokenMap={tokenMap}
              customTokenMap={customTokenMap}
              onSelect={(currency) => {
                onSelect(onChange, currency)
                handleClose()
              }}
              currency={_currency}
              onClose={handleClose}
              onAddToken={addCustomToken}
              onRemoveToken={removeCustomToken}
            />
          </div>
        )
      }}
    />
  )
}
