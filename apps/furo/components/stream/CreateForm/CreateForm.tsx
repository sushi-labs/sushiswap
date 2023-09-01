import { zodResolver } from '@hookform/resolvers/zod'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { FundSource } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui/components/form'
import { nanoid } from 'nanoid'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  CreateMultipleStreamBaseSchemaFormErrorsType,
  CreateMultipleStreamFormSchemaType,
  CreateMultipleStreamModelSchema,
  CreateStreamFormSchemaType,
} from '../schema'
import { ExecuteSection } from './ExecuteSection'
import { StreamForm } from './StreamForm'

export const CREATE_STREAM_DEFAULT_VALUES: CreateStreamFormSchemaType = {
  id: nanoid(),
  dates: undefined,
  currency: undefined,
  amount: '',
  recipient: undefined,
  fundSource: FundSource.WALLET,
}

export const CreateForm: FC<{ chainId: FuroChainId }> = ({ chainId }) => {
  const methods = useForm<CreateMultipleStreamFormSchemaType & CreateMultipleStreamBaseSchemaFormErrorsType>({
    resolver: zodResolver(CreateMultipleStreamModelSchema),
    mode: 'all',
    defaultValues: {
      streams: [{ ...CREATE_STREAM_DEFAULT_VALUES, id: nanoid() }],
    },
  })

  const { reset } = methods

  useEffect(() => {
    reset()
  }, [chainId, reset])

  return (
    <>
      <h3 className="text-3xl font-semibold text-gray-900 dark:text-slate-50 py-6">Create Stream</h3>
      <Form {...methods}>
        <StreamForm chainId={chainId} index={0} />
        <ExecuteSection chainId={chainId} index={0} />
      </Form>
    </>
  )
}
