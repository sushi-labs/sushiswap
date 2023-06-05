import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { FuroVestingRouterChainId } from '@sushiswap/furo'
import { FundSource } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui'
import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { CliffDetailsSection } from './CliffDetailsSection'
import { GeneralDetailsSection } from './GeneralDetailsSection'
import { GradedVestingDetailsSection } from './GradedVestingDetailsSection'
import { CreateVestingFormSchemaType, CreateVestingModelSchema } from './schema'
import { CreateFormReviewModal } from './CreateFormReviewModal'

export const FORM_ERROR = 'FORM_ERROR' as const
export type FormErrors = { [FORM_ERROR]?: never }

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
  },
}

export const CreateForm: FC<{ chainId: FuroVestingRouterChainId }> = ({ chainId }) => {
  const methods = useForm<CreateVestingFormSchemaType & FormErrors>({
    resolver: zodResolver(CreateVestingModelSchema),
    defaultValues: CREATE_VEST_DEFAULT_VALUES,
    mode: 'onBlur',
  })

  const { watch, setError, clearErrors, reset } = methods
  const [startDate, cliffEnabled, cliffEndDate] = watch(['startDate', 'cliff.cliffEnabled', 'cliff.cliffEndDate'])

  // Temporary solution for when Zod fixes conditional validation
  // https://github.com/colinhacks/zod/issues/1394
  useEffect(() => {
    if (startDate && cliffEnabled && cliffEndDate) {
      if (cliffEndDate < startDate) {
        setError('cliff.cliffEndDate', {
          type: 'custom',
          message: 'Must be later than start date',
        })
      } else {
        clearErrors('cliff.cliffEndDate')
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
        <GeneralDetailsSection chainId={chainId} />
        <CliffDetailsSection />
        <GradedVestingDetailsSection />
        <CreateFormReviewModal chainId={chainId} />
      </Form>
      {/* {process.env.NODE_ENV === 'development' && isMounted && <DevTool control={control} />} */}
    </FormProvider>
  )
}
