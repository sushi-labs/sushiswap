import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Button, GenericTable, Typography } from '@sushiswap/ui'
import { getCoreRowModel, RowData, useReactTable } from '@tanstack/react-table'
import React, { Dispatch, FC, SetStateAction } from 'react'
import {
  FieldError,
  FieldErrors,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form'

import { CreateStreamBaseSchemaType } from '../../CreateForm'
import { CreateMultipleStreamBaseSchemaType } from '../schema'
import {
  ACTIONS_COLUMN,
  AMOUNT_COLUMN,
  CURRENCY_COLUMN,
  END_DATE_COLUMN,
  FUND_SOURCE_COLUMN,
  RECIPIENT_COLUMN,
  START_DATE_COLUMN,
} from './Cells/columns'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [
  CURRENCY_COLUMN,
  AMOUNT_COLUMN,
  RECIPIENT_COLUMN,
  FUND_SOURCE_COLUMN,
  START_DATE_COLUMN,
  END_DATE_COLUMN,
  ACTIONS_COLUMN,
]

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    chainId: ChainId
    append: UseFieldArrayAppend<CreateStreamBaseSchemaType>
    remove: UseFieldArrayRemove
    importErrors: FieldErrors<CreateMultipleStreamBaseSchemaType>
    setImportErrors: Dispatch<SetStateAction<FieldErrors<CreateMultipleStreamBaseSchemaType>>>
  }
}

interface CreateStreamsTableSection {
  chainId: ChainId
  onReview(): void
  importErrors: FieldErrors<CreateMultipleStreamBaseSchemaType>
  onDismissErrors(): void
  setImportErrors: Dispatch<SetStateAction<FieldErrors<CreateMultipleStreamBaseSchemaType>>>
}

export const CreateStreamsTableSection: FC<CreateStreamsTableSection> = ({
  chainId,
  onReview,
  importErrors,
  onDismissErrors,
  setImportErrors,
}) => {
  const {
    control,
    watch,
    formState: { isValid, isValidating, errors: formErrors },
  } = useFormContext<CreateMultipleStreamBaseSchemaType>()
  const { append, remove } = useFieldArray({
    control,
    name: 'streams',
    shouldUnregister: true,
  })

  const fields = watch('streams')

  const table = useReactTable<CreateStreamBaseSchemaType>({
    data: fields,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      chainId,
      append,
      remove,
      importErrors,
      setImportErrors,
    },
  })

  return (
    <div className="flex flex-col col-span-2 gap-4">
      <Typography weight={500}>Streams</Typography>
      <div className="flex flex-col gap-4">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*@ts-ignore*/}
        <GenericTable<CreateStreamBaseSchemaType>
          table={table}
          loading={false}
          placeholder="No positions found"
          pageSize={fields.length}
        />
        {Array.isArray(importErrors?.streams) && importErrors.streams.length > 0 && (
          <div className="border border-slate-200/5 rounded-xl px-5 py-3 text-sm flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-200/5 pb-3">
              <Typography variant="sm" weight={600}>
                Import Errors
              </Typography>
              <Button onClick={onDismissErrors} type="button" variant="empty" size="sm" className="!p-0 !h-[unset]">
                Dismiss
              </Button>
            </div>
            <FieldErrorRenderer errors={importErrors} />
          </div>
        )}
        {Array.isArray(formErrors?.streams) && formErrors.streams.length > 0 && (
          <div className="border border-slate-200/5 rounded-xl px-5 py-3 text-sm flex flex-col gap-3">
            <Typography variant="sm" weight={600} className="border-b border-slate-200/5 pb-3">
              Form Errors
            </Typography>
            <FieldErrorRenderer errors={formErrors} />
          </div>
        )}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="empty"
            size="sm"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={() => append({})}
          >
            Add Item
          </Button>
          <Button onClick={onReview} disabled={!isValid || isValidating} type="submit" className="!px-10">
            Review
          </Button>
        </div>
      </div>
    </div>
  )
}

const Error: FC<{ k: string; v: FieldError }> = ({ k, v }) => {
  return (
    <li className="list-item">
      <div className="inline-flex items-center gap-1 text-sm font-medium text-slate-200">
        <div className="uppercase text-[10px] font-semibold text-slate-400">{k.toLowerCase()}</div>
        <div className="h-3 w-3">
          <MinusIcon width={12} height={12} className="text-slate-500" />
        </div>
        {v.message}
      </div>
    </li>
  )
}

const FieldErrorRenderer: FC<{ errors: FieldErrors<CreateMultipleStreamBaseSchemaType> }> = ({ errors }) => {
  return (
    <>
      {Array.isArray(errors?.streams) &&
        errors.streams.length > 0 &&
        errors.streams.map((el, idx) => {
          if (!el) return
          return (
            <div key={idx}>
              <Typography variant="xs" weight={400} className="text-slate-300 mb-1">
                Stream {idx + 1}
              </Typography>
              <ul className="!list-disc !list-inside">
                {Object.entries(el).map(([k, v]: [k: string, v: any]) => {
                  if (k === 'dates') {
                    return Object.entries(v).map(([i, j]: [i: string, j: any]) => {
                      return <Error key={`${idx}-${i}-${j}`} k={i} v={j} />
                    })
                  }
                  return <Error key={`${idx}-${k}`} k={k} v={v} />
                })}
              </ul>
            </div>
          )
        })}
    </>
  )
}
