import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@sushiswap/chain'
import { Button, GenericTable, Typography } from '@sushiswap/ui'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useMemo } from 'react'
import { FieldError, FieldErrors, useFieldArray, useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../../lib'
import { useImportErrorContext } from '../../../vesting/CreateMultipleForm/ImportErrorContext'
import { CREATE_STREAM_DEFAULT_VALUES, CreateStreamFormSchemaType } from '../../CreateForm'
import { CreateMultipleStreamBaseSchemaFormErrorsType, CreateMultipleStreamFormSchemaType } from '../schema'
import {
  ACTIONS_COLUMN,
  AMOUNT_COLUMN,
  CURRENCY_COLUMN,
  END_DATE_COLUMN,
  FUND_SOURCE_COLUMN,
  RECIPIENT_COLUMN,
  START_DATE_COLUMN,
} from './Cells/columns'

const COLUMNS = [
  CURRENCY_COLUMN,
  AMOUNT_COLUMN,
  RECIPIENT_COLUMN,
  FUND_SOURCE_COLUMN,
  START_DATE_COLUMN,
  END_DATE_COLUMN,
  ACTIONS_COLUMN,
] as any

interface CreateStreamsTableSection {
  chainId: ChainId
  onReview(): void
}

export const CreateStreamsTableSection: FC<CreateStreamsTableSection> = ({ chainId, onReview }) => {
  const { errors, setErrors } = useImportErrorContext<CreateMultipleStreamFormSchemaType>()
  const {
    control,
    watch,
    formState: { isValid, isValidating, errors: formErrors },
  } = useFormContext<CreateMultipleStreamFormSchemaType & CreateMultipleStreamBaseSchemaFormErrorsType>()
  const { append, remove } = useFieldArray({
    control,
    name: 'streams',
    shouldUnregister: true,
  })

  const fields = watch('streams')

  const table = useReactTable<CreateStreamFormSchemaType>({
    data: fields || [],
    getRowId: (row) => `${row.id}`,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      chainId,
      remove,
    },
  })

  const _memoizedErrors = useDeepCompareMemoize(formErrors)
  const _formErrors = useMemo(() => {
    const length = fields?.length || 0
    const data: FieldErrors<CreateMultipleStreamFormSchemaType> = {
      streams: [],
    }
    for (let i = 0; i < length; i++) {
      if (data.streams && _memoizedErrors.streams?.[i]) {
        data.streams[i] = _memoizedErrors.streams[i]
      }

      if (data.streams && _memoizedErrors.FORM_ERRORS?.[i]) {
        data.streams[i] = {
          ...data.streams[i],
          ..._memoizedErrors.FORM_ERRORS[i],
        }
      }
    }

    return data
  }, [fields?.length, _memoizedErrors.FORM_ERRORS, _memoizedErrors.streams])

  const _errors =
    (Array.isArray(errors?.streams) && errors.streams.length > 0) ||
    (Array.isArray(_formErrors?.streams) && _formErrors.streams.length > 0)
  const formValid = isValid && !isValidating && !_errors

  return (
    <div className="flex flex-col col-span-2 gap-4">
      <Typography weight={500}>Streams</Typography>
      <div className="flex flex-col gap-4">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*@ts-ignore*/}
        <GenericTable table={table} loading={false} placeholder="No positions found" pageSize={fields?.length || 0} />
        {Array.isArray(errors?.streams) && errors.streams.length > 0 && (
          <div className="flex flex-col gap-3 px-5 py-3 text-sm border border-slate-200/5 rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/5">
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
        {Array.isArray(_formErrors?.streams) && _formErrors.streams.length > 0 && (
          <div className="flex flex-col gap-3 px-5 py-3 text-sm border border-slate-200/5 rounded-xl">
            <Typography variant="sm" weight={600} className="pb-3 border-b border-slate-200/5">
              Form Errors
            </Typography>
            <FieldErrorRenderer errors={_formErrors} />
          </div>
        )}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="empty"
            size="sm"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={() => append({ ...CREATE_STREAM_DEFAULT_VALUES, id: nanoid() })}
          >
            Add Item
          </Button>
          <Button onClick={onReview} disabled={!formValid} type="submit" className="!px-10">
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
        <div className="w-3 h-3">
          <MinusIcon width={12} height={12} className="text-slate-500" />
        </div>
        {v.message}
      </div>
    </li>
  )
}

const FieldErrorRenderer: FC<{
  errors: FieldErrors<CreateMultipleStreamFormSchemaType>
}> = ({ errors }) => {
  return (
    <>
      {Array.isArray(errors?.streams) &&
        errors.streams.length > 0 &&
        errors.streams.map((el, idx) => {
          if (!el) return
          return (
            <div key={idx}>
              <Typography variant="xs" weight={400} className="mb-1 text-slate-300">
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
