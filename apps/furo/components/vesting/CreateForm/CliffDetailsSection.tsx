import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { FundSource } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME, Form, Switch } from '@sushiswap/ui'
import { DatePicker } from '@sushiswap/ui/input/DatePicker'
import React, { FC, useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from '@sushiswap/wagmi'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { CurrencyInput } from '../../CurrencyInput'
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
                <DatePicker
                  name={name}
                  onBlur={onBlur}
                  className={classNames(
                    DEFAULT_INPUT_CLASSNAME,
                    error ? ERROR_INPUT_CLASSNAME : '',
                    '!ring-offset-slate-900'
                  )}
                  onChange={onChange}
                  selected={value}
                  portalId="root-portal"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  minDate={
                    startDate ? new Date(startDate.getTime() + 5 * 60 * 1000) : new Date(Date.now() + 10 * 60 * 1000)
                  }
                  dateFormat="MMM d, yyyy HH:mm"
                  placeholderText="Select date"
                  autoComplete="off"
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
                id="create-single-vest"
                name={name}
                onBlur={onBlur}
                className="ring-offset-slate-900"
                fundSource={_fundSource || FundSource.WALLET}
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
