import { PlusIcon } from '@heroicons/react/solid'
import { nanoid } from 'nanoid'
import { ChainId } from '@sushiswap/chain'
import React, { FC, useMemo } from 'react'
import { FieldErrors, useFieldArray, useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../../lib'
import { useImportErrorContext } from '../../../vesting/CreateMultipleForm/ImportErrorContext'
import { CREATE_STREAM_DEFAULT_VALUES } from '../../CreateForm'
import { CreateMultipleStreamBaseSchemaFormErrorsType, CreateMultipleStreamFormSchemaType } from '../schema'
import Button from '@sushiswap/ui/future/components/button/Button'
import { CurrencyCell } from './Cells/CurrencyCell'
import { AmountCell } from './Cells/AmountCell'
import { RecipientCell } from './Cells/RecipientCell'
import { StartDateCell } from './Cells/StartDateCell'
import { EndDateCell } from './Cells/EndDateCell'
import { ActionsCell } from './Cells/ActionsCell'

interface CreateStreamsTableSection {
  chainId: ChainId
  onReview(): void
}

export const CreateStreamsTableSection: FC<CreateStreamsTableSection> = ({ chainId, onReview }) => {
  const { errors } = useImportErrorContext<CreateMultipleStreamFormSchemaType>()
  const {
    control,
    watch,
    formState: { isValid, isValidating, errors: formErrors },
  } = useFormContext<CreateMultipleStreamFormSchemaType & CreateMultipleStreamBaseSchemaFormErrorsType>()
  const { append } = useFieldArray({
    control,
    name: 'streams',
    shouldUnregister: true,
  })

  const fields = watch('streams') ?? []
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
      <p className="text-lg text-gray-900 font-medium dark:text-slate-200">Streams</p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {fields.length > 0 ? (
            fields.map((row, i) => (
              <div className="flex gap-2" key={i}>
                <CurrencyCell row={row} index={i} />
                <AmountCell row={row} index={i} chainId={chainId} />
                <RecipientCell row={row} index={i} chainId={chainId} />
                <StartDateCell row={row} index={i} chainId={chainId} />
                <EndDateCell row={row} index={i} chainId={chainId} />
                <ActionsCell row={row} index={i} chainId={chainId} />
              </div>
            ))
          ) : (
            <Button
              size="xl"
              variant="outlined"
              type="button"
              startIcon={<PlusIcon width={16} height={16} />}
              onClick={() => append({ ...CREATE_STREAM_DEFAULT_VALUES, id: nanoid() })}
              testdata-id="furo-create-multiple-streams-add-item-button"
            >
              Add Stream
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
                onClick={() => append({ ...CREATE_STREAM_DEFAULT_VALUES, id: nanoid() })}
                testdata-id="furo-create-multiple-streams-add-item-button"
              >
                Add Stream
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
