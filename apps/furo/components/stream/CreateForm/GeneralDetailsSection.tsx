import { Form } from '@sushiswap/ui'
import React, { FC, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@sushiswap/ui/future/components/input'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { CreateMultipleStreamFormSchemaType } from '../schema'

interface GeneralDetailsSection {
  index: number
}

export const GeneralDetailsSection: FC<GeneralDetailsSection> = ({ index }) => {
  const { control, watch, setError, clearErrors } = useFormContext<CreateMultipleStreamFormSchemaType>()
  const [startDate, endDate] = watch([`streams.${index}.dates.startDate`, `streams.${index}.dates.endDate`])

  useEffect(() => {
    if (startDate && startDate.getTime() <= new Date(Date.now() + 5 * 60 * 1000).getTime()) {
      setError(`streams.${index}.dates.startDate`, {
        type: 'custom',
        message: 'Must be at least 5 minutes from now',
      })
    } else {
      clearErrors(`streams.${index}.dates.startDate`)
    }
  }, [clearErrors, index, setError, startDate])

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      setError(`streams.${index}.dates.endDate`, {
        type: 'custom',
        message: 'Must be later than start date',
      })
    } else {
      clearErrors(`streams.${index}.dates.endDate`)
    }
  }, [clearErrors, endDate, index, setError, startDate])

  return (
    <Form.Section
      title="General Details"
      description="Furo allows you to create a vested or non vested stream using your wallet or BentoBox balance."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Form.Control>
          <Controller
            control={control}
            name={`streams.${index}.dates.startDate`}
            render={({ field: { name, onChange, value, onBlur }, fieldState: { error } }) => {
              return (
                <Input.DatePicker
                  name={name}
                  onBlur={onBlur}
                  customInput={
                    <Input.DatePickerCustomInput
                      isError={Boolean(error?.message)}
                      caption={error?.message}
                      testdata-id={`stream-start-date${index}`}
                      id={`stream-start-date${index}`}
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
                  testdata-id={'TEST'}
                />
              )
            }}
          />
        </Form.Control>
        <Form.Control>
          <Controller
            control={control}
            name={`streams.${index}.dates.endDate`}
            render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
              return (
                <Input.DatePicker
                  name={name}
                  onBlur={onBlur}
                  customInput={
                    <Input.DatePickerCustomInput
                      isError={Boolean(error?.message)}
                      caption={error?.message}
                      testdata-id={`stream-end-date${index}`}
                      id={`stream-end-date${index}`}
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
          name={`streams.${index}.recipient`}
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
                id={`create-stream-recipient-input${index}`}
                testdata-id={`create-stream-recipient-input${index}`}
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
