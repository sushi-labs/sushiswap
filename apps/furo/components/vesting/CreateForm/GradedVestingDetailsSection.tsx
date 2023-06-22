import { _useBalance as useBalance, useAccount } from '@sushiswap/wagmi'
import React, { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../lib'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { calculateTotalAmount } from '../utils'
import { ChainId } from '@sushiswap/chain'
import { Input } from '@sushiswap/ui/components/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui/components/select'
import {
  CreateMultipleVestingBaseSchemaFormErrorsType,
  CreateMultipleVestingFormSchemaType,
  STEP_CONFIGURATIONS,
} from '../schema'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  FormSection,
} from '@sushiswap/ui/components/form'

export const GradedVestingDetailsSection: FC<{ index: number }> = ({ index }) => {
  const { address } = useAccount()
  const { control, watch, setError, clearErrors } = useFormContext<
    CreateMultipleVestingFormSchemaType & CreateMultipleVestingBaseSchemaFormErrorsType
  >()

  const formData = watch(`vestings.${index}`)
  const _formData = useDeepCompareMemoize(formData)
  const { currency, fundSource, cliffEnabled, cliffAmount, stepAmount, stepPayouts } = _formData
  const _fundSource = ZFundSourceToFundSource.parse(fundSource)
  const _currency = useTokenFromZToken(currency)
  const totalAmount = useMemo(
    () => calculateTotalAmount({ currency, cliffEnabled, cliffAmount, stepAmount, stepPayouts }),
    [cliffAmount, cliffEnabled, currency, stepAmount, stepPayouts]
  )

  const { data: balance } = useBalance({
    account: address,
    chainId: currency?.chainId as ChainId | undefined,
    currency: _currency,
    loadBentobox: true,
  })

  useEffect(() => {
    if (!_fundSource || !totalAmount || !balance || !balance[_fundSource]) return
    if (totalAmount.greaterThan(balance[_fundSource])) {
      setError(`FORM_ERRORS.${index}.stepAmount`, {
        type: 'custom',
        message: 'Insufficient Balance',
      })
    } else {
      clearErrors(`FORM_ERRORS.${index}.stepAmount`)
    }
  }, [balance, clearErrors, _fundSource, setError, totalAmount, index])

  return (
    <FormSection title="Graded Vesting Details" description="Optionally provide graded vesting details">
      <FormField
        control={control}
        name={`vestings.${index}.stepAmount`}
        render={({ field: { onChange, value, onBlur, name } }) => {
          return (
            <FormItem>
              <FormControl>
                <Input.Numeric
                  onUserInput={onChange}
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  id={`create-single-vest-graded-amount-input${index}`}
                  testdata-id={`create-single-vest-graded-amount-input${index}`}
                  label={
                    <>
                      Payout per unlock{currency ? ` (${currency.symbol})` : ''}
                      <sup>*</sup>
                    </>
                  }
                />
              </FormControl>
              <FormDescription>The amount the recipient receives for every unlock.</FormDescription>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name={`vestings.${index}.stepPayouts`}
        render={({ field: { onChange, value, onBlur, name } }) => {
          return (
            <FormItem>
              <FormControl>
                <Input.Numeric
                  onUserInput={(val) => onChange(+val)}
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  id={`create-single-vest-steps-input${index}`}
                  testdata-id={`create-single-vest-steps-input${index}`}
                  label={
                    <>
                      Number of unlocks<sup>*</sup>
                    </>
                  }
                />
              </FormControl>
              <FormDescription>
                Defines the number of unlocks, a value of 10 would mean there will be a total of 10 unlocks during the
                duration of this vest.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name={`vestings.${index}.stepConfig`}
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <Select value={value} onValueChange={onChange} defaultValue={value}>
              <FormControl>
                <SelectGroup>
                  <SelectTrigger testdata-id={`create-single-vest-graded-frequency-selection-button${index}`}>
                    <SelectLabel aria-label={value}>
                      Unlock frequency<sup>*</sup>
                    </SelectLabel>
                    <SelectValue />
                  </SelectTrigger>
                </SelectGroup>
              </FormControl>

              <SelectContent>
                {Object.keys(STEP_CONFIGURATIONS).map((stepConfig, i) => (
                  <SelectItem
                    key={stepConfig}
                    value={`${i}`}
                    testdata-id={`create-single-vest-graded-type-${stepConfig.toLowerCase()}${index}`}
                  >
                    {stepConfig}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>The period of time between each unlock.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  )
}
