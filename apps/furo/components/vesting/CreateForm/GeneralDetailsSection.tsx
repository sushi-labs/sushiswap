import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import React, { FC, useCallback } from 'react'
import { ControllerRenderProps, useFormContext } from 'react-hook-form'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { FundSourceOption } from '../../stream/CreateForm/FundSourceOption'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'
import { Input } from '@sushiswap/ui/future/components/input'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { CreateMultipleVestingFormSchemaType } from '../schema'
import { FormControl, FormField, FormItem, FormMessage, FormSection } from '@sushiswap/ui/future/components/form'

export const GeneralDetailsSection: FC<{ chainId: ChainId; index: number }> = ({ chainId, index }) => {
  const { control, watch, setValue } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const [currency] = watch([`vestings.${index}.currency`])
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

  return (
    <FormSection
      title="General Details"
      description="Furo allows for creating a vested stream using your BentoBox balance."
    >
      <FormField
        control={control}
        name={`vestings.${index}.currency`}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormItem>
            <FormControl>
              <TokenSelector
                id={`create-single-vest${index}`}
                testdata-id={`create-single-vest${index}`}
                chainId={chainId}
                onSelect={(currency) => onSelect(onChange, currency)}
                selected={_currency}
              >
                {({ setOpen }) => (
                  <Input.Select
                    id={`create-single-vest-select${index}`}
                    testdata-id={`create-single-vest-select${index}`}
                    onBlur={onBlur}
                    label={
                      <>
                        Token<sup>*</sup>
                      </>
                    }
                    value={value?.isNative ? value?.symbol : value?.address}
                    onClick={() => setOpen(true)}
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
        name={`vestings.${index}.startDate`}
        rules={{ deps: [`vestings.${index}.cliffEndDate`] }}
        render={({ field: { name, onChange, value, onBlur } }) => {
          return (
            <FormItem>
              <FormControl>
                <Input.DatePicker
                  name={name}
                  onBlur={onBlur}
                  customInput={
                    <Input.DatePickerCustomInput
                      testdata-id={`create-single-vest-start-date${index}`}
                      id={`create-single-vest-start-date${index}`}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name={`vestings.${index}.recipient`}
        render={({ field: { onChange, value, onBlur, name } }) => {
          return (
            <FormItem>
              <FormControl>
                <Web3Input.Ens
                  label={
                    <>
                      Address or ENS<sup>*</sup>
                    </>
                  }
                  name={name}
                  onBlur={onBlur}
                  id={`create-single-vest-recipient-input${index}`}
                  testdata-id={`create-single-vest-recipient-input${index}`}
                  value={value}
                  onChange={onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name={`vestings.${index}.fundSource`}
        render={({ field: { onChange, value } }) => {
          const _value = ZFundSourceToFundSource.parse(value)
          return (
            <FormItem>
              <FormControl>
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
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </FormSection>
  )
}
