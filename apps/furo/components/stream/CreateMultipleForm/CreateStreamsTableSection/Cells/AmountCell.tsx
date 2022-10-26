import { ChainId } from '@sushiswap/chain'
import { FundSource } from '@sushiswap/hooks'
import { Input } from '@sushiswap/ui'
import { useBalance } from '@sushiswap/wagmi'
import React, { FC, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { useAmountFromZAmount, useTokenFromZAmount, ZFundSourceToFundSource } from '../../../../../lib/zod'
import { CreateMultipleStreamBaseSchemaType } from '../../schema'
import { CellProps } from './types'

export const AmountCell: FC<CellProps> = ({ row, index, chainId = ChainId.ETHEREUM }) => {
  const { address } = useAccount()
  const { control, setError, clearErrors } = useFormContext<CreateMultipleStreamBaseSchemaType>()
  const _amount = useAmountFromZAmount(row.amount)
  const _currency = useTokenFromZAmount(row.amount)
  const _fundSource = ZFundSourceToFundSource.parse(row.fundSource) || FundSource.WALLET

  const { data: balance } = useBalance({
    account: address,
    currency: _currency,
    chainId,
    loadBentobox: true,
  })

  useEffect(() => {
    if (_amount && balance && balance[_fundSource] && balance[_fundSource].lessThan(_amount)) {
      setError(`streams.${index}.amount`, {
        type: 'custom',
        message: `Insufficient ${_amount.currency.symbol} balance`,
      })
    } else {
      clearErrors(`streams.${index}.amount`)
    }
  }, [_amount, _fundSource, balance, clearErrors, index, setError])

  return (
    <Controller
      control={control as never}
      name={`streams.${index}.amount.amount`}
      render={({ field: { onChange, value, onBlur } }) => {
        return (
          <Input.Numeric
            variant="unstyled"
            onBlur={onBlur}
            value={value || ''}
            placeholder="0.00"
            onUserInput={onChange}
            className="border-none without-ring bg-transparent text-sm font-semibold text-slate-50 absolute inset-0 px-4"
          />
        )
      }}
    />
  )
}
