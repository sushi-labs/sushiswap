import { Form } from '@sushiswap/ui'
import React, { FC, useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from '@sushiswap/wagmi'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { CreateVestingFormSchemaType } from './schema'
import { Switch } from '@sushiswap/ui/future/components/Switch'
import { Input } from '@sushiswap/ui/future/components/input'

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
      <Form.Control>
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
              id="cliff-toggle-switch"
            />
          )}
        />
      </Form.Control>
      {cliffEnabled ? (
        <Form.Control>
          <Controller
            name="cliff.cliffEndDate"
            shouldUnregister={true}
            control={control}
            render={({ field: { name, onChange, value, onBlur }, fieldState: { error } }) => {
              return (
                <Input.DatePicker
                  name={name}
                  onBlur={onBlur}
                  customInput={
                    <Input.DatePickerCustomInput
                      isError={Boolean(error?.message)}
                      caption={error?.message ? error?.message : 'The end date of the cliff.'}
                      id="create-single-vest-cliff-date"
                      label={
                        <>
                          End date<sup>*</sup>
                        </>
                      }
                    />
                  }
                  onChange={onChange}
                  selected={value}
                  portalId="root-portal"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  minDate={new Date(Date.now() + 5 * 60 * 1000)}
                  dateFormat="MMM d, yyyy HH:mm"
                  placeholderText="Select date"
                  autoComplete="off"
                />
              )
            }}
          />
        </Form.Control>
      ) : (
        <></>
      )}
      {cliffEnabled ? (
        <Form.Control>
          <Controller
            control={control}
            name="cliff.cliffAmount"
            shouldUnregister={true}
            render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
              return (
                <>
                  <Input.Numeric
                    onUserInput={onChange}
                    isError={Boolean(error?.message)}
                    caption={
                      error?.message ? error?.message : 'The amount that gets unlocked after the cliff end date.'
                    }
                    onBlur={onBlur}
                    name={name}
                    value={value}
                    id="create-single-vest-cliff-amount-input"
                    label={
                      <>
                        Amount<sup>*</sup>
                      </>
                    }
                  />
                </>
              )
            }}
          />
        </Form.Control>
      ) : (
        <></>
      )}
    </Form.Section>
  )
}
