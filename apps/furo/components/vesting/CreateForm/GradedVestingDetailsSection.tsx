import { tryParseAmount } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { Form, Input, Select, Typography } from '@sushiswap/ui'
import { CurrencyInput } from 'components'
import { CreateVestingFormData, stepConfigurations } from 'components/vesting'
import { format } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { useWalletBalance } from '../../../lib'

export const GradedVestingDetailsSection = () => {
  const { address } = useAccount()
  const { control, watch, setError, clearErrors } = useFormContext<CreateVestingFormData>()

  const [currency, stepConfig, cliff, cliffAmount, cliffEndDate, startDate, stepPayouts, stepAmount, fundSource] =
    // @ts-ignore
    watch([
      'currency',
      'stepConfig',
      'cliff',
      'cliffAmount',
      'cliffEndDate',
      'startDate',
      'stepPayouts',
      'stepAmount',
      'fundSource',
    ])

  const { data: balance } = useWalletBalance(address, currency, fundSource)

  const endDate =
    ((cliff && cliffEndDate) || startDate) && stepPayouts
      ? new Date(
          new Date(cliff && cliffEndDate ? cliffEndDate : startDate).getTime() + stepConfig.time * stepPayouts * 1000
        )
      : undefined

  const totalAmount = useMemo(() => {
    if (!currency || !stepPayouts) return undefined

    const cliff = tryParseAmount(cliffAmount?.toString(), currency)
    const totalStep = tryParseAmount(stepAmount?.toString(), currency)?.multiply(JSBI.BigInt(stepPayouts))

    if (cliff && !totalStep) return cliff
    if (!cliff && totalStep) return totalStep
    if (cliff && totalStep) return totalStep.add(cliff)

    return undefined
  }, [cliffAmount, stepAmount, stepPayouts, currency])

  useEffect(() => {
    if (!totalAmount || !balance) return
    if (totalAmount.greaterThan(balance)) {
      setError('insufficientBalance', { type: 'custom', message: 'Insufficient Balance' })
    } else {
      clearErrors('insufficientBalance')
    }
  }, [balance, clearErrors, setError, totalAmount])

  return (
    <Form.Section title="Graded Vesting Details" description="Optionally provide graded vesting details">
      <Form.Control label="Payout per Period">
        <Controller
          control={control}
          name="stepAmount"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CurrencyInput.Base
              inputClassName="!px-4 py-[10px]"
              onChange={onChange}
              value={value}
              currency={currency}
              error={!!error?.message}
              helperTextPanel={
                <CurrencyInput.HelperTextPanel
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
        <Form.Control label="Amount of Periods">
          <Controller
            control={control}
            name="stepPayouts"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input.Counter step={1} min={0} max={100} onChange={onChange} value={value} error={!!error?.message} />
                <Form.Error message={error?.message} />
              </>
            )}
          />
        </Form.Control>
        <Form.Control label="Period Length">
          <Controller
            control={control}
            name="stepConfig"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Select
                  error={!!error?.message}
                  button={<Select.Button>{value.label}</Select.Button>}
                  value={value}
                  onChange={onChange}
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
      <Form.Control label="Total Amount">
        <Controller
          control={control}
          name="insufficientBalance"
          render={({ fieldState: { error } }) => (
            <>
              <Typography
                variant="sm"
                className={
                  balance && totalAmount?.greaterThan(balance)
                    ? 'text-red'
                    : totalAmount
                    ? 'text-slate-50'
                    : 'text-slate-500'
                }
                weight={totalAmount ? 700 : 400}
              >
                {totalAmount ? totalAmount?.toSignificant(6) : '0.000000'} {totalAmount?.currency.symbol}
              </Typography>
              <Form.Error message={error?.message} />
            </>
          )}
        />
      </Form.Control>
      <Form.Control label="End Date">
        {endDate ? (
          <Typography variant="sm" className="text-slate-50" weight={700}>
            {format(endDate, 'dd MMM yyyy hh:maaa')}
          </Typography>
        ) : (
          <Typography variant="sm" className="italic text-slate-500">
            Not available
          </Typography>
        )}
      </Form.Control>
    </Form.Section>
  )
}
