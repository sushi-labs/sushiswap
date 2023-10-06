import { ChainId } from 'sushi/chain'
import { Label } from '@sushiswap/ui'
import { TextField } from '@sushiswap/ui'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  FormSection,
} from '@sushiswap/ui/components/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui/components/select'
import { _useBalance as useBalance, useAccount } from '@sushiswap/wagmi'
import React, { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../lib'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import {
  CreateMultipleVestingBaseSchemaFormErrorsType,
  CreateMultipleVestingFormSchemaType,
  STEP_CONFIGURATIONS_SECONDS,
} from '../schema'
import { calculateTotalAmount } from '../utils'

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
              <Label>
                Payout per unlock
                <sup>*</sup>
              </Label>
              <FormControl>
                <TextField
                  type="number"
                  onValueChange={onChange}
                  value={value}
                  name={name}
                  onBlur={onBlur}
                  testdata-id={`create-single-vest-graded-amount-input${index}`}
                  unit={currency?.symbol}
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
              <Label>
                Number of unlocks<sup>*</sup>
              </Label>
              <FormControl>
                <TextField
                  type="number"
                  onValueChange={onChange}
                  value={value}
                  name={name}
                  onBlur={onBlur}
                  testdata-id={`create-single-vest-steps-input${index}`}
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
            <Label>Unlock frequency*</Label>
            <Select value={value} onValueChange={onChange} defaultValue={value}>
              <FormControl>
                <SelectGroup>
                  <SelectTrigger testdata-id={`create-single-vest-graded-frequency-selection-button${index}`}>
                    <SelectValue placeholder="Unlock frequency" />
                  </SelectTrigger>
                </SelectGroup>
              </FormControl>

              <SelectContent>
                {Object.keys(STEP_CONFIGURATIONS_SECONDS).map((stepConfig, i) => (
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
