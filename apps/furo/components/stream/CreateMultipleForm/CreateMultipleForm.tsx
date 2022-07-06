import { Signature } from '@ethersproject/bytes'
import { FundSource } from '@sushiswap/hooks'
import { Form } from '@sushiswap/ui'
import { useFuroStreamContract } from '@sushiswap/wagmi'
import { FC, useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

import { TableSection } from './TableSection'
import { CreateStreamFormData } from './types'

export const CreateMultipleForm: FC = () => {
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const contract = useFuroStreamContract(activeChain?.id)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()
  const [signature, setSignature] = useState<Signature>()

  const methods = useForm<CreateStreamFormData>({
    defaultValues: {
      streams: [
        {
          currency: undefined,
          startDate: undefined,
          endDate: undefined,
          recipient: undefined,
          amount: '',
          fundSource: FundSource.WALLET,
        },
      ],
    },
    mode: 'onChange',
  })

  const {
    formState: { isValid, isValidating },
    watch,
    reset,
  } = methods

  // @ts-ignore
  // const [currency, amount] = watch(['currency', 'amount'])

  const onSubmit = useCallback(async () => {}, [])

  useEffect(() => {
    reset()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChain?.id, address])

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Streams" onSubmit={methods.handleSubmit(onSubmit)}>
          <TableSection />
          {/*<Form.Buttons>*/}
          {/*  <Approve*/}
          {/*    components={*/}
          {/*      <Approve.Components>*/}
          {/*        <Approve.Bentobox address={contract?.address} onSignature={setSignature} />*/}
          {/*        <Approve.Token*/}
          {/*          amount={tryParseAmount(amount, currency)}*/}
          {/*          address={activeChain?.id ? BENTOBOX_ADDRESS[activeChain.id] : undefined}*/}
          {/*        />*/}
          {/*      </Approve.Components>*/}
          {/*    }*/}
          {/*    render={({ approved }) => (*/}
          {/*      <Button*/}
          {/*        type="submit"*/}
          {/*        variant="filled"*/}
          {/*        color="gradient"*/}
          {/*        disabled={isWritePending || !approved || !isValid || isValidating}*/}
          {/*      >*/}
          {/*        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create stream'}*/}
          {/*      </Button>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</Form.Buttons>*/}
        </Form>
      </FormProvider>
    </>
  )
}
