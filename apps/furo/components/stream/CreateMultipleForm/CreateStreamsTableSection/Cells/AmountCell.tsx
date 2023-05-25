import { ChainId } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { _useBalance as useBalance, useAccount } from '@sushiswap/wagmi'
import React, { FC, useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../../../lib/zod'
import { CreateMultipleStreamBaseSchemaFormErrorsType, CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'
import { Input } from '@sushiswap/ui/future/components/input'

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
      render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
        return (
          <>
            <Input.Numeric
              onUserInput={onChange}
              isError={Boolean(error?.message || errors?.['FORM_ERRORS']?.[index]?.['amount']?.message)}
              caption={error?.message || errors?.['FORM_ERRORS']?.[index]?.['amount']?.message}
              onBlur={onBlur}
              name={name}
              value={value}
              id="create-stream-amount-input"
              label={
                <>
                  Amount<sup>*</sup>
                </>
              }
            />
          </>
        )
      }}
    />
  )
}
