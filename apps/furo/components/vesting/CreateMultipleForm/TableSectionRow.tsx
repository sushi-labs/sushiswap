import { Disclosure, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, PencilIcon, XIcon } from '@heroicons/react/outline'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, classNames, ERROR_INPUT_CLASSNAME, Form, Input, Select, Switch, Typography } from '@sushiswap/ui'
import { TokenSelector, Web3Input } from '@sushiswap/wagmi'
import React, { FC, useState } from 'react'
import { Control, Controller, useFormContext, useWatch } from 'react-hook-form'
import { useNetwork } from 'wagmi'

import { useCustomTokens } from '../../../lib/state/storage'
import { useTokens } from '../../../lib/state/token-lists'
import { CurrencyInput } from '../../CurrencyInput'
import { stepConfigurations } from '../CreateForm'
import { CreateMultipleVestingFormData, CreateVestingFormData } from '../types'

interface TableSectionRow {
  control: Control<CreateMultipleVestingFormData>
  index: number
  onRemove(index: number): void
  onCopy(payload: CreateVestingFormData): void
}

export const TableSectionRow: FC<TableSectionRow> = ({ control, index, onRemove, onCopy }) => {
  const { chain: activeChain } = useNetwork()
  const tokenMap = useTokens(activeChain?.id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(activeChain?.id)

  const { setValue, resetField } = useFormContext<CreateMultipleVestingFormData>()
  const data = useWatch<CreateVestingFormData>({
    name: `vestings.${index}`,
    control,
  } as never)

  return (
    <Disclosure>
      {({ open, close }) => (
        <div className="flex flex-col">
          <div className="relative grid lg:grid-cols-[100px_100px_100px_160px_auto] gap-y-3 gap-x-2 px-2 py-0.5">
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
                          'w-full flex gap-2 items-center h-[54px] px-4 focus-within:ring-1 focus:ring-1 ring-blue rounded-md'
                        )}
                        onClick={() => setDialogOpen(true)}
                      >
                        <span className="text-sm font-bold truncate">{data?.currency?.symbol || 'Select'}</span>
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
                      id={`recipient-${index}`}
                      value={data?.recipient}
                      onChange={onChange}
                      error={!!error?.message}
                      placeholder="0x..."
                      className="rounded-md !ring-offset-0 h-[54px] flex justify-center !bg-slate-700"
                      inputClassName="placeholder:font-bold placeholder-slate-500 !bg-slate-700 !rounded-md !text-sm"
                    />
                  )
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                control={control as never}
                name={`vestings.${index}.fundSource`}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    error={!!error?.message}
                    button={
                      <Listbox.Button
                        type="button"
                        className="w-full flex gap-2 items-center h-[54px] items-center focus-within:ring-1 focus:ring-1 ring-blue rounded-md px-4"
                        value={value}
                      >
                        <span className="text-sm capitalize font-bold truncate">
                          {value?.toLowerCase() || 'Select'}
                        </span>
                        <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                      </Listbox.Button>
                    }
                    value={value}
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
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <Input.DatetimeLocal
                      className="w-full truncate !ring-offset-0 !shadow-none rounded-md h-[54px] flex justify-center !bg-slate-700 !text-sm"
                      value={value}
                      onChange={onChange}
                      error={!!error?.message}
                    />
                  )
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Disclosure.Button type="button" className="flex gap-2 items-center h-full px-4">
                <PencilIcon width={16} height={16} />
                <span className="text-sm font-bold">Edit</span>
              </Disclosure.Button>
            </div>
          </div>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel static>
              <div className="flex gap-5 border-t border-b border-slate-200/5">
                <div className="flex flex-col flex-grow gap-10 p-6">
                  <div className="flex gap-6 items-center">
                    <Typography weight={700} variant="sm">
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
                                resetField(`vestings.${index}.cliffEndDate`)
                                resetField(`vestings.${index}.cliffAmount`)
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
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <>
                            <Input.DatetimeLocal onChange={onChange} value={value} error={!!error?.message} />
                            <Form.Error message={error?.message} />
                          </>
                        )}
                      />
                    </Form.Control>
                    <Form.Control disabled={!data?.cliff} label="Cliff Amount">
                      <Controller
                        control={control}
                        name={`vestings.${index}.cliffAmount`}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <CurrencyInput.Base
                            inputClassName="!px-4 py-[10px]"
                            error={!!error?.message as never}
                            value={value}
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
                            inputClassName="!px-4 py-[10px]"
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
                              button={<Select.Button type="button">{value?.label}</Select.Button>}
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
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}
