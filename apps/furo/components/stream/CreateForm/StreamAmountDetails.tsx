import { ChainId } from '@sushiswap/chain'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { SelectIcon, TextField, textFieldVariants } from '@sushiswap/ui'
import { Label } from '@sushiswap/ui'
import { FormControl, FormField, FormItem, FormMessage, FormSection } from '@sushiswap/ui/components/form'
import { _useBalance as useBalance, useAccount } from '@sushiswap/wagmi'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'
import React, { FC, useCallback, useEffect } from 'react'
import { ControllerRenderProps, useFormContext } from 'react-hook-form'

import { useFundSourceFromZFundSource, useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { CreateMultipleStreamBaseSchemaFormErrorsType, CreateMultipleStreamFormSchemaType } from '../schema'
import { FundSourceOption } from './FundSourceOption'

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

    console.log(balance.WALLET.quotient, cAmount)

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
        render={({ field: { onChange, onBlur, name, value } }) => (
          <FormItem>
            <Label>
              Token<sup>*</sup>
            </Label>
            <FormControl>
              <TokenSelector
                id={`create-single-stream-token-selector${index}`}
                chainId={chainId}
                onSelect={(currency) => onSelect(onChange, currency)}
                selected={_currency}
              >
                <button
                  onBlur={onBlur}
                  className={textFieldVariants({ className: 'flex flex-1 justify-between' })}
                  type="button"
                >
                  <TextField
                    name={name}
                    readOnly
                    value={value?.isNative ? value?.symbol : value?.address}
                    placeholder="Select a token"
                    testdata-id={`create-single-stream-token-select${index}`}
                    variant="naked"
                    type="text"
                    className="cursor-pointer"
                  />
                  <SelectIcon />
                </button>
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
              <Label>
                Stream from<sup>*</sup>
              </Label>
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
              <Label>
                Amount
                <sup>*</sup>
              </Label>
              <FormControl>
                <TextField
                  type="number"
                  onValueChange={onChange}
                  value={value}
                  name={name}
                  onBlur={onBlur}
                  testdata-id={`create-stream-amount-input${index}`}
                  unit={currency?.symbol}
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
