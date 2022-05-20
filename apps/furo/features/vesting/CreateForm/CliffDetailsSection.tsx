import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { Form, Input, Switch, Typography } from '@sushiswap/ui'
import { CurrencyInput } from 'components/CurrencyInput'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { CreateVestingFormData } from '.'

export const CliffDetailsSection: FC = () => {
  const { data: account } = useAccount()
  const { control, watch } = useFormContext<CreateVestingFormData>()
  const [token, cliff, fundSource] = watch(['token', 'cliff', 'fundSource'])

  return (
    <Form.Section title="Cliff details" description="Optionally provide cliff details for your vesting">
      <Form.Control label="Enable Cliff">
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              checked={value}
              onChange={onChange}
              size="sm"
              color="gradient"
              uncheckedIcon={<XIcon />}
              checkedIcon={<CheckIcon />}
            />
          )}
          name="cliff"
        />
      </Form.Control>
      <Form.Control disabled={!cliff} label="Cliff End Date">
        <Controller
          control={control}
          name="cliffEndDate"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Input.DatetimeLocal onChange={onChange} value={value} error={!!error?.message} />
              <Form.Error message={error?.message} />
            </>
          )}
        />
      </Form.Control>
      <Form.Control disabled={!cliff} label="Cliff Amount">
        <Controller
          control={control}
          name="cliffAmount"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <CurrencyInput
                onChange={onChange}
                amount={value}
                token={token}
                account={account?.address}
                fundSource={fundSource}
                error={!!error?.message}
              />
              <Form.Error message={error?.message} />
              {!error?.message && (
                <Typography variant="xs" className="text-slate-500">
                  Amount the recipient receives after the cliff end date
                </Typography>
              )}
            </>
          )}
        />
      </Form.Control>
    </Form.Section>
  )
}
