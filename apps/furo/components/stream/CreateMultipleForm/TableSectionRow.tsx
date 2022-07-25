import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { DuplicateIcon, MinusCircleIcon } from '@heroicons/react/solid'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_RING, ERROR_INPUT_CLASSNAME, IconButton, Input, Select } from '@sushiswap/ui'
import { TokenSelector, Web3Input } from '@sushiswap/wagmi'
import React, { FC, useState } from 'react'
import { Control, Controller, useFormContext, useWatch } from 'react-hook-form'
import { useNetwork } from 'wagmi'

import { useCustomTokens } from '../../../lib/state/storage'
import { useTokens } from '../../../lib/state/token-lists'
import { CurrencyInput } from '../../CurrencyInput'
import { CreateMultipleStreamFormData, CreateStreamFormData } from '../types'

interface TableSectionRow {
  control: Control<CreateMultipleStreamFormData>
  index: number
  onRemove(index: number): void
  onCopy(payload: CreateStreamFormData): void
}

export const TableSectionRow: FC<TableSectionRow> = ({ control, index, onRemove, onCopy }) => {
  const { chain: activeChain } = useNetwork()
  const tokenMap = useTokens(activeChain?.id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(activeChain?.id)

  const { setValue } = useFormContext<CreateMultipleStreamFormData>()
  const data = useWatch<CreateStreamFormData>({
    name: `streams.${index}`,
    control,
  } as never)

  return (
    <div className="relative grid grid-cols-[120px_110px_110px_192px_185px_185px_60px] gap-y-3 gap-x-2 px-2 py-0.5">
      <div className="flex flex-col gap-2">
        <Controller
          control={control as never}
          name={`streams.${index}.currency`}
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
                      setValue(`streams.${index}.fundSource`, FundSource.WALLET)
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
          name={`streams.${index}.fundSource`}
          render={({ field: { onChange } }) => (
            <Select
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
          name={`streams.${index}.amount`}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <CurrencyInput.Base
                onChange={onChange}
                value={value}
                currency={data?.currency as Type | undefined}
                error={!!error?.message}
                hideSymbol={true}
                className="ring-offset-slate-700 bg-transparent shadow-none h-full !rounded-md"
              />
            )
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Controller
          control={control as never}
          name={`streams.${index}.recipient`}
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
          name={`streams.${index}.startDate`}
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
        <Controller
          control={control as never}
          name={`streams.${index}.endDate`}
          render={({ field: { onChange }, fieldState: { error } }) => {
            return (
              <Input.DatetimeLocal
                className="w-full truncate !ring-offset-0 !shadow-none rounded-md h-[54px] flex justify-center !bg-slate-700 !text-sm"
                value={data?.endDate}
                onChange={onChange}
                error={!!error?.message}
              />
            )
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <IconButton onClick={() => onRemove(index)}>
            <MinusCircleIcon width={20} height={20} className="text-red" />
          </IconButton>
        </div>
        <div className="flex items-center">
          <IconButton onClick={() => onCopy({ ...data, recipient: undefined } as CreateStreamFormData)}>
            <DuplicateIcon width={20} height={20} className="text-slate-300" />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
