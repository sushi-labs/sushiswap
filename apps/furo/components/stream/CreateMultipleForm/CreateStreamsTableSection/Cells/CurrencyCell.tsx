import { ChevronDownIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { TokenSelector } from '@sushiswap/wagmi'
import React, { FC, useCallback, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useCustomTokens } from '../../../../../lib/state/storage'
import { useTokens } from '../../../../../lib/state/token-lists'
import { useTokenFromZAmount } from '../../../../../lib/zod'
import { CreateMultipleStreamBaseSchemaType } from '../../schema'
import { CellProps } from './types'

export const CurrencyCell: FC<CellProps> = ({ row, index, chainId = ChainId.ETHEREUM }) => {
  const tokenMap = useTokens(chainId)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const [open, setOpen] = useState(false)
  const { control, setValue } = useFormContext<CreateMultipleStreamBaseSchemaType>()

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onSelect = useCallback(
    (onChange, currency: Type) => {
      if (currency.isNative) {
        const { chainId, decimals, symbol, name, isNative } = currency
        onChange({ chainId, decimals, address: undefined, symbol, name, isNative })
        setValue(`streams.${index}.fundSource`, FundSource.WALLET)
      } else {
        const { chainId, decimals, symbol, name, isNative, wrapped } = currency
        onChange({ chainId, decimals, address: wrapped.address, symbol, name, isNative })
      }
    },
    [index, setValue]
  )

  const _currency = useTokenFromZAmount(row.amount)

  return (
    <Controller
      control={control}
      name={`streams.${index}.amount.token`}
      render={({ field: { onChange } }) => {
        return (
          <>
            <Button
              variant="empty"
              className="!px-0 text-left !text-slate-50"
              color="gray"
              type="button"
              onClick={handleOpen}
            >
              <span className="text-sm font-medium truncate">{_currency?.symbol || 'Select'}</span>
              <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
            </Button>
            <TokenSelector
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
          </>
        )
      }}
    />
  )
}
