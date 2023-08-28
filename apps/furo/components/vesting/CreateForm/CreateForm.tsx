import { zodResolver } from '@hookform/resolvers/zod'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { FundSource } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui/components/form'
import { nanoid } from 'nanoid'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  CreateMultipleVestingFormSchemaType,
  CreateMultipleVestingModelSchema,
  CreateVestingFormSchemaType,
} from '../schema'
import { CreateFormReviewModal } from './CreateFormReviewModal'
import { VestingForm } from './VestingForm'

export const CREATE_VEST_DEFAULT_VALUES: CreateVestingFormSchemaType = {
  id: nanoid(),
  currency: undefined,
  recipient: undefined,
  startDate: undefined,
  fundSource: FundSource.WALLET,
  stepConfig: '2',
  stepPayouts: 1,
  stepAmount: undefined,
  cliffEnabled: false,
  cliffAmount: undefined,
  cliffEndDate: undefined,
}

export const CreateForm: FC<{ chainId: FuroChainId }> = ({ chainId }) => {
  const methods = useForm<CreateMultipleVestingFormSchemaType>({
    resolver: zodResolver(CreateMultipleVestingModelSchema),
    mode: 'all',
    defaultValues: {
      vestings: [{ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() }],
    },
  })

  const { reset } = methods

  useEffect(() => {
    reset()
  }, [chainId, reset])

  return (
    <>
      <h3 className="text-3xl font-semibold text-gray-900 dark:text-slate-50 py-6">Create Vest</h3>
      <Form {...methods}>
        <VestingForm chainId={chainId} index={0} />
        <CreateFormReviewModal chainId={chainId} />
      </Form>
    </>
  )
}
