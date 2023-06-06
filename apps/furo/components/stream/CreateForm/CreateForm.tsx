import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { FuroStreamRouterChainId } from '@sushiswap/furo'
import { FundSource } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui'
import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { StreamForm } from './StreamForm'
import {} from '../CreateMultipleForm'
import { ExecuteSection } from './ExecuteSection'
import {
  CreateMultipleStreamBaseSchemaFormErrorsType,
  CreateMultipleStreamFormSchemaType,
  CreateMultipleStreamModelSchema,
  CreateStreamFormSchemaType,
} from '../schema'

export const CREATE_STREAM_DEFAULT_VALUES: CreateStreamFormSchemaType = {
  id: nanoid(),
  currency: undefined,
  amount: '',
  recipient: '',
  fundSource: FundSource.WALLET,
}

export const CreateForm: FC<{ chainId: FuroStreamRouterChainId }> = ({ chainId }) => {
  const methods = useForm<CreateMultipleStreamFormSchemaType & CreateMultipleStreamBaseSchemaFormErrorsType>({
    resolver: zodResolver(CreateMultipleStreamModelSchema),
    mode: 'onBlur',
    defaultValues: {
      streams: [{ ...CREATE_STREAM_DEFAULT_VALUES, id: nanoid() }],
    },
  })

  const { reset } = methods

  // try {
  //   CreateMultipleStreamModelSchema.parse(formData)
  // } catch (e) {
  //   console.log(e)
  // }

  useEffect(() => {
    reset()
  }, [chainId, reset])

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Stream">
          <StreamForm chainId={chainId} index={0} />
          <ExecuteSection chainId={chainId} index={0} />
        </Form>
        {/* {process.env.NODE_ENV === 'development' && isMounted && <DevTool control={control} />} */}
      </FormProvider>
    </>
  )
}
