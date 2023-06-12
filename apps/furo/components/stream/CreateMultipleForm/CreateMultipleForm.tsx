import { ArrowCircleLeftIcon } from '@heroicons/react/outline'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIsMounted } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import Link from 'next/link'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export const FORM_ERROR = 'FORM_ERROR' as const
export type FormErrors = { [FORM_ERROR]?: never }

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

export const CreateMultipleForm: FC<{ chainId: FuroStreamRouterChainId }> = ({ chainId }) => {
  const isMounted = useIsMounted()
  const [review, setReview] = useState(false)
  const methods = useForm<CreateMultipleStreamFormSchemaType>({
    resolver: zodResolver(CreateMultipleStreamModelSchema),
    mode: 'onBlur',
    defaultValues: {
      streams: [],
    },
  })

  const { control, reset, watch } = methods
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
    console.error(e)
  }

  return (
    <div className={classNames('flex flex-col gap-20')}>
      <Link href="/stream/create" passHref={true} legacyBehavior>
        <a>
          <button type="button" className="flex gap-3 font-medium group hover:text-white text-slate-200">
            <ArrowCircleLeftIcon width={24} height={24} /> <span>Create Stream</span>
          </button>
        </a>
      </Link>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-14">
          <ImportErrorProvider>
            <ImportZoneSection chainId={chainId} />
            <div className="w-full border-b border-slate-200/5" />
            <div className={review ? 'hidden' : ''}>
              <CreateStreamsTableSection chainId={chainId} onReview={onReview} />
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
