import { ChainId } from '@sushiswap/chain'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { _useBalance as useBalance, useAccount } from '@sushiswap/wagmi'
import React, { FC, useCallback, useEffect } from 'react'
import { ControllerRenderProps, useFormContext } from 'react-hook-form'

import { useFundSourceFromZFundSource, useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { FundSourceOption } from './FundSourceOption'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'
import { Input } from '@sushiswap/ui/future/components/input'
import { CreateMultipleStreamBaseSchemaFormErrorsType, CreateMultipleStreamFormSchemaType } from '../schema'
import { FormSection, FormField, FormItem, FormControl, FormMessage } from '@sushiswap/ui/future/components/form'

export const StreamAmountDetails: FC<{ chainId: ChainId; index: number }> = ({ chainId, index }) => {
  const { address } = useAccount()

  const { control, watch, setValue, setError, clearErrors } = useFormContext<
    CreateMultipleStreamFormSchemaType & CreateMultipleStreamBaseSchemaFormErrorsType
  >()

  const [amount, currency, fundSource] = watch([
    `streams.${index}.amount`,
    `streams.${index}.currency`,
    `streams.${index}.fundSource`,
  ])

  const _currency = useTokenFromZToken(currency)
  const _fundSource = useFundSourceFromZFundSource(fundSource)
  const { data: balance } = useBalance({
    account: address,
    currency: _currency,
    chainId,
    loadBentobox: true,
  })

  const onSelect = useCallback(
    (onChange: ControllerRenderProps['onChange'], currency: Type) => {
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

  useEffect(() => {
    const cAmount = tryParseAmount(amount, _currency)
    if (!_fundSource || !balance?.[_fundSource] || !cAmount) return
    if (balance[_fundSource].lessThan(cAmount)) {
      setError(`FORM_ERRORS.${index}.amount`, { type: 'min', message: 'Insufficient Balance' })
    } else {
      clearErrors(`FORM_ERRORS.${index}.amount`)
    }
  }, [_currency, _fundSource, amount, balance, clearErrors, index, setError])

  return (
    <FormSection
      title="Stream Details"
      description="Furo allows you to create a stream from BentoBox to allow the recipient to gain yield whilst receiving the stream if the token that's being used has a BentoBox strategy set on it."
    >
      <FormField
        control={control}
        name={`streams.${index}.currency`}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormItem>
            <FormControl>
              <TokenSelector
                id={`create-single-stream-token-selector${index}`}
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
                    value={value?.isNative ? value?.symbol : value?.address}
                    onClick={() => setOpen(true)}
                    id={`create-single-stream-token-select${index}`}
                    testdata-id={`create-single-stream-token-select${index}`}
                  />
                )}
              </TokenSelector>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`streams.${index}.fundSource`}
        render={({ field: { onChange, value } }) => {
          const _value = ZFundSourceToFundSource.parse(value)
          return (
            <FormItem>
              <FormControl>
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <FundSourceOption
                      chainId={chainId}
                      label="Wallet"
                      active={_value === FundSource.WALLET}
                      value={FundSource.WALLET}
                      currency={_currency}
                      onChange={() => onChange(FundSource.WALLET)}
                    />
                    {!currency?.isNative && (
                      <FundSourceOption
                        chainId={chainId}
                        label="BentoBox"
                        active={_value === FundSource.BENTOBOX}
                        value={FundSource.BENTOBOX}
                        currency={_currency}
                        onChange={() => onChange(FundSource.BENTOBOX)}
                      />
                    )}
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name={`streams.${index}.amount`}
        render={({ field: { onChange, value, onBlur, name } }) => {
          return (
            <FormItem>
              <FormControl>
                <Input.Numeric
                  onUserInput={onChange}
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  id={`create-stream-amount-input${index}`}
                  testdata-id={`create-stream-amount-input${index}`}
                  label={
                    <>
                      Amount{currency ? ` (${currency.symbol})` : ''}
                      <sup>*</sup>
                    </>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </FormSection>
  )
}
