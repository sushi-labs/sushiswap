import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@sushiswap/ui'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ImportErrorProvider } from '../../vesting/CreateMultipleForm/ImportErrorContext'
import {
  CreateMultipleStreamFormSchemaType,
  CreateMultipleStreamModelSchema,
  ExecuteMultipleSection,
  ImportZoneSection,
  ReviewSection,
} from '.'
import { CreateStreamsTableSection } from './CreateStreamsTableSection'
import { FuroStreamRouterChainId } from '@sushiswap/furo'

export const FORM_ERROR = 'FORM_ERROR' as const

export const CreateMultipleForm: FC<{ chainId: FuroStreamRouterChainId }> = ({ chainId }) => {
  const [review, setReview] = useState(false)
  const methods = useForm<CreateMultipleStreamFormSchemaType>({
    resolver: zodResolver(CreateMultipleStreamModelSchema),
    mode: 'onSubmit',
    defaultValues: {
      streams: [],
    },
  })

  const { reset, watch } = methods
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

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Streams" onSubmit={methods.handleSubmit(onReview)}>
          <div className="flex flex-col gap-14">
            <ImportErrorProvider<CreateMultipleStreamFormSchemaType>>
              <ImportZoneSection chainId={chainId} />
              <div className={review ? 'hidden' : ''}>
                <CreateStreamsTableSection chainId={chainId} onReview={onReview} />
              </div>
              <div className={review ? '' : 'hidden'}>
                <ReviewSection chainId={chainId} onBack={onBack} />
                <ExecuteMultipleSection chainId={chainId} isReview={review} />
              </div>
            </ImportErrorProvider>
          </div>
        </Form>
      </FormProvider>
    </>
  )
}
