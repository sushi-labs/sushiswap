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
  const [token, fundSource] = watch(['token', 'fundSource'])

  return (
    <Form.Section title="Graded Vesting Details" description="Optionally provide graded vesting details">
      <Form.Control label="Graded Vesting End Date">
        <Controller
          control={control}
          name="stepEndDate"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Input.DatetimeLocal onChange={onChange} value={value} error={!!error?.message} />
              <Form.Error message={error?.message} />
            </>
          )}
        />
      </Form.Control>
      <Form.Control label="Payment Frequency">
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
      <Form.Control label="Payout Per Frequency">
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
                  Amount the recipient receives after the graded vesting end date
                </Typography>
              )}
            </>
          )}
        />
      </Form.Control>
    </Form.Section>
  )
}
