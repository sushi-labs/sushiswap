import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from '@reduxjs/toolkit'
import { FuroStreamRouterChainId } from '@sushiswap/furo'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui'
import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ExecuteSection } from './ExecuteSection'
import { GeneralDetailsSection } from './GeneralDetailsSection'
import { CreateStreamFormSchemaType, CreateStreamModelSchema } from './schema'
import { StreamAmountDetails } from './StreamAmountDetails'

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
  const isMounted = useIsMounted()
  const methods = useForm<CreateStreamFormSchemaType>({
    resolver: zodResolver(CreateStreamModelSchema),
    mode: 'onBlur',
    defaultValues: CREATE_STREAM_DEFAULT_VALUES,
  })

  const { control, reset } = methods

  useEffect(() => {
    reset()
  }, [chainId, reset])

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Stream">
          <GeneralDetailsSection />
          <StreamAmountDetails chainId={chainId} />
          <ExecuteSection chainId={chainId} />
        </Form>
        {/* {process.env.NODE_ENV === 'development' && isMounted && <DevTool control={control} />} */}
      </FormProvider>
    </>
  )
}
