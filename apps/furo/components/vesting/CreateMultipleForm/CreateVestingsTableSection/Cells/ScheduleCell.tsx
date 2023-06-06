import { PencilIcon } from '@heroicons/react/outline'
import { classNames, Form } from '@sushiswap/ui'
import React, { FC, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CreateMultipleVestingFormSchemaType } from '../../schema'
import { CellProps } from './types'
import { STEP_CONFIGURATIONS } from '../../../CreateForm'
import {
  Select,
  SelectCaption,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui/components/ui/select'
import { Input } from '@sushiswap/ui/future/components/input'
import { Drawer } from '@sushiswap/ui/future/components/drawer/Drawer'
import { Switch } from '@sushiswap/ui/future/components/switch'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'

export const ScheduleCell: FC<CellProps> = ({ row, index }) => {
  const {
    watch,
    control,
    setError,
    clearErrors,
    resetField,
    formState: { errors },
  } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const formData = watch(`vestings.${index}`)
  const { startDate, cliff } = formData
  const cliffEndDate = cliff.cliffEnabled ? cliff.cliffEndDate : undefined

  // Temporary solution for when Zod fixes conditional validation
  // https://github.com/colinhacks/zod/issues/1394
  useEffect(() => {
    if (startDate && cliffEndDate) {
      if (cliffEndDate < startDate) {
        setError(`vestings.${index}.cliff.cliffEndDate`, {
          type: 'custom',
          message: 'Must be later than start date',
        })
      } else {
        clearErrors(`vestings.${index}.cliff.cliffEndDate`)
      }
    }
  }, [clearErrors, cliffEndDate, index, setError, startDate])

  return (
    <>
      <Form.Control>
        <Controller
          name={`vestings.${index}.cliff.cliffEnabled`}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              checked={value}
              onChange={(val) => {
                onChange(val)

                if (!val) {
                  resetField(`vestings.${index}.cliff.cliffEndDate`)
                  resetField(`vestings.${index}.cliff.cliffAmount`)
                }
              }}
              size="sm"
              id="cliff-toggle-switch"
            />
          )}
        />
      </Form.Control>
      <Form.Control disabled={!cliff.cliffEnabled}>
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
                    id="create-single-vest-cliff-date"
                    label={
                      <>
                        Cliff end date<sup>*</sup>
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
      <Form.Control disabled={!cliff.cliffEnabled}>
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
                  label={
                    <>
                      Cliff unlock amount<sup>*</sup>
                    </>
                  }
                />
              </>
            )
          }}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name={`vestings.${index}.stepAmount`}
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <Input.Numeric
                  onUserInput={onChange}
                  isError={Boolean(error?.message)}
                  caption={error?.message ? error.message : `The amount the recipient receives for every unlock.`}
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  id="create-single-vest-cliff-amount-input"
                  label={
                    <>
                      Payout per unlock<sup>*</sup>
                    </>
                  }
                />
              </>
            )
          }}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name={`vestings.${index}.stepPayouts`}
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <Input.Numeric
                  onUserInput={(val) => onChange(+val)}
                  isError={Boolean(error?.message)}
                  caption={
                    error?.message
                      ? error?.message
                      : 'Defines the number of unlocks, a value of 10 would mean there will be a total of 10 unlocks during the duration of this vest.'
                  }
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  id="create-single-vest-cliff-amount-input"
                  label={
                    <>
                      Number of unlocks<sup>*</sup>
                    </>
                  }
                />
              </>
            )
          }}
        />
      </Form.Control>
      <Form.Control>
        <Controller
          control={control}
          name={`vestings.${index}.stepConfig`}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Select onValueChange={onChange} defaultValue={value}>
                <SelectGroup>
                  <SelectTrigger>
                    <SelectLabel aria-label={value}>
                      Unlock frequency<sup>*</sup>
                    </SelectLabel>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectCaption
                    caption={error?.message ? error?.message : 'The period of time between each unlock'}
                    isError={Boolean(error)}
                  />
                  <SelectContent>
                    {Object.keys(STEP_CONFIGURATIONS).map((stepConfig) => (
                      <SelectItem
                        key={stepConfig}
                        value={stepConfig}
                        testdata-id={`create-single-vest-graded-type-${stepConfig.toLowerCase()}`}
                      >
                        {stepConfig}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectGroup>
              </Select>
            </>
          )}
        />
      </Form.Control>
    </>
  )
}
