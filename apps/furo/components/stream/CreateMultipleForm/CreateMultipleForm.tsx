import { ArrowCircleLeftIcon } from '@heroicons/react/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChainId } from '@sushiswap/chain'
import { classNames } from '@sushiswap/ui'
import Link from 'next/link'
import React, { FC, useCallback, useState } from 'react'
import { FieldErrors, FormProvider, useForm } from 'react-hook-form'

import { ExecuteMultipleSection, ImportZoneSection } from '.'
import { CreateStreamsTableSection } from './CreateStreamsTableSection'
import { ReviewSection } from './ReviewSection'
import { CreateMultipleStreamBaseSchema, CreateMultipleStreamBaseSchemaType } from './schema'

export const CreateMultipleForm: FC<{ chainId: ChainId }> = ({ chainId }) => {
  const [review, setReview] = useState(false)
  const [errors, setErrors] = useState<FieldErrors<CreateMultipleStreamBaseSchemaType>>({ streams: [] })
  const methods = useForm<CreateMultipleStreamBaseSchemaType>({
    resolver: zodResolver(CreateMultipleStreamBaseSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      streams: [],
    },
  })

  const onReview = useCallback(() => {
    setReview(true)
  }, [])

  const onBack = useCallback(() => {
    setReview(false)
  }, [])

  return (
    <div className={classNames('flex flex-col gap-20')}>
      <Link href="/stream/create" passHref={true}>
        <a>
          <button className="flex gap-3 font-medium group hover:text-white text-slate-200">
            <ArrowCircleLeftIcon width={24} height={24} /> <span>Create Stream</span>
          </button>
        </a>
      </Link>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-14">
          <ImportZoneSection errors={errors} onErrors={setErrors} chainId={chainId} />
          <div className="border-b border-slate-200/5 w-full" />
          <div className={review ? 'hidden' : ''}>
            <CreateStreamsTableSection
              chainId={chainId}
              onReview={onReview}
              importErrors={errors}
              onDismissErrors={() => setErrors({})}
              setImportErrors={setErrors}
            />
          </div>
          <div className={review ? '' : 'hidden'}>
            <ReviewSection chainId={chainId} onBack={onBack} />
            <ExecuteMultipleSection chainId={chainId} isReview={review} />
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
