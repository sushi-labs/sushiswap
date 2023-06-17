import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { FuroVestingRouterChainId } from '@sushiswap/furo'
import { FundSource } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui'
import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { CreateFormReviewModal } from './CreateFormReviewModal'
import { VestingForm } from './VestingForm'
import {
  CreateMultipleVestingFormSchemaType,
  CreateMultipleVestingModelSchema,
  CreateVestingFormSchemaType,
} from '../schema'

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

export const CreateForm: FC<{ chainId: FuroVestingRouterChainId }> = ({ chainId }) => {
  const methods = useForm<CreateMultipleVestingFormSchemaType>({
    resolver: zodResolver(CreateMultipleVestingModelSchema),
    mode: 'onBlur',
    defaultValues: {
      vestings: [{ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() }],
    },
  })

  const { reset } = methods

  useEffect(() => {
    reset()
  }, [chainId, reset])

  return (
    <FormProvider {...methods}>
      <Form header="Create vesting">
        <VestingForm chainId={chainId} index={0} />
        <CreateFormReviewModal chainId={chainId} />
      </Form>
      {/* {process.env.NODE_ENV === 'development' && isMounted && <DevTool control={control} />} */}
    </FormProvider>
  )
}
