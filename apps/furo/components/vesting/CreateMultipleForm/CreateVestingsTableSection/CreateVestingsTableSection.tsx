import { PlusIcon } from '@heroicons/react/solid'
import { nanoid } from 'nanoid'
import { ChainId } from '@sushiswap/chain'
import { RowData } from '@tanstack/react-table'
import React, { FC, useMemo } from 'react'
import { FieldErrors, useFieldArray, UseFieldArrayRemove, useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../../lib'
import { CREATE_VEST_DEFAULT_VALUES } from '../../CreateForm'
import { useImportErrorContext } from '../ImportErrorContext'
import { CreateMultipleVestingFormSchemaType } from '../schema'

import {
  CreateMultipleStreamBaseSchemaFormErrorsType,
  CreateMultipleStreamFormSchemaType,
} from '../../../stream/CreateMultipleForm'
import { Button } from '@sushiswap/ui/future/components/button'
import { CurrencyCell } from './Cells/CurrencyCell'
import { RecipientCell } from './Cells/RecipientCell'
import { StartDateCell } from './Cells/StartDateCell'
import { ScheduleCell } from './Cells/ScheduleCell'
import { ActionsCell } from './Cells/ActionsCell'

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
  const { errors } = useImportErrorContext<CreateMultipleVestingFormSchemaType>()
  const {
    control,
    watch,
    formState: { isValid, isValidating, errors: formErrors },
  } = useFormContext<CreateMultipleVestingFormSchemaType & CreateMultipleStreamBaseSchemaFormErrorsType>()
  const { append } = useFieldArray({
    control,
    name: 'vestings',
    shouldUnregister: true,
  })

  const fields = watch('vestings') ?? []
  const _memoizedErrors = useDeepCompareMemoize(formErrors)
  const _formErrors = useMemo(() => {
    const length = fields?.length || 0
    const data: FieldErrors<CreateMultipleStreamFormSchemaType> = {
      streams: [],
    }
    for (let i = 0; i < length; i++) {
      if (data.streams && _memoizedErrors.vestings?.[i]) {
        data.streams[i] = _memoizedErrors.vestings[i]
      }

      if (data.streams && _memoizedErrors.FORM_ERRORS?.[i]) {
        data.streams[i] = {
          ...data.streams[i],
          ..._memoizedErrors.FORM_ERRORS[i],
        }
      }
    }

    return data
  }, [fields?.length, _memoizedErrors.FORM_ERRORS, _memoizedErrors.vestings])

  const _errors =
    (Array.isArray(errors?.vestings) && errors.vestings.length > 0) ||
    (Array.isArray(_formErrors?.streams) && _formErrors.streams.length > 0)
  const formValid = isValid && !isValidating && !_errors

  return (
    <div className="flex flex-col col-span-2 gap-4">
      <p className="text-lg text-gray-900 font-medium dark:text-slate-200">Vests</p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {fields.length > 0 ? (
            fields.map((row, i) => (
              <div className="grid grid-cols-3 gap-2" key={i}>
                <CurrencyCell row={row} index={i} />
                <RecipientCell row={row} index={i} chainId={chainId} />
                <StartDateCell row={row} index={i} chainId={chainId} />
                <ScheduleCell row={row} index={i} chainId={chainId} />
                <ActionsCell row={row} index={i} chainId={chainId} />
              </div>
            ))
          ) : (
            <Button
              size="xl"
              variant="outlined"
              type="button"
              startIcon={<PlusIcon width={16} height={16} />}
              onClick={() => append({ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() })}
              testdata-id="furo-create-multiple-streams-add-item-button"
            >
              Add Vest
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {fields.length > 0 && (
            <>
              <Button
                size="lg"
                variant="outlined"
                type="button"
                startIcon={<PlusIcon width={16} height={16} />}
                onClick={() => append({ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() })}
                testdata-id="furo-create-multiple-streams-add-item-button"
              >
                Add Vest
              </Button>
              <Button
                size="lg"
                variant="filled"
                onClick={onReview}
                disabled={!formValid}
                type="submit"
                className="!px-10"
                testdata-id="furo-create-multiple-streams-review-button"
              >
                Review
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
