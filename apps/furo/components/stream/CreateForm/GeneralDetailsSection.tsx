import { classNames, DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME, Form } from '@sushiswap/ui'
import { DatePicker } from '@sushiswap/ui/input/DatePicker'
import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateStreamFormSchemaType } from './schema'
import { Input } from '@sushiswap/ui/future/components/input'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'

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
        <Form.Control>
          <Controller
            control={control}
            name="dates.startDate"
            render={({ field: { name, onChange, value, onBlur }, fieldState: { error } }) => {
              return (
                <Input.DatePicker
                  name={name}
                  onBlur={onBlur}
                  customInput={
                    <Input.DatePickerCustomInput
                      isError={Boolean(error?.message)}
                      caption={error?.message}
                      id="stream-update-end-date"
                      label={
                        <>
                          Start date<sup>*</sup>
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
        <Form.Control>
          <Controller
            control={control}
            name="dates.endDate"
            render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
              return (
                <Input.DatePicker
                  name={name}
                  onBlur={onBlur}
                  customInput={
                    <Input.DatePickerCustomInput
                      isError={Boolean(error?.message)}
                      caption={error?.message}
                      id="stream-update-end-date"
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
                  minDate={
                    startDate ? new Date(startDate.getTime() + 5 * 60 * 1000) : new Date(Date.now() + 10 * 60 * 1000)
                  }
                  dateFormat="MMM d, yyyy HH:mm"
                  placeholderText="Select date"
                  autoComplete="off"
                />
              )
            }}
          />
        </Form.Control>
      </div>
      <Form.Control>
        <Controller
          control={control}
          name="recipient"
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <Web3Input.Ens
                isError={Boolean(error?.message)}
                caption={error?.message}
                label={
                  <>
                    Address or ENS<sup>*</sup>
                  </>
                }
                name={name}
                onBlur={onBlur}
                id="recipient"
                value={value}
                onChange={onChange}
              />
            )
          }}
        />
      </Form.Control>
    </Form.Section>
  )
}
