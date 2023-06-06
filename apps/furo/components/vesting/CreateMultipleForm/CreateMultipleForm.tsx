import { zodResolver } from '@hookform/resolvers/zod'
import { FuroVestingRouterChainId } from '@sushiswap/furo'
import { Form } from '@sushiswap/ui'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { CreateVestingsTableSection } from './CreateVestingsTableSection'
import { ExecuteMultipleSection } from './ExecuteMultipleSection'
import { ImportErrorProvider } from './ImportErrorContext'
import { ImportZoneSection } from './ImportZoneSection'
import { ReviewSection } from './ReviewSection'
import { CreateMultipleVestingFormSchemaType, CreateMultipleVestingModelSchema } from './schema'

export const CreateMultipleForm: FC<{ chainId: FuroVestingRouterChainId }> = ({ chainId }) => {
  const [review, setReview] = useState(false)
  const methods = useForm<CreateMultipleVestingFormSchemaType>({
    resolver: zodResolver(CreateMultipleVestingModelSchema),
    mode: 'onBlur',
    defaultValues: {
      vestings: [],
    },
  })

  const { reset } = methods

  const onReview = useCallback(() => {
    setReview(true)
  }, [])

  const onBack = useCallback(() => {
    setReview(false)
  }, [])

  useEffect(() => {
    reset()
  }, [chainId, reset])

  return (
    <FormProvider {...methods}>
      <Form header="Create Vests" onSubmit={methods.handleSubmit(onReview)}>
        <div className="flex flex-col gap-14">
          <ImportErrorProvider<CreateMultipleVestingFormSchemaType>>
            <ImportZoneSection chainId={chainId} />
            <div className={review ? 'hidden' : ''}>
              <CreateVestingsTableSection chainId={chainId} onReview={onReview} />
            </div>
            <div className={review ? '' : 'hidden'}>
              <ReviewSection chainId={chainId} />
              <ExecuteMultipleSection chainId={chainId} isReview={review} onBack={onBack} />
            </div>
          </ImportErrorProvider>
        </div>
      </Form>
      {/* {process.env.NODE_ENV === 'development' && isMounted && <DevTool control={control} />} */}
    </FormProvider>
  )
}
