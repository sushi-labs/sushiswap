import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@sushiswap/chain'
import { Button, GenericTable, Typography } from '@sushiswap/ui'
import { getCoreRowModel, RowData, useReactTable } from '@tanstack/react-table'
import React, { FC } from 'react'
import { FieldError, FieldErrors, useFieldArray, UseFieldArrayRemove, useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../../lib'
import { CREATE_VEST_DEFAULT_VALUES, CreateVestingFormSchemaType } from '../../CreateForm'
import { useImportErrorContext } from '../ImportErrorContext'
import { CreateMultipleVestingFormSchemaType } from '../schema'
import {
  ACTIONS_COLUMN,
  CURRENCY_COLUMN,
  FUND_SOURCE_COLUMN,
  RECIPIENT_COLUMN,
  SCHEDULE_COLUMN,
  START_DATE_COLUMN,
} from './Cells/columns'

const COLUMNS = [
  CURRENCY_COLUMN,
  RECIPIENT_COLUMN,
  FUND_SOURCE_COLUMN,
  START_DATE_COLUMN,
  SCHEDULE_COLUMN,
  ACTIONS_COLUMN,
] as any

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    chainId: ChainId
    remove: UseFieldArrayRemove
  }
}

interface CreateVestingsTableSection {
  chainId: ChainId
  onReview(): void
}

export const CreateVestingsTableSection: FC<CreateVestingsTableSection> = ({ chainId, onReview }) => {
  const { errors, setErrors } = useImportErrorContext<CreateMultipleVestingFormSchemaType>()
  const {
    control,
    watch,
    formState: { isValid, isValidating, errors: formErrors },
  } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const { append, remove } = useFieldArray({
    control,
    name: 'vestings',
    shouldUnregister: true,
  })

  const fields = watch('vestings')
  const _fields = useDeepCompareMemoize(fields)

  const table = useReactTable<CreateVestingFormSchemaType>({
    data: _fields || [],
    getRowId: (row) => `${row.id}`,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      chainId,
      remove,
    },
  })

  return (
    <div className="flex flex-col col-span-2 gap-4">
      <Typography weight={500}>Vestings</Typography>
      <div className="flex flex-col gap-4">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*@ts-ignore*/}
        <GenericTable table={table} loading={false} placeholder="No positions found" pageSize={fields?.length || 0} />
        {Array.isArray(errors?.vestings) && errors.vestings.length > 0 && (
          <div className="border border-slate-200/5 rounded-xl px-5 py-3 text-sm flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-200/5 pb-3">
              <Typography variant="sm" weight={600}>
                Import Errors
              </Typography>
              <Button onClick={() => setErrors({})} type="button" variant="empty" size="sm" className="!p-0 !h-[unset]">
                Dismiss
              </Button>
            </div>
            <FieldErrorRenderer errors={errors} />
          </div>
        )}
        {Array.isArray(formErrors?.vestings) && formErrors.vestings.length > 0 && (
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
            onClick={() => append({ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() })}
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

const FieldErrorRenderer: FC<{
  errors: FieldErrors<CreateMultipleVestingFormSchemaType>
}> = ({ errors }) => {
  return (
    <>
      {Array.isArray(errors?.vestings) &&
        errors.vestings.length > 0 &&
        errors.vestings.map((el, idx) => {
          if (!el) return
          return (
            <div key={idx}>
              <Typography variant="xs" weight={400} className="text-slate-300 mb-1">
                Vesting {idx + 1}
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
