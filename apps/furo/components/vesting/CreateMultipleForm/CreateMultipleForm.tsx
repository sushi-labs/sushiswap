import { ArrowCircleLeftIcon } from '@heroicons/react/outline'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { FuroVestingRouterChainId } from '@sushiswap/furo'
import { useIsMounted } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import Link from 'next/link'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { CreateVestingsTableSection } from './CreateVestingsTableSection'
import { ExecuteMultipleSection } from './ExecuteMultipleSection'
import { ImportErrorProvider } from './ImportErrorContext'
import { ImportZoneSection } from './ImportZoneSection'
import { ReviewSection } from './ReviewSection'
import { CreateMultipleVestingFormSchemaType, CreateMultipleVestingModelSchema } from './schema'

export const CreateMultipleForm: FC<{ chainId: FuroVestingRouterChainId }> = ({ chainId }) => {
  const isMounted = useIsMounted()
  const [review, setReview] = useState(false)
  const methods = useForm<CreateMultipleVestingFormSchemaType>({
    resolver: zodResolver(CreateMultipleVestingModelSchema),
    mode: 'onBlur',
    defaultValues: {
      vestings: [],
    },
  })

  const { control, reset } = methods

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
    <div className={classNames('flex flex-col gap-10')}>
      <Link href="/vesting/create" passHref={true} legacyBehavior>
        <a>
          <button type="button" className="flex gap-3 font-medium group hover:text-white text-slate-200">
            <ArrowCircleLeftIcon width={24} height={24} /> <span>Create Vesting</span>
          </button>
        </a>
      </Link>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-14">
          <ImportErrorProvider>
            <ImportZoneSection chainId={chainId} />
            <div className="w-full border-b border-slate-200/5" />
            <div className={review ? 'hidden' : ''}>
              <CreateVestingsTableSection chainId={chainId} onReview={onReview} />
            </div>
            <div className={review ? '' : 'hidden'}>
              <ReviewSection chainId={chainId} onBack={onBack} />
              <ExecuteMultipleSection chainId={chainId} isReview={review} />
            </div>
          </ImportErrorProvider>
        </div>
        {/* {process.env.NODE_ENV === 'development' && isMounted && <DevTool control={control} />} */}
      </FormProvider>
    </div>
  )
}
