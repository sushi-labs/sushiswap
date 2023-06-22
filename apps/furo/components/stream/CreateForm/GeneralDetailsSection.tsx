import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@sushiswap/ui/future/components/input'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { CreateMultipleStreamFormSchemaType } from '../schema'
import { FormSection, FormField, FormItem, FormControl, FormMessage } from '@sushiswap/ui/future/components/form'

interface GeneralDetailsSection {
  index: number
}

export const GeneralDetailsSection: FC<GeneralDetailsSection> = ({ index }) => {
  const { control, watch } = useFormContext<CreateMultipleStreamFormSchemaType>()
  const [startDate] = watch([`streams.${index}.dates.startDate`])

  return (
    <FormSection
      title="General Details"
      description="Furo allows you to create a vested or non vested stream using your wallet or BentoBox balance."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={control}
          rules={{ deps: [`streams.${index}.dates.endDate`] }}
          name={`streams.${index}.dates.startDate`}
          render={({ field: { name, onChange, value, onBlur } }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input.DatePicker
                    name={name}
                    onBlur={onBlur}
                    customInput={
                      <Input.DatePickerCustomInput
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
                    startDate={new Date(Date.now() + 5 * 60 * 1000)}
                    minDate={new Date(Date.now() + 5 * 60 * 1000)}
                    dateFormat="MMM d, yyyy HH:mm"
                    placeholderText="Select date"
                    autoComplete="off"
                    testdata-id={'TEST'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={control}
          rules={{ deps: [`streams.${index}.dates.endDate`] }}
          name={`streams.${index}.dates.endDate`}
          render={({ field: { onChange, value, onBlur, name } }) => {
            const minDate = startDate
              ? new Date(startDate.getTime() + 5 * 60 * 1000)
              : new Date(Date.now() + 10 * 60 * 1000)

            return (
              <FormItem>
                <FormControl>
                  <Input.DatePicker
                    name={name}
                    onBlur={onBlur}
                    customInput={
                      <Input.DatePickerCustomInput
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
                    startDate={new Date(Date.now()) > minDate ? new Date(Date.now() + 10 * 60 * 1000) : minDate}
                    minDate={new Date(Date.now()) > minDate ? new Date(Date.now() + 10 * 60 * 1000) : minDate}
                    dateFormat="MMM d, yyyy HH:mm"
                    placeholderText="Select date"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
      <FormField
        control={control}
        name={`streams.${index}.recipient`}
        render={({ field: { onChange, value, onBlur, name } }) => {
          return (
            <FormItem>
              <FormControl>
                <Web3Input.Ens
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </FormSection>
  )
}
