import { ChainId } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames, Input } from '@sushiswap/ui'
import { _useBalance as useBalance } from '@sushiswap/wagmi'
import React, { FC, useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from '@sushiswap/wagmi'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../../../lib/zod'
import { CreateMultipleStreamBaseSchemaFormErrorsType, CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const AmountCell: FC<CellProps> = ({ row, index, chainId = ChainId.ETHEREUM }) => {
  const { address } = useAccount()
  const {
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateMultipleStreamFormSchemaType & CreateMultipleStreamBaseSchemaFormErrorsType>()
  const _currency = useTokenFromZToken(row.currency)
  const _fundSource = ZFundSourceToFundSource.parse(row.fundSource) || FundSource.WALLET
  const _amount = useMemo(() => tryParseAmount(row.amount, _currency), [_currency, row.amount])

  const { data: balance } = useBalance({
    account: address,
    currency: _currency,
    chainId,
    loadBentobox: true,
  })

  useEffect(() => {
    if (_amount && balance && balance[_fundSource] && balance[_fundSource].lessThan(_amount)) {
      setError(`FORM_ERRORS.${index}.amount`, {
        type: 'custom',
        message: `Insufficient ${_amount.currency.symbol} balance`,
      })
    } else {
      clearErrors(`FORM_ERRORS.${index}.amount`)
    }
  }, [_amount, _fundSource, balance, clearErrors, index, setError])

  return (
    <Controller
      control={control as never}
      name={`streams.${index}.amount`}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => {
        return (
          <div className="py-2">
            <Input.Numeric
              variant="unstyled"
              onBlur={onBlur}
              value={value || ''}
              placeholder="0.00"
              onUserInput={onChange}
              className={classNames(
                error?.message || errors?.['FORM_ERRORS']?.[index]?.['amount']?.message
                  ? '!border-red'
                  : 'border-transparent border-none',
                'border-0 !border-b-[1px] py-2 flex items-center',
                'without-ring bg-transparent text-sm font-semibold text-slate-50 !px-0 flex items-center'
              )}
            />
          </div>
        )
      }}
    />
  )
}
