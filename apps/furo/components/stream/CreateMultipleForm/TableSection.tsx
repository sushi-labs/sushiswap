import { DuplicateIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/solid'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { CircleWithText, Dropzone, Form, IconButton, Input, Select, Typography } from '@sushiswap/ui'
import { TokenSelector, Web3Input } from '@sushiswap/wagmi'
import { FC, useState } from 'react'
import { Control, Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useNetwork } from 'wagmi'

import { useCustomTokens } from '../../../lib/state/storage'
import { useTokens } from '../../../lib/state/token-lists'
import { CurrencyInput } from '../../CurrencyInput'
import { CreateStreamFormData, StreamData } from './types'

interface TableSectionRow {
  control: Control<CreateStreamFormData>
  index: number
  onRemove(index: number): void
  onCopy(payload: StreamData): void
}

export const TableSectionRow: FC<TableSectionRow> = ({ control, index, onRemove, onCopy }) => {
  const { chain: activeChain } = useNetwork()
  const tokenMap = useTokens(activeChain?.id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(activeChain?.id)

  const { setValue } = useFormContext<CreateStreamFormData>()
  const data = useWatch<StreamData>({
    name: `streams.${index}`,
    control,
  } as never)

  return (
    <div className="relative grid lg:grid-cols-[120px_120px_120px_252px_170px_170px] grid-cols-[30px_120px_120px_120px_202px_170px_170px_60px] gap-x-2">
      <div className="lg:absolute top-0 bottom-0 left-[-40px] flex items-center">
        <CircleWithText text={`${index + 1}`} width={22} height={22} fill="currentColor" className="text-slate-700" />
      </div>
      <div className="">
        <Controller
          control={control as never}
          name={`streams.${index}.currency`}
          render={({ field: { onChange }, fieldState: { error } }) => {
            return (
              <>
                <Select.Button
                  error={!!error?.message}
                  standalone
                  className="!cursor-pointer"
                  onClick={() => setDialogOpen(true)}
                >
                  {data?.currency?.symbol || <span className="text-slate-500">Select</span>}
                </Select.Button>
                <Form.Error message={error?.message} />
                <TokenSelector
                  open={dialogOpen}
                  variant="dialog"
                  chainId={activeChain?.id}
                  tokenMap={tokenMap}
                  customTokenMap={customTokenMap}
                  onSelect={(currency) => {
                    if (currency.isNative) {
                      // @ts-ignore
                      setValue(`stream.${index}.fundSource`, FundSource.WALLET)
                    }

                    onChange(currency)
                    setDialogOpen(false)
                  }}
                  currency={data?.currency as Type}
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
      <div className="">
        <Controller
          control={control as never}
          name={`streams.${index}.fundSource`}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Select
              error={!!error?.message}
              button={<Select.Button className="!capitalize">{value?.toLowerCase()}</Select.Button>}
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
      <div className="">
        <Controller
          control={control as never}
          name={`streams.${index}.amount`}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CurrencyInput.Base
              onChange={onChange}
              value={value}
              currency={data?.currency as Type}
              error={!!error?.message}
              inputClassName="!text-sm"
              hideSymbol={true}
            />
          )}
        />
      </div>
      <div className="">
        <Controller
          control={control as never}
          name={`streams.${index}.recipient`}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                <Web3Input.Ens
                  id={`recipient-${index}`}
                  value={value}
                  onChange={onChange}
                  error={!!error?.message}
                  placeholder="Address or ENS Name"
                  className="placeholder:font-bold placeholder-slate-500"
                />
                <Form.Error message={error?.message} />
              </>
            )
          }}
        />
      </div>
      <div className="">
        <Controller
          control={control as never}
          name={`streams.${index}.startDate`}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                <Input.DatetimeLocal value={value} onChange={onChange} error={!!error?.message} />
                <Form.Error message={error?.message} />
              </>
            )
          }}
        />
      </div>
      <div className="">
        <Controller
          control={control as never}
          name={`streams.${index}.endDate`}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                <Input.DatetimeLocal value={value} onChange={onChange} error={!!error?.message} />
                <Form.Error message={error?.message} />
              </>
            )
          }}
        />
      </div>
      <div className="lg:absolute flex items-center gap-2 ml-2 lg:ml-0 lg:right-[-60px] top-0 bottom-0">
        <div className="flex items-center">
          <IconButton onClick={() => onRemove(index)}>
            <MinusCircleIcon width={20} height={20} className="text-red" />
          </IconButton>
        </div>
        <div className="flex items-center">
          <IconButton onClick={() => onCopy({ ...data, recipient: undefined } as StreamData)}>
            <DuplicateIcon width={20} height={20} className="text-slate-300" />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export const TableSection = () => {
  const { control, watch } = useFormContext<CreateStreamFormData>()

  // TODO: cast as never until
  // https://github.com/react-hook-form/react-hook-form/issues/4055#issuecomment-950145092 gets fixed
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'streams',
    shouldUnregister: true,
  } as never)

  return (
    <div className="my-6 space-y-6">
      <Dropzone onDrop={() => {}} />
      <div className="w-full overflow-auto lg:overflow-visible max-w-5xl">
        <div className="grid lg:grid-cols-[120px_120px_120px_252px_170px_170px] grid-cols-[30px_120px_120px_120px_202px_170px_170px_60px] gap-y-3 gap-x-2 border-b border-slate-200/5 py-2">
          <div className="lg:absolute" />
          <Typography variant="sm" weight={700} className="text-slate-500">
            Currency
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Fund Source
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Amount
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Recipient
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Start Date
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            End Date
          </Typography>
          <div className="lg:absolute" />
        </div>
        <div className="flex flex-col gap-2 pt-3">
          {fields.map((field, index) => (
            <TableSectionRow index={index} key={field.id} control={control} onRemove={remove} onCopy={append} />
          ))}
        </div>
      </div>
      <IconButton
        className="mt-2"
        onClick={() => {
          append({
            currency: undefined,
            fundSource: FundSource.WALLET,
            amount: '',
            recipient: '',
            startDate: '',
            endDate: '',
          })
        }}
      >
        <PlusCircleIcon width={24} height={24} />
      </IconButton>
    </div>
  )
}
