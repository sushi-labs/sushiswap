import { zodResolver } from '@hookform/resolvers/zod'
import { ChainId } from '@sushiswap/chain'
import { FundSource } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ExecuteSection } from './ExecuteSection'
import { GeneralDetailsSection } from './GeneralDetailsSection'
import { CreateStreamFormSchemaType, CreateStreamModelSchema } from './schema'
import { StreamAmountDetails } from './StreamAmountDetails'

export const CreateForm: FC<{ chainId: ChainId }> = ({ chainId }) => {
  const methods = useForm<CreateStreamFormSchemaType>({
    resolver: zodResolver(CreateStreamModelSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      fundSource: FundSource.WALLET,
    },
  })

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Stream">
          <GeneralDetailsSection />
          <StreamAmountDetails chainId={chainId} />
          <ExecuteSection chainId={chainId} />
        </Form>
      </FormProvider>
    </>
  )
}
