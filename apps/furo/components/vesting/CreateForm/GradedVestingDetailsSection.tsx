import { Form, Input, Select, Typography } from '@sushiswap/ui'
import { _useBalance as useBalance } from '@sushiswap/wagmi'
import { format } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from '@sushiswap/wagmi'

import { useDeepCompareMemoize } from '../../../lib'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { CurrencyInputBase, HelperTextPanel } from '../../CurrencyInput'
import { CreateVestingFormSchemaType, FormErrors, StepConfig, stepConfigurations } from '../../vesting'
import { calculateEndDate, calculateTotalAmount } from '../utils'
import { Chain, ChainId } from '@sushiswap/chain'

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
      <Form.Control label="Payout per Period*">
        <Controller
          control={control}
          name="stepAmount"
          render={({ field: { onChange, value, name, onBlur }, fieldState: { error } }) => (
            <CurrencyInputBase
              className="ring-offset-slate-900"
              onChange={onChange}
              value={value || ''}
              currency={_currency}
              error={!!error?.message}
              name={name}
              onBlur={onBlur}
              helperTextPanel={
                <HelperTextPanel
                  text={
                    error?.message ? (
                      error.message
                    ) : (
                      <>
                        The amount the recipient receives after every period. For a value of {value} and a{' '}
                        {stepConfig?.label.toLowerCase()} period length, the user will receive {value}{' '}
                        {currency?.symbol} {stepConfig?.label.toLowerCase()}.
                      </>
                    )
                  }
                  isError={!!error?.message}
                />
              }
            />
          )}
        />
      </Form.Control>
      <div className="flex flex-col gap-6 md:flex-row">
        <Form.Control label="Amount of Periods*">
          <Controller
            control={control}
            name="stepPayouts"
            render={({ field: { onChange, value, name, onBlur }, fieldState: { error } }) => {
              return (
                <>
                  <Input.Counter
                    name={name}
                    onBlur={onBlur}
                    step={1}
                    min={0}
                    max={100}
                    onChange={(val) => onChange(Number(val) > 0 ? Number(val) : 1)}
                    value={value}
                    error={!!error?.message}
                    className="ring-offset-slate-900"
                  />
                  <Form.Error message={error?.message} />
                </>
              )
            }}
          />
        </Form.Control>
        <Form.Control label="Period Length*">
          <Controller
            control={control}
            name="stepConfig"
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
              <>
                <Select
                  button={
                    <Select.Button error={!!error?.message} className="ring-offset-slate-900">
                      {value.label}
                    </Select.Button>
                  }
                  value={value}
                  onChange={(val: StepConfig) => {
                    onChange(val)
                    onBlur()
                  }}
                >
                  <Select.Options>
                    {Object.values(stepConfigurations).map((stepConfig) => (
                      <Select.Option key={stepConfig.label} value={stepConfig}>
                        {stepConfig.label}
                      </Select.Option>
                    ))}
                  </Select.Options>
                </Select>
                <Form.Error message={error?.message} />
              </>
            )}
          />
        </Form.Control>
      </div>
      <div className="flex gap-6">
        <Form.Control label="Total Amount">
          <Typography
            variant="sm"
            className={
              _fundSource && balance?.[_fundSource] && totalAmount?.greaterThan(balance[_fundSource])
                ? 'text-red'
                : totalAmount
                ? 'text-slate-50'
                : 'text-slate-500'
            }
            weight={600}
          >
            {totalAmount ? totalAmount?.toSignificant(6) : '0.000000'} {totalAmount?.currency.symbol}
          </Typography>
          <Form.Error message={errors['FORM_ERROR']?.message} />
        </Form.Control>
        <Form.Control label="End Date">
          {endDate ? (
            <Typography variant="sm" className="text-slate-50" weight={600}>
              {format(endDate, 'dd MMM yyyy hh:mmaaa')}
            </Typography>
          ) : (
            <Typography variant="sm" className="italic text-slate-500">
              Not available
            </Typography>
          )}
        </Form.Control>
      </div>
    </Form.Section>
  )
}
