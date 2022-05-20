import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Form } from '@sushiswap/ui'
import { CliffDetailsSection } from 'features/vesting/CreateForm/CliffDetailsSection'
import CreateFormReviewModal from 'features/vesting/CreateForm/CreateFormReviewModal'
import { GeneralDetailsSection } from 'features/vesting/CreateForm/GeneralDetailsSection'
import { GradedVestingDetailsSection } from 'features/vesting/CreateForm/GradedVestingDetailsSection'
import { createVestingSchema, stepConfigurations } from 'features/vesting/CreateForm/schema'
import { transformVestingFormData } from 'features/vesting/CreateForm/transformVestingFormData'
import { CreateVestingFormData, CreateVestingFormDataValidated } from 'features/vesting/CreateForm/types'
import { FC, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export const CreateForm: FC = () => {
  const [review, setReview] = useState(false)

  const methods = useForm<CreateVestingFormData>({
    // @ts-ignore
    resolver: yupResolver(createVestingSchema),
    defaultValues: {
      token: undefined,
      cliff: false,
      startDate: undefined,
      recipient: undefined,
      cliffEndDate: undefined,
      cliffAmount: undefined,
      stepPayouts: undefined,
      stepAmount: undefined,
      stepConfig: stepConfigurations[0],
      fundSource: undefined,
    },
    mode: 'onChange',
  })

  const {
    formState: { isValid, isValidating },
    watch,
  } = methods

  const formData = watch()
  const validatedData =
    isValid && !isValidating ? transformVestingFormData(formData as CreateVestingFormDataValidated) : undefined

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create vesting" onSubmit={methods.handleSubmit(() => setReview(true))}>
          <GeneralDetailsSection />
          <CliffDetailsSection />
          <GradedVestingDetailsSection />
          <Form.Buttons>
            <Button type="submit" color="blue" disabled={!isValid || isValidating}>
              Review Details
            </Button>
          </Form.Buttons>
        </Form>
      </FormProvider>
      {validatedData && (
        <CreateFormReviewModal open={review} onDismiss={() => setReview(false)} formData={validatedData} />
      )}
    </>
  )
}
