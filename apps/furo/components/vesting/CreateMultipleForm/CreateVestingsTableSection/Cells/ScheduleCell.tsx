import { CheckIcon, PencilIcon, XIcon } from '@heroicons/react/outline'
import { FundSource } from '@sushiswap/hooks'
import {
  Button,
  classNames,
  DEFAULT_INPUT_CLASSNAME,
  Drawer,
  ERROR_INPUT_CLASSNAME,
  Form,
  IconButton,
  Input,
  Select,
  Switch,
  Typography,
} from '@sushiswap/ui'
import { DatePicker } from '@sushiswap/ui/input/DatePicker'
import { format } from 'date-fns'
import React, { FC, useCallback, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from '@sushiswap/wagmi'

import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../../../lib/zod'
import { CurrencyInput, CurrencyInputBase, HelperTextPanel } from '../../../../CurrencyInput'
import { stepConfigurations } from '../../../CreateForm'
import { calculateEndDate } from '../../../utils'
import { CreateMultipleVestingFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const ScheduleCell: FC<CellProps> = ({ row, index }) => {
  const { address } = useAccount()
  const {
    watch,
    control,
    resetField,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const formData = watch(`vestings.${index}`)
  const { currency, fundSource, stepConfig, startDate, cliff } = formData
  const _fundSource = ZFundSourceToFundSource.parse(fundSource) as FundSource
  const _currency = useTokenFromZToken(currency)
  const endDate = calculateEndDate(formData)
  const cliffEndDate = cliff.cliffEnabled ? cliff.cliffEndDate : undefined

  const onCurrencyInputError = useCallback(
    (message?: string) => {
      message
        ? setError(`vestings.${index}.cliff.cliffAmount`, {
            type: 'custom',
            message,
          })
        : clearErrors(`vestings.${index}.cliff.cliffAmount`)
    },
    [clearErrors, index, setError]
  )

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
    <Drawer.Root>
      {({ setOpen }) => {
        return (
          <>
            <Drawer.Button>
              <div
                className={classNames(
                  errors?.vestings?.[index]?.cliff ? 'border-red' : 'border-transparent',
                  'border-0 !border-b-[1px] h-[37px] flex items-center'
                )}
              >
                <IconButton as="div" className={classNames('py-0.5 px-1 flex items-center gap-2')}>
                  <span className="text-sm font-medium">
                    {row.cliff.cliffEnabled
                      ? `Cliff, ${row.stepConfig?.label}`
                      : row.stepConfig?.label
                      ? row.stepConfig?.label
                      : 'Edit'}
                  </span>
                  <PencilIcon width={16} height={16} />
                </IconButton>
              </div>
            </Drawer.Button>
            <Drawer.Panel>
              <div className="flex items-center justify-between py-4">
                <Typography variant="lg" weight={500}>
                  Vesting Details
                </Typography>
                <IconButton onClick={() => setOpen(false)}>
                  <XIcon width={24} height={24} className="text-slate-200" />
                </IconButton>
              </div>
              <div className="">
                <div className="flex flex-col py-4">
                  <div className="flex flex-col gap-6">
                    <div className="border-b border-slate-200/5" />
                    <Typography weight={500}>Cliff</Typography>
                    <Form.Control label="Enable Cliff">
                      <Controller
                        name={`vestings.${index}.cliff.cliffEnabled`}
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return (
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
                              uncheckedIcon={<XIcon />}
                              checkedIcon={<CheckIcon />}
                            />
                          )
                        }}
                      />
                    </Form.Control>
                    <Form.Control disabled={!cliff.cliffEnabled} label="Cliff End Date">
                      <Controller
                        name={`vestings.${index}.cliff.cliffEndDate`}
                        control={control}
                        render={({ field: { onChange, value, name, onBlur }, fieldState: { error } }) => {
                          return (
                            <>
                              <DatePicker
                                name={name}
                                onBlur={onBlur}
                                className={classNames(
                                  DEFAULT_INPUT_CLASSNAME,
                                  error ? ERROR_INPUT_CLASSNAME : '',
                                  '!ring-offset-slate-900'
                                )}
                                onChange={onChange}
                                selected={value}
                                portalId="root-portal"
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                minDate={
                                  startDate
                                    ? new Date(startDate.getTime() + 5 * 60 * 1000)
                                    : new Date(Date.now() + 10 * 60 * 1000)
                                }
                                dateFormat="MMM d, yyyy HH:mm"
                                placeholderText="Select date"
                                autoComplete="off"
                              />
                              <Form.Error message={error?.message} />
                            </>
                          )
                        }}
                      />
                    </Form.Control>
                    <Form.Control disabled={!cliff.cliffEnabled} label="Cliff Amount">
                      <Controller
                        control={control}
                        name={`vestings.${index}.cliff.cliffAmount`}
                        render={({
                          field: { onChange, value, onBlur, name },
                          fieldState: { error: validationError },
                        }) => (
                          <CurrencyInput
                            id="create-multiple-vest"
                            name={name}
                            onBlur={onBlur}
                            className="ring-offset-slate-900"
                            fundSource={_fundSource}
                            account={address}
                            onError={onCurrencyInputError}
                            errorMessage={validationError?.message}
                            value={value || ''}
                            onChange={onChange}
                            currency={_currency}
                          />
                        )}
                      />
                    </Form.Control>
                    <div className="border-b border-slate-200/5" />
                    <Typography weight={500}>Graded Vesting Details</Typography>
                    <Form.Control label="Payout per Period*">
                      <Controller
                        control={control}
                        name={`vestings.${index}.stepAmount`}
                        render={({ field: { onChange, value, name, onBlur }, fieldState: { error } }) => (
                          <CurrencyInputBase
                            className="ring-offset-slate-900"
                            onChange={onChange}
                            value={value || ''}
                            currency={_currency}
                            error={!!error?.message}
                            name={name}
                            onBlur={onBlur}
                            helperTextPanel={
                              <HelperTextPanel
                                text={
                                  error?.message ? (
                                    error.message
                                  ) : (
                                    <>
                                      The amount the recipient receives after every period. For a value of {value} and a{' '}
                                      {stepConfig?.label.toLowerCase()} period length, the user will receive {value}{' '}
                                      {currency?.symbol} {stepConfig?.label.toLowerCase()}.
                                    </>
                                  )
                                }
                                isError={!!error?.message}
                              />
                            }
                          />
                        )}
                      />
                    </Form.Control>
                    <div className="flex gap-6">
                      <Form.Control label="Amount of Periods*">
                        <Controller
                          control={control}
                          name={`vestings.${index}.stepPayouts`}
                          render={({ field: { onChange, value, name, onBlur }, fieldState: { error } }) => {
                            return (
                              <>
                                <Input.Counter
                                  name={name}
                                  onBlur={onBlur}
                                  step={1}
                                  min={0}
                                  max={100}
                                  onChange={(val) => onChange(Number(val) > 0 ? Number(val) : 1)}
                                  value={value}
                                  error={!!error?.message}
                                  className="ring-offset-slate-900"
                                />
                                <Form.Error message={error?.message} />
                              </>
                            )
                          }}
                        />
                      </Form.Control>
                      <Form.Control label="Period Length*">
                        <Controller
                          control={control}
                          name={`vestings.${index}.stepConfig`}
                          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                            <>
                              <Select
                                button={
                                  <Select.Button error={!!error?.message} className="ring-offset-slate-900">
                                    {value.label}
                                  </Select.Button>
                                }
                                value={value}
                                onChange={(val: any) => {
                                  onChange(val)
                                  onBlur()
                                }}
                              >
                                <Select.Options>
                                  {Object.values(stepConfigurations).map((stepConfig) => (
                                    <Select.Option key={stepConfig.label} value={stepConfig}>
                                      {stepConfig.label}
                                    </Select.Option>
                                  ))}
                                </Select.Options>
                              </Select>
                              <Form.Error message={error?.message} />
                            </>
                          )}
                        />
                      </Form.Control>
                    </div>
                    <div className="border-b border-slate-200/5" />
                    <Form.Control label="End Date">
                      {endDate instanceof Date && !isNaN(endDate?.getTime()) ? (
                        <Typography variant="sm" className="text-slate-50" weight={500}>
                          {format(endDate, 'dd MMM yyyy hh:mmaaa')}
                        </Typography>
                      ) : (
                        <Typography variant="sm" className="italic text-slate-500">
                          Not available
                        </Typography>
                      )}
                    </Form.Control>
                    <Button type="button" onClick={() => setOpen(false)} size="md" className="block px-6 sm:hidden">
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </Drawer.Panel>
          </>
        )
      }}
    </Drawer.Root>
  )
}
