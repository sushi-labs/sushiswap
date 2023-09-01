import { DuplicateIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { Button } from '@sushiswap/ui/components/button'
import { Form } from '@sushiswap/ui/components/form'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { nanoid } from 'nanoid'
import { FC, useCallback, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { CREATE_VEST_DEFAULT_VALUES } from '../CreateForm'
import { VestingForm } from '../CreateForm/VestingForm'
import {
  CreateMultipleVestingBaseSchemaFormErrorsType,
  CreateMultipleVestingFormSchemaType,
  CreateMultipleVestingModelSchema,
} from '../schema'
import { ExecuteMultipleSection } from './ExecuteMultipleSection'
import { ImportZoneSection } from './ImportZoneSection'
import { ReviewSection } from './ReviewSection'

export const CreateMultipleForm: FC<{ chainId: FuroChainId }> = ({ chainId }) => {
  const [review, setReview] = useState(false)
  const methods = useForm<CreateMultipleVestingFormSchemaType & CreateMultipleVestingBaseSchemaFormErrorsType>({
    resolver: zodResolver(CreateMultipleVestingModelSchema),
    mode: 'all',
    defaultValues: {
      vestings: [{ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() }],
    },
  })

  const { reset, watch, control, formState } = methods
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
    console.log(formState.errors, e)
  }
  //
  // useEffect(() => {
  //   try {
  //     CreateMultipleVestingModelSchema.parse(formData)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }, [formData])

  return (
    <>
      <h3 className="text-3xl font-semibold text-gray-900 dark:text-slate-50 py-6">Create Vests</h3>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onReview)}>
          <div className="flex flex-col gap-14">
            <ImportZoneSection chainId={chainId} />
            {!review ? (
              <div className="flex flex-col gap-4">
                {(formData.vestings || []).map((el, i) => (
                  <div
                    key={el.id}
                    className="flex flex-col gap-1 pb-4 border-b dark:border-slate-200/5 border-gray-900/5"
                  >
                    <div className="flex justify-between">
                      <h1 className="text-xs font-semibold uppercase">Vesting {i + 1}</h1>
                      <div className="flex items-center gap-5 pr-2">
                        <div className="flex items-center">
                          <IconButton icon={DuplicateIcon} onClick={() => append(el)} name="Duplicate" />
                        </div>
                        {(i > 0 || (formData.vestings || []).length > 1) && (
                          <div className="flex items-center">
                            <IconButton
                              icon={TrashIcon}
                              iconProps={{ className: 'text-red' }}
                              onClick={() => remove(i)}
                              name="Remove"
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
                    variant="secondary"
                    type="button"
                    icon={PlusIcon}
                    onClick={() => append({ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() })}
                    testId="create-multiple-vest-add-vest"
                  >
                    Add Vesting
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setReview(true)}
                    disabled={!formState.isValid}
                    testId="create-multiple-vest-review"
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
          </div>
        </form>
      </Form>
    </>
  )
}
