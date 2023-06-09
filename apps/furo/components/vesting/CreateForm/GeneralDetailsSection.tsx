import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui'
import React, { FC, useCallback, useEffect } from 'react'
import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { FundSourceOption } from '../../stream/CreateForm/FundSourceOption'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'
import { Input } from '@sushiswap/ui/future/components/input'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { CreateMultipleVestingFormSchemaType } from '../schema'

export const GeneralDetailsSection: FC<{ chainId: ChainId; index: number }> = ({ chainId, index }) => {
  const { control, watch, setValue, setError, clearErrors } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const [currency, startDate] = watch([`vestings.${index}.currency`, `vestings.${index}.startDate`])
  const _currency = useTokenFromZToken(currency)

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

  // Temporary solution for when Zod fixes conditional validation
  // https://github.com/colinhacks/zod/issues/1394
  useEffect(() => {
    if (startDate && startDate.getTime() <= new Date(Date.now() + 5 * 60 * 1000).getTime()) {
      setError(`vestings.${index}.startDate`, {
        type: 'custom',
        message: 'Must be at least 5 minutes from now',
      })
    } else {
      clearErrors(`vestings.${index}.startDate`)
    }
  }, [clearErrors, index, setError, startDate])

  return (
    <Form.Section
      title="General Details"
      description="Furo allows for creating a vested stream using your BentoBox balance."
    >
      <Form.Control>
        <Controller
          control={control}
          name={`vestings.${index}.currency`}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <>
              <TokenSelector
                id={'create-single-vest'}
                testdata-id={'create-single-vest'}
                chainId={chainId}
                onSelect={(currency) => onSelect(onChange, currency)}
                selected={_currency}
              >
                {({ setOpen }) => (
                  <Input.Select
                    id={'create-single-vest-select'}
                    testdata-id={'create-single-vest-select'}
                    onBlur={onBlur}
                    label={
                      <>
                        Token<sup>*</sup>
                      </>
                    }
                    value={value?.isNative ? value?.symbol : value?.address}
                    onClick={() => setOpen(true)}
                    caption={error?.message ?? value?.symbol}
                    isError={Boolean(error?.message)}
                  />
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
          name={`vestings.${index}.startDate`}
          render={({ field: { name, onChange, value, onBlur }, fieldState: { error } }) => {
            return (
              <Input.DatePicker
                name={name}
                onBlur={onBlur}
                customInput={
                  <Input.DatePickerCustomInput
                    isError={Boolean(error?.message)}
                    caption={error?.message}
                    testdata-id={'create-single-vest-start-date'}
                    id="create-single-vest-start-date"
                    label={
                      <>
                        Start date<sup>*</sup>
                      </>
                    }
                  />
                }
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
                testdata-id={'TEST'}
              />
            )
          }}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name={`vestings.${index}.recipient`}
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <Web3Input.Ens
                isError={Boolean(error?.message)}
                caption={error?.message}
                label={
                  <>
                    Address or ENS<sup>*</sup>
                  </>
                }
                name={name}
                onBlur={onBlur}
                id="create-single-vest-recipient-input"
                testdata-id="create-single-vest-recipient-input"
                value={value}
                onChange={onChange}
              />
            )
          }}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name={`vestings.${index}.fundSource`}
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
