import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { Form, Input, Switch } from '@sushiswap/ui'
import { CurrencyInput } from 'components'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { CreateVestingFormData } from './types'

export const CliffDetailsSection: FC = () => {
  const { address } = useAccount()
  const { control, watch, resetField, setError } = useFormContext<CreateVestingFormData>()
  // @ts-ignore
  const [currency, cliff, fundSource] = watch(['currency', 'cliff', 'fundSource'])

  return (
    <Form.Section title="Cliff details" description="Optionally provide cliff details for your vesting">
      <Form.Control label="Enable Cliff">
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              checked={value}
              onChange={(val) => {
                onChange(val)

                if (!val) {
                  resetField('cliffEndDate')
                  resetField('cliffAmount')
                }
              }}
              size="sm"
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
          render={({ field: { onChange, value }, fieldState: { error: validationError } }) => (
            <CurrencyInput
              fundSource={fundSource}
              account={address}
              onError={(message) => setError('cliffAmount', { type: 'custom', message })}
              errorMessage={validationError?.message}
              value={value}
              onChange={onChange}
              currency={currency}
              helperTextPanel={({ errorMessage }) => (
                <CurrencyInput.HelperTextPanel
                  isError={!!errorMessage}
                  text={errorMessage ? errorMessage : 'Amount the recipient receives after the cliff end date'}
                />
              )}
            />
          )}
        />
      </Form.Control>
    </Form.Section>
  )
}
