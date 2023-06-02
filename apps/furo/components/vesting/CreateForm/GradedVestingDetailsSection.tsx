import { classNames, Form, Typography } from '@sushiswap/ui'
import { _useBalance as useBalance, useAccount } from '@sushiswap/wagmi'
import { format } from 'date-fns'
import React, { Fragment, useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../lib'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { CreateVestingFormSchemaType, FormErrors, StepConfig, stepConfigurations } from '../../vesting'
import { calculateEndDate, calculateTotalAmount } from '../utils'
import { ChainId } from '@sushiswap/chain'
import { Input } from '@sushiswap/ui/future/components/input'
import { Listbox, Transition } from '@headlessui/react'

export const GradedVestingDetailsSection = () => {
  const { address } = useAccount()
  const {
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateVestingFormSchemaType & FormErrors>()
  const formData = watch()
  const _formData = useDeepCompareMemoize(formData)

  const { currency, stepConfig, fundSource, cliff, stepAmount, stepPayouts } = _formData

  const _fundSource = ZFundSourceToFundSource.parse(fundSource)
  const _currency = useTokenFromZToken(currency)
  const endDate = calculateEndDate(formData)
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
      setError('FORM_ERROR', {
        type: 'custom',
        message: 'Insufficient Balance',
      })
    } else {
      clearErrors('FORM_ERROR')
    }
  }, [balance, clearErrors, _fundSource, setError, totalAmount])

  return (
    <Form.Section title="Graded Vesting Details" description="Optionally provide graded vesting details">
      <Form.Control>
        <Controller
          control={control}
          name="stepAmount"
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <Input.Numeric
                  onUserInput={onChange}
                  isError={Boolean(error?.message)}
                  caption={error?.message ? error.message : `The amount the recipient receives for every unlock.`}
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  id="create-single-vest-cliff-amount-input"
                  label={
                    <>
                      Payout per unlock<sup>*</sup>
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
          name="stepPayouts"
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <Input.Numeric
                  onUserInput={onChange}
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
          name="stepConfig"
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <>
              <Listbox
                value={value}
                onChange={(val: StepConfig) => {
                  onChange(val)
                  onBlur()
                }}
              >
                <Listbox.Button as={Fragment}>
                  <Input.Select
                    id={'create-single-vest-select'}
                    onBlur={onBlur}
                    label={
                      <>
                        Unlock frequency<sup>*</sup>
                      </>
                    }
                    value={value?.label}
                    caption={error?.message}
                    isError={Boolean(error?.message)}
                  />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition duration-300 ease-out"
                  enterFrom="transform translate-y-[-16px] scale-[0.95] opacity-0"
                  enterTo="transform translate-y-0 scale-[1] opacity-100"
                  leave="transition duration-300 ease-out"
                  leaveFrom="transform translate-y-0 opacity-100 scale-[1]"
                  leaveTo="transform translate-y-[-16px] opacity-0 scale-[0.95]"
                >
                  <div className="absolute pt-3 w-full flex flex-col h-fit">
                    <Listbox.Options as="div">
                      {Object.values(stepConfigurations).map((stepConfig) => (
                        <Listbox.Option
                          as="div"
                          className="absolute"
                          key={stepConfig.label}
                          value={stepConfig}
                          testdata-id={`create-single-vest-graded-type-${stepConfig.label.toLowerCase()}`}
                        >
                          {stepConfig.label}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Transition>
              </Listbox>
              <Form.Error message={error?.message} />
            </>
          )}
        />
      </Form.Control>
      <div className="flex gap-6">
        <Form.Control>
          <span
            className={
              _fundSource && balance?.[_fundSource] && totalAmount?.greaterThan(balance[_fundSource])
                ? 'text-red'
                : totalAmount
                ? 'text-slate-50'
                : 'text-slate-500'
            }
          >
            {totalAmount ? totalAmount?.toSignificant(6) : '0.000000'} {totalAmount?.currency.symbol}
          </span>
          <Form.Error message={errors['FORM_ERROR']?.message} />
        </Form.Control>
        <Form.Control>
          {endDate ? (
            <span className="text-slate-50">{format(endDate, 'dd MMM yyyy hh:mmaaa')}</span>
          ) : (
            <span className="italic text-slate-500">Not available</span>
          )}
        </Form.Control>
      </div>
    </Form.Section>
  )
}
