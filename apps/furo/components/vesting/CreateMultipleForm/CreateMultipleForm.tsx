import { FuroVestingRouterChainId } from '@sushiswap/furo/exports/exports'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { FieldErrors, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { CREATE_VEST_DEFAULT_VALUES } from '../CreateForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { useDeepCompareMemoize } from '../../../lib'
import { Form } from '@sushiswap/ui'
import { ImportErrorProvider } from './ImportErrorContext'
import { ImportZoneSection } from './ImportZoneSection'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { DuplicateIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid'
import { VestingForm } from '../CreateForm/VestingForm'
import { Button } from '@sushiswap/ui/future/components/button'
import { ReviewSection } from './ReviewSection'
import { ExecuteMultipleSection } from './ExecuteMultipleSection'
import {
  CreateMultipleVestingBaseSchemaFormErrorsType,
  CreateMultipleVestingFormSchemaType,
  CreateMultipleVestingModelSchema,
} from '../schema'

export const CreateMultipleForm: FC<{ chainId: FuroVestingRouterChainId }> = ({ chainId }) => {
  const [review, setReview] = useState(false)
  const methods = useForm<CreateMultipleVestingFormSchemaType & CreateMultipleVestingBaseSchemaFormErrorsType>({
    resolver: zodResolver(CreateMultipleVestingModelSchema),
    mode: 'onSubmit',
    defaultValues: {
      vestings: [{ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() }],
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
    name: 'vestings',
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
    CreateMultipleVestingModelSchema.parse(formData)
  } catch (e) {
    console.log(e)
  }

  const _memoizedErrors = useDeepCompareMemoize(formErrors)
  const _formErrors = useMemo(() => {
    const length = formData.vestings?.length || 0
    const data: FieldErrors<CreateMultipleVestingFormSchemaType> = {
      vestings: [],
    }
    for (let i = 0; i < length; i++) {
      if (data.vestings && _memoizedErrors.vestings?.[i]) {
        data.vestings[i] = _memoizedErrors.vestings[i]
      }

      if (data.vestings && _memoizedErrors.FORM_ERRORS?.[i]) {
        data.vestings[i] = {
          ...data.vestings[i],
          ..._memoizedErrors.FORM_ERRORS[i],
        }
      }
    }

    return data
  }, [formData.vestings?.length, _memoizedErrors.FORM_ERRORS, _memoizedErrors.vestings])

  const _errors = Array.isArray(_formErrors?.vestings) && _formErrors.vestings.length > 0
  const formValid = isValid && !isValidating && !_errors

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Vestings" onSubmit={methods.handleSubmit(onReview)}>
          <div className="flex flex-col gap-14">
            <ImportErrorProvider<CreateMultipleVestingFormSchemaType>>
              <ImportZoneSection chainId={chainId} />
              {!review ? (
                <div className="flex flex-col gap-4">
                  {(formData.vestings || []).map((el, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 border-b dark:border-slate-200/5 border-gray-900/5 pb-4"
                    >
                      <div className="flex justify-between">
                        <h1 className="text-xs uppercase font-semibold">Vesting {i + 1}</h1>
                        <div className="flex items-center gap-5 pr-2">
                          <div className="flex items-center">
                            <IconButton
                              icon={DuplicateIcon}
                              iconProps={{ width: 16, height: 16 }}
                              onClick={() => append(el)}
                            />
                          </div>
                          {(i > 0 || (formData.vestings || []).length > 1) && (
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
                      <VestingForm chainId={chainId} index={i} />
                    </div>
                  ))}
                  <div className="flex justify-end gap-4">
                    <Button
                      size="xl"
                      variant="outlined"
                      type="button"
                      startIcon={<PlusIcon width={16} height={16} />}
                      onClick={() => append({ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() })}
                      testdata-id="furo-create-multiple-vestings-add-item-button"
                    >
                      Add Vesting
                    </Button>
                    <Button
                      size="xl"
                      variant="outlined"
                      type="button"
                      onClick={() => setReview(true)}
                      disabled={!formValid}
                      testdata-id="furo-create-multiple-vestings-add-item-button"
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
