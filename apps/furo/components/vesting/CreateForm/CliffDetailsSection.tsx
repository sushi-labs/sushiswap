import { Form } from '@sushiswap/ui'
import React, { FC, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Switch } from '@sushiswap/ui/future/components/Switch'
import { Input } from '@sushiswap/ui/future/components/input'
import { CreateMultipleVestingFormSchemaType } from '../schema'
import { classNames } from '@sushiswap/ui'

export const CliffDetailsSection: FC<{ index: number }> = ({ index }) => {
  const { control, watch, setValue, clearErrors, setError } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const [currency, cliffEnabled, cliffAmount] = watch([
    `vestings.${index}.currency`,
    `vestings.${index}.cliff.cliffEnabled`,
    `vestings.${index}.cliff.cliffAmount`,
  ])

  useEffect(() => {
    if (cliffEnabled) {
      if (!isNaN(cliffAmount) && +cliffAmount <= 0)
        setError(`vestings.${index}.cliff.cliffAmount`, {
          type: 'custom',
          message: 'Must be at least 0',
        })
    } else {
      clearErrors(`vestings.${index}.cliff.cliffAmount`)
    }
  }, [clearErrors, cliffAmount, cliffEnabled, index, setError])

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
              id={`cliff-toggle-switch${index}`}
            />
          )}
        />
      </Form.Control>
      <Form.Control className={classNames(cliffEnabled ? 'block' : 'hidden')}>
        <Controller
          name={`vestings.${index}.cliff.cliffEndDate`}
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
                minDate={new Date(Date.now() + 5 * 60 * 1000)}
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
          name={`vestings.${index}.cliff.cliffAmount`}
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
