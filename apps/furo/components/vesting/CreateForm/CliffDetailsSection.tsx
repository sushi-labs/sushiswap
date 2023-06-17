import { Form } from '@sushiswap/ui'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Switch } from '@sushiswap/ui/future/components/Switch'
import { Input } from '@sushiswap/ui/future/components/input'
import { CreateMultipleVestingFormSchemaType } from '../schema'
import { classNames } from '@sushiswap/ui'

export const CliffDetailsSection: FC<{ index: number }> = ({ index }) => {
  const { control, watch } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const [startDate, currency, cliffEnabled] = watch([
    `vestings.${index}.startDate`,
    `vestings.${index}.currency`,
    `vestings.${index}.cliffEnabled`,
  ])

  return (
    <Form.Section title="Cliff details" description="Optionally provide cliff details for your vesting">
      <Form.Control>
        <Controller
          name={`vestings.${index}.cliffEnabled`}
          rules={{ deps: [`vestings.${index}.cliffEndDate`, `vestings.${index}.cliffAmount`] }}
          control={control}
          render={({ field: { value, onChange } }) => (
            <Switch checked={value} onChange={onChange} size="sm" id={`cliff-toggle-switch${index}`} />
          )}
        />
      </Form.Control>
      <Form.Control className={classNames(cliffEnabled ? 'block' : 'hidden')}>
        <Controller
          name={`vestings.${index}.cliffEndDate`}
          rules={{ deps: [`vestings.${index}.startDate`] }}
          control={control}
          render={({ field: { name, onChange, value, onBlur }, fieldState: { error } }) => {
            return (
              <Input.DatePicker
                name={name}
                onBlur={onBlur}
                customInput={
                  <Input.DatePickerCustomInput
                    name={name}
                    isError={Boolean(error?.message)}
                    caption={error?.message ? error?.message : 'The end date of the cliff.'}
                    id={`create-single-vest-cliff-date${index}`}
                    testdata-id={`create-single-vest-cliff-date${index}`}
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
      <Form.Control className={classNames(cliffEnabled ? 'block' : 'hidden')}>
        <Controller
          control={control}
          name={`vestings.${index}.cliffAmount`}
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <Input.Numeric
                  onUserInput={onChange}
                  isError={Boolean(error?.message)}
                  caption={error?.message ? error?.message : 'The amount that gets unlocked after the cliff end date.'}
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  id="create-single-vest-cliff-amount-input"
                  testdata-id={`create-single-vest-cliff-amount-input${index}`}
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
    </Form.Section>
  )
}
