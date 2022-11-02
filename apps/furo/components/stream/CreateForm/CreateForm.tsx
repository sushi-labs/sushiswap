import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
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

export const createStreamDefaultValues = (chainId: ChainId): CreateStreamFormSchemaType => {
  const { decimals, name, isNative, symbol } = Native.onChain(chainId)

  return {
    id: nanoid(),
    currency: { chainId, decimals, name, isNative, symbol },
    amount: '',
    recipient: '',
    fundSource: FundSource.WALLET,
  }
}

export const CreateForm: FC<{ chainId: ChainId }> = ({ chainId }) => {
  const isMounted = useIsMounted()
  const methods = useForm<CreateStreamFormSchemaType>({
    resolver: zodResolver(CreateStreamModelSchema),
    mode: 'onBlur',
    defaultValues: createStreamDefaultValues(chainId),
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
        {process.env.NODE_ENV === 'development' && isMounted && <DevTool control={control} />}
      </FormProvider>
    </>
  )
}
