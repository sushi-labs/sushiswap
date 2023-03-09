import { classNames, DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME, Form } from '@sushiswap/ui'
import { DatePicker } from '@sushiswap/ui/input/DatePicker'
import { Web3Input } from '@sushiswap/wagmi'
import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateStreamFormSchemaType } from './schema'

export const GeneralDetailsSection = () => {
  const { control, watch, setError, clearErrors } = useFormContext<CreateStreamFormSchemaType>()
  const [startDate, endDate] = watch(['dates.startDate', 'dates.endDate'])

  useEffect(() => {
    if (startDate && startDate.getTime() <= new Date(Date.now() + 5 * 60 * 1000).getTime()) {
      setError(`dates.startDate`, {
        type: 'custom',
        message: 'Must be at least 5 minutes from now',
      })
    } else {
      clearErrors(`dates.startDate`)
    }
  }, [clearErrors, setError, startDate])

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      setError(`dates.endDate`, {
        type: 'custom',
        message: 'Must be later than start date',
      })
    } else {
      clearErrors(`dates.endDate`)
    }
  }, [clearErrors, endDate, setError, startDate])

  return (
    <Form.Section
      title="General Details"
      description="Furo allows you to create a vested or non vested stream using your wallet or BentoBox balance."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Form.Control label="Start date*">
          <Controller
            control={control}
            name="dates.startDate"
            render={({ field: { name, onChange, value, onBlur }, fieldState: { error } }) => {
              return (
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
                    minDate={new Date(Date.now() + 5 * 60 * 1000)}
                    dateFormat="MMM d, yyyy HH:mm"
                    placeholderText="Select date"
                    autoComplete="off"
                  />
                  <Form.Error message={error?.message} />
                </>
              )
            }}
          />
        </Form.Control>
        <Form.Control label="End date*">
          <Controller
            control={control}
            name="dates.endDate"
            render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
              return (
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
              )
            }}
          />
        </Form.Control>
      </div>
      <Form.Control label="Recipient*">
        <Controller
          control={control}
          name="recipient"
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <Web3Input.Ens
                  name={name}
                  onBlur={onBlur}
                  id="recipient"
                  value={value}
                  onChange={onChange}
                  error={!!error?.message}
                  placeholder="Address or ENS Name"
                  className={classNames(
                    DEFAULT_INPUT_CLASSNAME,
                    error ? ERROR_INPUT_CLASSNAME : '',
                    'ring-offset-slate-900'
                  )}
                />
                <Form.Error message={error?.message} />
              </>
            )
          }}
        />
      </Form.Control>
    </Form.Section>
  )
}
