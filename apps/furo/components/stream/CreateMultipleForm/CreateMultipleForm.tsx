import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@sushiswap/ui'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { FieldErrors, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { ImportErrorProvider } from '../../vesting/CreateMultipleForm/ImportErrorContext'
import { ExecuteMultipleSection, ImportZoneSection, ReviewSection } from '.'
import { FuroStreamRouterChainId } from '@sushiswap/furo'
import { CREATE_STREAM_DEFAULT_VALUES, StreamForm } from '../CreateForm'
import Button from '@sushiswap/ui/future/components/button/Button'
import { DuplicateIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid'
import { nanoid } from 'nanoid'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { useDeepCompareMemoize } from '../../../lib'
import {
  CreateMultipleStreamBaseSchemaFormErrorsType,
  CreateMultipleStreamFormSchemaType,
  CreateMultipleStreamModelSchema,
} from '../schema'

export const CreateMultipleForm: FC<{ chainId: FuroStreamRouterChainId }> = ({ chainId }) => {
  const [review, setReview] = useState(false)
  const methods = useForm<CreateMultipleStreamFormSchemaType & CreateMultipleStreamBaseSchemaFormErrorsType>({
    resolver: zodResolver(CreateMultipleStreamModelSchema),
    mode: 'onSubmit',
    defaultValues: {
      streams: [{ ...CREATE_STREAM_DEFAULT_VALUES, id: nanoid() }],
    },
  })

  const {
    reset,
    watch,
    control,
    formState: { isValid, isValidating, errors: formErrors },
  } = methods
  const { append, remove } = useFieldArray({
    control,
    name: 'streams',
    shouldUnregister: true,
  })

  const formData = watch()
  const onReview = useCallback(() => {
    setReview(true)
  }, [])

  const onBack = useCallback(() => {
    setReview(false)
  }, [])

  useEffect(() => {
    reset()
  }, [chainId, reset])

  try {
    CreateMultipleStreamModelSchema.parse(formData)
  } catch (e) {
    console.log(e)
  }

  const _memoizedErrors = useDeepCompareMemoize(formErrors)
  const _formErrors = useMemo(() => {
    const length = formData.streams?.length || 0
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
  }, [formData.streams?.length, _memoizedErrors.FORM_ERRORS, _memoizedErrors.streams])

  const _errors = Array.isArray(_formErrors?.streams) && _formErrors.streams.length > 0
  const formValid = isValid && !isValidating && !_errors

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Streams" onSubmit={methods.handleSubmit(onReview)}>
          <div className="flex flex-col gap-14">
            <ImportErrorProvider>
              <ImportZoneSection chainId={chainId} />
              {!review ? (
                <div className="flex flex-col gap-4">
                  {(formData.streams || []).map((el, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 border-b dark:border-slate-200/5 border-gray-900/5 pb-4"
                    >
                      <div className="flex justify-between">
                        <h1 className="text-xs uppercase font-semibold">Stream {i + 1}</h1>
                        <div className="flex items-center gap-5 pr-2">
                          <div className="flex items-center">
                            <IconButton
                              icon={DuplicateIcon}
                              iconProps={{ width: 16, height: 16 }}
                              onClick={() => append(el)}
                            />
                          </div>
                          {(i > 0 || (formData.streams || []).length > 1) && (
                            <div className="flex items-center">
                              <IconButton
                                icon={TrashIcon}
                                iconProps={{ width: 16, height: 16, className: 'text-red' }}
                                onClick={() => remove(i)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <StreamForm chainId={chainId} index={i} />
                    </div>
                  ))}
                  <div className="flex justify-end gap-4">
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
                    <Button
                      size="xl"
                      variant="outlined"
                      type="button"
                      onClick={() => setReview(true)}
                      disabled={!formValid}
                      testdata-id="furo-create-multiple-streams-add-item-button"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <ReviewSection chainId={chainId} />
                  <ExecuteMultipleSection chainId={chainId} isReview={review} onBack={onBack} />
                </div>
              )}
            </ImportErrorProvider>
          </div>
        </Form>
      </FormProvider>
    </>
  )
}
