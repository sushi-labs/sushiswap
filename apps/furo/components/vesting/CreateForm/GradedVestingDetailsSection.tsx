import { Form } from '@sushiswap/ui'
import { _useBalance as useBalance, useAccount } from '@sushiswap/wagmi'
import React, { FC, useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../lib'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { calculateTotalAmount } from '../utils'
import { ChainId } from '@sushiswap/chain'
import { Input } from '@sushiswap/ui/future/components/input'
import {
  Select,
  SelectCaption,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui/components/ui/select'
import {
  CreateMultipleVestingBaseSchemaFormErrorsType,
  CreateMultipleVestingFormSchemaType,
  STEP_CONFIGURATIONS,
} from '../schema'

export const GradedVestingDetailsSection: FC<{ index: number }> = ({ index }) => {
  const { address } = useAccount()
  const {
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateMultipleVestingFormSchemaType & CreateMultipleVestingBaseSchemaFormErrorsType>()

  const formData = watch(`vestings.${index}`)
  const _formData = useDeepCompareMemoize(formData)
  const { currency, fundSource, cliff, stepAmount, stepPayouts } = _formData
  const _fundSource = ZFundSourceToFundSource.parse(fundSource)
  const _currency = useTokenFromZToken(currency)
  const totalAmount = useMemo(
    () => calculateTotalAmount({ currency, cliff, stepAmount, stepPayouts }),
    [cliff, currency, stepAmount, stepPayouts]
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
    <Form.Section title="Graded Vesting Details" description="Optionally provide graded vesting details">
      <Form.Control>
        <Controller
          control={control}
          name={`vestings.${index}.stepAmount`}
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <Input.Numeric
                  onUserInput={onChange}
                  isError={Boolean(error?.message || errors?.['FORM_ERRORS']?.[index]?.['stepAmount']?.message)}
                  caption={
                    (error?.message || errors?.['FORM_ERRORS']?.[index]?.['stepAmount']?.message) ??
                    'The amount the recipient receives for every unlock.'
                  }
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  id="create-single-vest-cliff-amount-input"
                  label={
                    <>
                      Payout per unlock{currency ? ` (${currency.symbol})` : ''}
                      <sup>*</sup>
                    </>
                  }
                />
              </>
            )
          }}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name={`vestings.${index}.stepPayouts`}
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <Input.Numeric
                  onUserInput={(val) => onChange(+val)}
                  isError={Boolean(error?.message)}
                  caption={
                    error?.message
                      ? error?.message
                      : 'Defines the number of unlocks, a value of 10 would mean there will be a total of 10 unlocks during the duration of this vest.'
                  }
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  id="create-single-vest-cliff-amount-input"
                  label={
                    <>
                      Number of unlocks<sup>*</sup>
                    </>
                  }
                />
              </>
            )
          }}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name={`vestings.${index}.stepConfig`}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Select onValueChange={onChange} defaultValue={value}>
                <SelectGroup>
                  <SelectTrigger>
                    <SelectLabel aria-label={value}>
                      Unlock frequency<sup>*</sup>
                    </SelectLabel>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectCaption
                    caption={error?.message ? error?.message : 'The period of time between each unlock'}
                    isError={Boolean(error)}
                  />
                  <SelectContent>
                    {Object.keys(STEP_CONFIGURATIONS).map((stepConfig) => (
                      <SelectItem
                        key={stepConfig}
                        value={stepConfig}
                        testdata-id={`create-single-vest-graded-type-${stepConfig.toLowerCase()}`}
                      >
                        {stepConfig}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectGroup>
              </Select>
            </>
          )}
        />
      </Form.Control>
    </Form.Section>
  )
}
