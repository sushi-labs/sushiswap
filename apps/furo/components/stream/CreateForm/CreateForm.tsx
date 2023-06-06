import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { FuroStreamRouterChainId } from '@sushiswap/furo'
import { FundSource } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui'
import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { CreateStreamFormSchemaType, CreateStreamModelSchema } from './schema'
import { StreamForm } from './StreamForm'
import { CreateMultipleStreamFormSchemaType } from '../CreateMultipleForm'
import { ExecuteSection } from './ExecuteSection'

export const FORM_ERROR = 'FORM_ERROR' as const
export type FormErrors = { [FORM_ERROR]?: never }

export const CREATE_STREAM_DEFAULT_VALUES: CreateStreamFormSchemaType = {
  id: nanoid(),
  currency: undefined,
  amount: '',
  recipient: '',
  fundSource: FundSource.WALLET,
}

export const CreateForm: FC<{ chainId: FuroStreamRouterChainId }> = ({ chainId }) => {
  const methods = useForm<CreateMultipleStreamFormSchemaType>({
    resolver: zodResolver(CreateStreamModelSchema),
    mode: 'onBlur',
    defaultValues: {
      streams: [],
    },
  })

  const { reset } = methods

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
