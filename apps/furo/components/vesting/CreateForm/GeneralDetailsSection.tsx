import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME, Form, Select } from '@sushiswap/ui'
import { DatePicker } from '@sushiswap/ui/input/DatePicker'
import { Web3Input } from '@sushiswap/wagmi'
import React, { FC, useCallback, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { FundSourceOption } from '../../stream/CreateForm/FundSourceOption'
import { CreateVestingFormSchemaType } from './schema'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'

export const GeneralDetailsSection: FC<{ chainId: ChainId }> = ({ chainId }) => {
  const { control, watch, setValue, setError, clearErrors } = useFormContext<CreateVestingFormSchemaType>()
  const [currency, startDate] = watch(['currency', 'startDate'])
  const _currency = useTokenFromZToken(currency)

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
        setValue('fundSource', FundSource.WALLET)
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
    [setValue]
  )

  // Temporary solution for when Zod fixes conditional validation
  // https://github.com/colinhacks/zod/issues/1394
  useEffect(() => {
    if (startDate && startDate.getTime() <= new Date(Date.now() + 5 * 60 * 1000).getTime()) {
      setError(`startDate`, {
        type: 'custom',
        message: 'Must be at least 5 minutes from now',
      })
    } else {
      clearErrors(`startDate`)
    }
  }, [clearErrors, setError, startDate])

  return (
    <Form.Section
      title="General Details"
      description="Furo allows for creating a vested stream using your BentoBox balance."
    >
      <Form.Control>
        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <>
              <TokenSelector
                id={'create-single-vest'}
                chainId={chainId}
                onSelect={(currency) => onSelect(onChange, currency)}
                selected={_currency}
              >
                {({ setOpen }) => (
                  <Select.Button
                    error={!!error?.message}
                    standalone
                    className="!cursor-pointer ring-offset-slate-900"
                    onClick={() => setOpen(true)}
                  >
                    {value?.symbol || <span className="text-slate-500">Select a currency</span>}
                  </Select.Button>
                )}
              </TokenSelector>
              <Form.Error message={error?.message} />
            </>
          )}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <DatePicker
                  name={name}
                  onBlur={onBlur}
                  className={classNames(
                    DEFAULT_INPUT_CLASSNAME,
                    error ? ERROR_INPUT_CLASSNAME : '',
                    '!ring-offset-slate-900'
                  )}
                  onChange={onChange}
                  selected={value}
                  portalId="root-portal"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  minDate={new Date(Date.now() + 5 * 60 * 1000)}
                  dateFormat="MMM d, yyyy HH:mm"
                  placeholderText="Select date"
                  autoComplete="off"
                />
                <Form.Error message={error?.message} />
              </>
            )
          }}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name="recipient"
          render={({ field: { onChange, value, name, onBlur }, fieldState: { error } }) => (
            <>
              <Web3Input.Ens
                name={name}
                onBlur={onBlur}
                id="ensInput"
                value={value}
                onChange={onChange}
                error={!!error?.message}
                placeholder="Address or ENS Name"
                className={classNames(
                  DEFAULT_INPUT_CLASSNAME,
                  error ? ERROR_INPUT_CLASSNAME : '',
                  'ring-offset-slate-900'
                )}
              />
              <Form.Error message={error?.message} />
            </>
          )}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name="fundSource"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const _value = ZFundSourceToFundSource.parse(value)
            return (
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
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
                <Form.Error message={error?.message} />
              </div>
            )
          }}
        />
      </Form.Control>
    </Form.Section>
  )
}
