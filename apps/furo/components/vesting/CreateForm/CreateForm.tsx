import { zodResolver } from '@hookform/resolvers/zod'
import { ChainId } from '@sushiswap/chain'
import { FundSource } from '@sushiswap/hooks'
import { Button, Form } from '@sushiswap/ui'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { CliffDetailsSection } from './CliffDetailsSection'
import CreateFormReviewModal from './CreateFormReviewModal/CreateFormReviewModal'
import { GeneralDetailsSection } from './GeneralDetailsSection'
import { GradedVestingDetailsSection } from './GradedVestingDetailsSection'
import { CreateVestingFormSchemaType, CreateVestingModelSchema, stepConfigurations } from './schema'

export const CreateForm: FC<{ chainId: ChainId }> = ({ chainId }) => {
  const methods = useForm<CreateVestingFormSchemaType>({
    resolver: zodResolver(CreateVestingModelSchema),
    defaultValues: {
      fundSource: FundSource.WALLET,
      stepConfig: stepConfigurations[0],
      stepPayouts: 1,
      cliffEnabled: false,
      cliff: {
        cliffAmount: undefined,
        cliffEndDate: undefined,
      },
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  })

  const {
    formState: { isValid, isValidating },
  } = methods

  // const formData = watch()
  //
  // console.log(formData)
  // useEffect(() => {
  //   try {
  //     CreateVestingModelSchema.parse(formData)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }, [formData])

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create vesting">
          <GeneralDetailsSection chainId={chainId} />
          <CliffDetailsSection />
          <GradedVestingDetailsSection />
          <CreateFormReviewModal chainId={chainId}>
            {({ isWritePending, setOpen }) => {
              return (
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    disabled={isWritePending || !isValid || isValidating}
                    onClick={() => setOpen(true)}
                  >
                    Review Vesting
                  </Button>
                </div>
              )
            }}
          </CreateFormReviewModal>
        </Form>
      </FormProvider>
    </>
  )
}
