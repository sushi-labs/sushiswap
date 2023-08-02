import { classNames } from '@sushiswap/ui'
import { Label, TextField } from '@sushiswap/ui'
import { DateField } from '@sushiswap/ui'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  FormSection,
} from '@sushiswap/ui/components/form'
import { Switch } from '@sushiswap/ui/components/switch'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { CreateMultipleVestingFormSchemaType } from '../schema'

export const CliffDetailsSection: FC<{ index: number }> = ({ index }) => {
  const { control, watch } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const [startDate, currency, cliffEnabled] = watch([
    `vestings.${index}.startDate`,
    `vestings.${index}.currency`,
    `vestings.${index}.cliffEnabled`,
  ])

  return (
    <FormSection title="Cliff details" description="Optionally provide cliff details for your vesting">
      <FormField
        name={`vestings.${index}.cliffEnabled`}
        rules={{ deps: [`vestings.${index}.cliffEndDate`, `vestings.${index}.cliffAmount`] }}
        control={control}
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormControl>
              <Switch checked={value} onCheckedChange={onChange} testdata-id={`cliff-toggle-switch${index}`} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className={classNames(cliffEnabled ? 'block' : 'hidden')}>
        <FormField
          name={`vestings.${index}.cliffEndDate`}
          rules={{ deps: [`vestings.${index}.startDate`] }}
          control={control}
          render={({ field: { name, onChange, value, onBlur } }) => {
            return (
              <FormItem>
                <Label>
                  Cliff end date<sup>*</sup>
                </Label>
                <FormControl>
                  <DateField
                    testId={`create-single-vest-cliff-date${index}`}
                    name={name}
                    onBlur={onBlur}
                    onChange={onChange}
                    selected={value}
                    portalId="root-portal"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    startDate={
                      startDate ? new Date(startDate.getTime() + 5 * 60 * 1000) : new Date(Date.now() + 10 * 60 * 1000)
                    }
                    minDate={
                      startDate ? new Date(startDate.getTime() + 5 * 60 * 1000) : new Date(Date.now() + 10 * 60 * 1000)
                    }
                    dateFormat="MMM d, yyyy HH:mm"
                    placeholderText="Select date"
                    autoComplete="off"
                  />
                </FormControl>
                <FormDescription>The end date of the cliff.</FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
      <div className={classNames(cliffEnabled ? 'block' : 'hidden')}>
        <FormField
          control={control}
          name={`vestings.${index}.cliffAmount`}
          render={({ field: { onChange, value, onBlur, name } }) => {
            return (
              <FormItem>
                <Label>
                  Amount
                  <sup>*</sup>
                </Label>
                <FormControl>
                  <TextField
                    type="number"
                    onValueChange={onChange}
                    value={value}
                    name={name}
                    onBlur={onBlur}
                    testdata-id={`create-single-vest-cliff-amount-input${index}`}
                    unit={currency?.symbol}
                  />
                </FormControl>
                <FormDescription>The amount that gets unlocked after the cliff end date.</FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
    </FormSection>
  )
}
