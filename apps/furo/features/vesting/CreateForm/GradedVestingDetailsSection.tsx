import { Form, Input, Select, Typography } from '@sushiswap/ui'
import { CurrencyInput } from 'components'
import { stepConfigurations } from 'features/vesting/CreateForm/schema'
import { CreateVestingFormData } from 'features/vesting/CreateForm/types'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'

export const GradedVestingDetailsSection = () => {
  const { data: account } = useAccount()
  const { control, watch } = useFormContext<CreateVestingFormData>()
  // @ts-ignore
  const [token, fundSource, stepConfig] = watch(['token', 'fundSource', 'stepConfig'])

  return (
    <Form.Section title="Graded Vesting Details" description="Optionally provide graded vesting details">
      <Form.Control label="Payout per Period">
        <Controller
          control={control}
          name="stepAmount"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <CurrencyInput
                onChange={onChange}
                account={account?.address}
                amount={value}
                token={token}
                fundSource={fundSource}
                error={!!error?.message}
              />
              <Form.Error message={error?.message} />
              {!error?.message && (
                <Typography variant="xs" className="text-slate-500">
                  The amount the recipient receives after every period. For a value of 6 and a{' '}
                  {stepConfig?.label.toLowerCase()} period length, the user will receive 6 {token?.symbol}{' '}
                  {stepConfig?.label.toLowerCase()}.
                </Typography>
              )}
            </>
          )}
        />
      </Form.Control>
      <Form.Control label="Amount of Periods">
        <Controller
          control={control}
          name="stepPayouts"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Input.Counter step={1} min={0} onChange={onChange} value={value} error={!!error?.message} />
              <Form.Error message={error?.message} />
              {!error?.message && (
                <Typography variant="xs" className="text-slate-500">
                  In combination with the Period Length, this will determine how long the vesting will run for.
                </Typography>
              )}
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
              {!error?.message && (
                <Typography variant="xs" className="text-slate-500">
                  Unit of time after which a payment becomes available for the recipient.
                </Typography>
              )}
            </>
          )}
        />
      </Form.Control>
    </Form.Section>
  )
}
