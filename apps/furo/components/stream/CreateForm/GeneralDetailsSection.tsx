import { DateField, FormControl, FormField, FormItem, FormMessage, FormSection, Label } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { CreateMultipleStreamFormSchemaType } from '../schema'

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
                <Label>
                  Start date<sup>*</sup>
                </Label>
                <FormControl>
                  <DateField
                    testId={`stream-start-date${index}`}
                    name={name}
                    onBlur={onBlur}
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
                <Label>
                  End date<sup>*</sup>
                </Label>
                <FormControl>
                  <DateField
                    testId={`stream-end-date${index}`}
                    name={name}
                    onBlur={onBlur}
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
              <Label>
                Recipient<sup>*</sup>
              </Label>
              <FormControl>
                <Web3Input.Ens
                  placeholder="Enter wallet address or ENS"
                  name={name}
                  onBlur={onBlur}
                  testdata-id={`create-stream-recipient-input${index}`}
                  value={value}
                  onValueChange={onChange}
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
