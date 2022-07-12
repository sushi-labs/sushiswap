import { Disclosure, Listbox } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, PencilIcon, XIcon } from '@heroicons/react/outline'
import { DuplicateIcon, MinusCircleIcon } from '@heroicons/react/solid'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import {
  Button,
  classNames,
  DEFAULT_INPUT_RING,
  ERROR_INPUT_CLASSNAME,
  Form,
  IconButton,
  Input,
  Select,
  Switch,
  Typography,
} from '@sushiswap/ui'
import { TokenSelector, Web3Input } from '@sushiswap/wagmi'
import React, { FC, useState } from 'react'
import { Control, Controller, useFormContext, useWatch } from 'react-hook-form'
import { useNetwork } from 'wagmi'

import { useCustomTokens } from '../../../lib/state/storage'
import { useTokens } from '../../../lib/state/token-lists'
import { CurrencyInput } from '../../CurrencyInput'
import { stepConfigurations, transformVestingFormData } from '../CreateForm'
import { CreateMultipleVestingFormData, CreateVestingFormData } from '../types'

interface TableSectionRow {
  control: Control<CreateMultipleVestingFormData>
  index: number
  onRemove(index: number): void
  onCopy(payload: CreateVestingFormData): void
  last: boolean
}

export const TableSectionRow: FC<TableSectionRow> = ({ control, index, onRemove, onCopy, last }) => {
  const { chain: activeChain } = useNetwork()
  const tokenMap = useTokens(activeChain?.id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(activeChain?.id)

  const { setValue } = useFormContext<CreateMultipleVestingFormData>()
  const data = useWatch<CreateVestingFormData>({
    name: `vestings.${index}`,
    control,
  } as never) as CreateVestingFormData

  const { totalAmount } = transformVestingFormData(data)

  return (
    <Disclosure>
      {({ close }) => (
        <div className="flex flex-col">
          <div className="relative grid grid-cols-[100px_160px_100px_160px_160px_160px_80px] gap-y-3 gap-x-2 px-2 py-0.5">
            <div className="flex flex-col gap-2">
              <Controller
                control={control as never}
                name={`vestings.${index}.currency`}
                render={({ field: { onChange }, fieldState: { error } }) => {
                  return (
                    <>
                      <button
                        type="button"
                        className={classNames(
                          error?.message ? ERROR_INPUT_CLASSNAME : '',
                          DEFAULT_INPUT_RING,
                          dialogOpen ? 'ring-offset-2 ring-blue' : '',
                          'w-full flex gap-2 items-center h-[54px] px-4 rounded-md ring-offset-slate-700'
                        )}
                        onClick={() => setDialogOpen(true)}
                      >
                        <span className="text-sm font-medium truncate">{data?.currency?.symbol || 'Select'}</span>
                        <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <TokenSelector
                        open={dialogOpen}
                        variant="dialog"
                        chainId={activeChain?.id}
                        tokenMap={tokenMap}
                        customTokenMap={customTokenMap}
                        onSelect={(currency) => {
                          if (currency.isNative) {
                            // @ts-ignore
                            setValue(`vesting.${index}.fundSource`, FundSource.WALLET)
                          }

                          onChange(currency)
                          setDialogOpen(false)
                        }}
                        currency={data?.currency as Type | undefined}
                        onClose={() => setDialogOpen(false)}
                        onAddToken={({ address, chainId, name, symbol, decimals }) =>
                          addCustomToken({ address, name, chainId, symbol, decimals })
                        }
                        onRemoveToken={removeCustomToken}
                      />
                    </>
                  )
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                control={control as never}
                name={`vestings.${index}.recipient`}
                render={({ field: { onChange }, fieldState: { error } }) => {
                  return (
                    <Web3Input.Ens
                      variant="unstyled"
                      id={`recipient-${index}`}
                      value={data?.recipient}
                      onChange={onChange}
                      error={!!error?.message}
                      placeholder="0x..."
                      className="shadow-none rounded-md !ring-offset-0 h-[54px] ring-offset-slate-700 flex justify-center !bg-slate-700"
                      inputClassName="placeholder:font-medium placeholder-slate-500 !bg-slate-700 !rounded-md !text-sm"
                    />
                  )
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                control={control as never}
                name={`vestings.${index}.fundSource`}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <Select
                    error={!!error?.message}
                    button={
                      <Listbox.Button
                        type="button"
                        className={({ open }) =>
                          classNames(
                            DEFAULT_INPUT_RING,
                            open ? 'ring-offset-2 ring-blue' : '',
                            'w-full flex gap-2 items-center h-[54px] items-center rounded-md px-4 ring-offset-slate-700'
                          )
                        }
                        value={data?.fundSource}
                      >
                        <span className="text-sm capitalize font-medium truncate">
                          {data?.fundSource?.toLowerCase() || 'Select'}
                        </span>
                        <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                      </Listbox.Button>
                    }
                    value={data?.fundSource}
                    onChange={onChange}
                  >
                    <Select.Options>
                      <Select.Option key={FundSource.WALLET} value={FundSource.WALLET}>
                        Wallet
                      </Select.Option>
                      <Select.Option key={FundSource.BENTOBOX} value={FundSource.BENTOBOX}>
                        BentoBox
                      </Select.Option>
                    </Select.Options>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                control={control as never}
                name={`vestings.${index}.startDate`}
                render={({ field: { onChange }, fieldState: { error } }) => {
                  return (
                    <Input.DatetimeLocal
                      className="w-full truncate !ring-offset-0 !shadow-none rounded-md h-[54px] flex justify-center !bg-slate-700 !text-sm"
                      value={data?.startDate}
                      onChange={onChange}
                      error={!!error?.message}
                    />
                  )
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="sm" weight={500} className="flex gap-2 items-center h-full px-4">
                {totalAmount ? totalAmount.toSignificant(6) : '0.00'} {totalAmount?.currency.symbol}
              </Typography>
            </div>
            <div className="flex flex-col gap-2">
              <Disclosure.Button className="flex gap-2 items-center h-full px-2" as="div">
                <IconButton className="py-0.5 px-1 flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {data?.cliff
                      ? `Cliff, ${data?.stepConfig?.label}`
                      : data?.stepConfig?.label
                      ? data?.stepConfig?.label
                      : 'Edit'}
                  </span>
                  <PencilIcon width={16} height={16} />
                </IconButton>
              </Disclosure.Button>
            </div>
            <div className="flex items-center gap-2 px-4">
              <div className="flex items-center">
                <IconButton onClick={() => onRemove(index)}>
                  <MinusCircleIcon width={20} height={20} className="text-red" />
                </IconButton>
              </div>
              <div className="flex items-center">
                <IconButton onClick={() => onCopy({ ...data, recipient: '' } as CreateVestingFormData)}>
                  <DuplicateIcon width={20} height={20} className="text-slate-300" />
                </IconButton>
              </div>
            </div>
          </div>
          <Disclosure.Panel className={classNames(last ? 'rounded-b-2xl' : '', 'bg-slate-800')}>
            <div className="flex gap-5">
              <div className="flex flex-col flex-grow gap-10 p-6">
                <div className="flex gap-6 items-center">
                  <Typography weight={500} variant="sm">
                    Vesting Schedule
                  </Typography>
                  <div className="flex gap-2 items-center">
                    <Typography variant="sm" className="text-slate-400">
                      Enable Cliff
                    </Typography>
                    <Controller
                      name={`vestings.${index}.cliff`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Switch
                          checked={value}
                          onChange={(val) => {
                            onChange(val)

                            if (!val) {
                              setValue(`vestings.${index}.cliffEndDate`, null)
                              setValue(`vestings.${index}.cliffAmount`, 0)
                            }
                          }}
                          size="xs"
                          uncheckedIcon={<XIcon />}
                          checkedIcon={<CheckIcon />}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <Form.Control disabled={!data?.cliff} label="Cliff End Date">
                    <Controller
                      name={`vestings.${index}.cliffEndDate`}
                      control={control}
                      render={({ field: { onChange }, fieldState: { error } }) => (
                        <>
                          <Input.DatetimeLocal
                            onChange={onChange}
                            value={data?.cliffEndDate}
                            error={!!error?.message}
                            className="!ring-offset-slate-800"
                          />
                          <Form.Error message={error?.message} />
                        </>
                      )}
                    />
                  </Form.Control>
                  <Form.Control disabled={!data?.cliff} label="Cliff Amount">
                    <Controller
                      control={control}
                      name={`vestings.${index}.cliffAmount`}
                      render={({ field: { onChange }, fieldState: { error } }) => (
                        <CurrencyInput.Base
                          className="ring-offset-slate-800"
                          error={!!error?.message as never}
                          value={data?.cliffAmount}
                          onChange={onChange}
                          currency={data?.currency as Type | undefined}
                        />
                      )}
                    />
                  </Form.Control>
                </div>
                <div className="flex flex-col gap-6 md:flex-row">
                  <Form.Control label="Payout per Period" className="max-w-[240px]">
                    <Controller
                      name={`vestings.${index}.stepAmount`}
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CurrencyInput.Base
                          className="ring-offset-slate-800"
                          onChange={onChange}
                          value={value}
                          currency={data?.currency as Type | undefined}
                          error={!!error?.message}
                          helperTextPanel={
                            <CurrencyInput.HelperTextPanel
                              text={
                                error?.message ? (
                                  error.message
                                ) : (
                                  <>
                                    The amount the recipient receives after every period. For a value of {value} and a{' '}
                                    {data?.stepConfig?.label?.toLowerCase()} period length, the user will receive{' '}
                                    {value} {data?.currency?.symbol} {data?.stepConfig?.label?.toLowerCase()}.
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
                  <Form.Control label="Amount of Periods">
                    <Controller
                      control={control}
                      name={`vestings.${index}.stepPayouts`}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <Input.Counter
                            className="ring-offset-slate-800"
                            step={1}
                            min={0}
                            max={100}
                            onChange={onChange}
                            value={value}
                            error={!!error?.message}
                          />
                          <Form.Error message={error?.message} />
                        </>
                      )}
                    />
                  </Form.Control>
                  <Form.Control label="Period Length">
                    <Controller
                      name={`vestings.${index}.stepConfig`}
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <Select
                            error={!!error?.message}
                            button={
                              <Select.Button className="ring-offset-slate-800" type="button">
                                {value?.label}
                              </Select.Button>
                            }
                            value={value}
                            onChange={onChange}
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
              </div>
              <div className="mr-6 mb-6 flex justify-end items-end">
                <Button type="button" onClick={() => close()} size="sm" className="px-6">
                  Save
                </Button>
              </div>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
