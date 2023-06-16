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
  stepConfig: undefined,
  stepPayouts: 1,
  stepAmount: undefined,
  cliff: {
    cliffEnabled: false,
    cliffAmount: undefined,
    cliffEndDate: undefined,
  },
}

export const CreateForm: FC<{ chainId: FuroVestingRouterChainId }> = ({ chainId }) => {
  const methods = useForm<CreateMultipleVestingFormSchemaType>({
    resolver: zodResolver(CreateMultipleVestingModelSchema),
    mode: 'onBlur',
    defaultValues: {
      vestings: [{ ...CREATE_VEST_DEFAULT_VALUES, id: nanoid() }],
    },
  })

  const { watch, setError, clearErrors, reset } = methods
  const [startDate, cliffEnabled, cliffEndDate] = watch([
    `vestings.0.startDate`,
    'vestings.0.cliff.cliffEnabled',
    'vestings.0.cliff.cliffEndDate',
  ])

  // Temporary solution for when Zod fixes conditional validation
  // https://github.com/colinhacks/zod/issues/1394
  useEffect(() => {
    if (startDate && cliffEnabled && cliffEndDate) {
      if (cliffEndDate < startDate) {
        setError('vestings.0.cliff.cliffEndDate', {
          type: 'custom',
          message: 'Must be later than start date',
        })
      } else {
        clearErrors('vestings.0.cliff.cliffEndDate')
      }
    }
  }, [clearErrors, cliffEnabled, cliffEndDate, setError, startDate])

  // useEffect(() => {
  //   try {
  //     CreateVestingModelSchema.parse(formData)
  //   } catch (e) {
  //     console.log(formData)
  //     console.log(e)
  //   }
  // }, [formData])

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
