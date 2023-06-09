import { Form } from '@sushiswap/ui'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Switch } from '@sushiswap/ui/future/components/Switch'
import { Input } from '@sushiswap/ui/future/components/input'
import { CreateMultipleVestingFormSchemaType } from '../schema'

export const CliffDetailsSection: FC<{ index: number }> = ({ index }) => {
  const { control, watch, setValue } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const [currency, cliffEnabled] = watch([`vestings.${index}.currency`, `vestings.${index}.cliff.cliffEnabled`])

  return (
    <Form.Section title="Cliff details" description="Optionally provide cliff details for your vesting">
      <Form.Control>
        <Controller
          name={`vestings.${index}.cliff.cliffEnabled`}
          control={control}
          render={({ field: { value } }) => (
            <Switch
              checked={value}
              onChange={(val) => {
                if (val) {
                  setValue(`vestings.${index}.cliff`, {
                    cliffEnabled: true,
                    cliffAmount: '',
                    cliffEndDate: null,
                  })
                } else {
                  setValue(`vestings.${index}.cliff`, {
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
            name={`vestings.${index}.cliff.cliffEndDate`}
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
            name={`vestings.${index}.cliff.cliffAmount`}
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
                    testdata-id="create-single-vest-cliff-amount-input"
                    label={
                      <>
                        Amount{currency ? ` (${currency.symbol})` : ''}
                        <sup>*</sup>
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
