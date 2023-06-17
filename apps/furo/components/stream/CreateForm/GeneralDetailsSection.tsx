import { Form } from '@sushiswap/ui'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@sushiswap/ui/future/components/input'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { CreateMultipleStreamFormSchemaType } from '../schema'

interface GeneralDetailsSection {
  index: number
}

export const GeneralDetailsSection: FC<GeneralDetailsSection> = ({ index }) => {
  const { control, watch } = useFormContext<CreateMultipleStreamFormSchemaType>()
  const [startDate] = watch([`streams.${index}.dates.startDate`])

  return (
    <Form.Section
      title="General Details"
      description="Furo allows you to create a vested or non vested stream using your wallet or BentoBox balance."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Form.Control>
          <Controller
            control={control}
            rules={{ deps: [`streams.${index}.dates.endDate`] }}
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
            rules={{ deps: [`streams.${index}.dates.endDate`] }}
            name={`streams.${index}.dates.endDate`}
            render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
              const minDate = startDate
                ? new Date(startDate.getTime() + 5 * 60 * 1000)
                : new Date(Date.now() + 10 * 60 * 1000)

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
                  minDate={new Date(Date.now()) > minDate ? new Date(Date.now() + 10 * 60 * 1000) : minDate}
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
