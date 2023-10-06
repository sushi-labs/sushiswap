import { ChainId } from 'sushi/chain'
import { Type } from 'sushi/currency'
import { FundSource } from '@sushiswap/hooks'
import {
  DateField,
  Label,
  SelectIcon,
  TextField,
  textFieldVariants,
} from '@sushiswap/ui'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormSection,
} from '@sushiswap/ui/components/form'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import React, { FC, useCallback } from 'react'
import { ControllerRenderProps, useFormContext } from 'react-hook-form'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { FundSourceOption } from '../../stream/CreateForm/FundSourceOption'
import { CreateMultipleVestingFormSchemaType } from '../schema'

export const GeneralDetailsSection: FC<{ chainId: ChainId; index: number }> = ({
  chainId,
  index,
}) => {
  const { control, watch, setValue } =
    useFormContext<CreateMultipleVestingFormSchemaType>()
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
    [index, setValue],
  )

  return (
    <FormSection
      title="General Details"
      description="Furo allows for creating a vested stream using your BentoBox balance."
    >
      <FormField
        control={control}
        name={`vestings.${index}.currency`}
        render={({ field: { onChange, name, onBlur, value } }) => (
          <FormItem>
            <Label>
              Token<sup>*</sup>
            </Label>
            <FormControl>
              <TokenSelector
                id={`create-single-vest${index}`}
                testdata-id={`create-single-vest${index}`}
                chainId={chainId}
                onSelect={(currency) => onSelect(onChange, currency)}
                selected={_currency}
              >
                <button
                  onBlur={onBlur}
                  className={textFieldVariants({
                    className: 'flex flex-1 justify-between',
                  })}
                >
                  <TextField
                    name={name}
                    readOnly
                    value={value?.isNative ? value?.symbol : value?.address}
                    placeholder="Select a token"
                    testdata-id={`create-single-vest-select${index}`}
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
        name={`vestings.${index}.startDate`}
        rules={{ deps: [`vestings.${index}.cliffEndDate`] }}
        render={({ field: { name, onChange, value, onBlur } }) => {
          return (
            <FormItem>
              <Label>
                Start date<sup>*</sup>
              </Label>
              <FormControl>
                <DateField
                  testId={`create-single-vest-start-date${index}`}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  selected={value}
                  portalId="root-portal"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  startDate={new Date(Date.now() + 5 * 60 * 1000)}
                  minDate={new Date(Date.now() + 5 * 60 * 1000)}
                  dateFormat="MMM d, yyyy HH:mm"
                  placeholderText="Select date"
                  autoComplete="off"
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
              <Label>
                Recipient<sup>*</sup>
              </Label>
              <FormControl>
                <Web3Input.Ens
                  placeholder="Enter wallet address or ENS"
                  name={name}
                  onBlur={onBlur}
                  testdata-id={`create-single-vest-recipient-input${index}`}
                  value={value}
                  onValueChange={onChange}
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
              <Label>
                Source<sup>*</sup>
              </Label>
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
