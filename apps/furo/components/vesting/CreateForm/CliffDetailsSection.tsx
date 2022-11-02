import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { Form, Input, Switch } from '@sushiswap/ui'
import { CurrencyInput } from 'components'
import { FC, useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { CreateVestingFormSchemaType } from './schema'

export const CliffDetailsSection: FC = () => {
  const { address } = useAccount()
  const { control, watch, setError, clearErrors, setValue } = useFormContext<CreateVestingFormSchemaType>()
  const [startDate, currency, cliffEnabled, fundSource] = watch([
    'startDate',
    'currency',
    'cliff.cliffEnabled',
    'fundSource',
  ])
  const _fundSource = ZFundSourceToFundSource.parse(fundSource)
  const _currency = useTokenFromZToken(currency)

  const onCurrencyInputError = useCallback(
    (message?: string) => {
      message ? setError('cliff.cliffAmount', { type: 'custom', message }) : clearErrors('cliff.cliffAmount')
    },
    [clearErrors, setError]
  )

  return (
    <Form.Section title="Cliff details" description="Optionally provide cliff details for your vesting">
      <Form.Control label="Enable Cliff">
        <Controller
          name="cliff.cliffEnabled"
          control={control}
          render={({ field: { value } }) => (
            <Switch
              checked={value}
              onChange={(val) => {
                if (val) {
                  setValue('cliff', {
                    cliffEnabled: true,
                    cliffAmount: '',
                    cliffEndDate: null,
                  })
                } else {
                  setValue('cliff', {
                    cliffEnabled: false,
                  })
                }
              }}
              size="sm"
              uncheckedIcon={<XIcon />}
              checkedIcon={<CheckIcon />}
            />
          )}
        />
      </Form.Control>
      {cliffEnabled ? (
        <Form.Control label="Cliff End Date">
          <Controller
            name="cliff.cliffEndDate"
            shouldUnregister={true}
            control={control}
            render={({ field: { onChange, value, name, onBlur }, fieldState: { error } }) => (
              <>
                <Input.DatetimeLocal
                  min={
                    startDate
                      ? new Date(startDate.getTime() + 5 * 60 * 1000)?.toISOString().slice(0, 16)
                      : new Date(Date.now() + 10 * 60 * 1000)?.toISOString().slice(0, 16)
                  }
                  name={name}
                  onBlur={onBlur}
                  onChange={(value) => onChange(new Date(value))}
                  value={value?.toISOString().slice(0, 16) || ''}
                  error={!!error?.message}
                  className="!ring-offset-slate-900"
                />
                <Form.Error message={error?.message} />
              </>
            )}
          />
        </Form.Control>
      ) : (
        <></>
      )}
      {cliffEnabled ? (
        <Form.Control label="Cliff Amount">
          <Controller
            control={control}
            name="cliff.cliffAmount"
            shouldUnregister={true}
            render={({ field: { onChange, value, onBlur, name }, fieldState: { error: validationError } }) => (
              <CurrencyInput
                name={name}
                onBlur={onBlur}
                className="ring-offset-slate-900"
                fundSource={_fundSource}
                account={address}
                onError={onCurrencyInputError}
                errorMessage={validationError?.message}
                value={value || ''}
                onChange={onChange}
                currency={_currency}
              />
            )}
          />
        </Form.Control>
      ) : (
        <></>
      )}
    </Form.Section>
  )
}
