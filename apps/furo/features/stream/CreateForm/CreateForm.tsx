import { yupResolver } from '@hookform/resolvers/yup'
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { Amount } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { Button, Dots, Form } from '@sushiswap/ui'
import { createToast } from 'components'
import { Approve } from 'components/Approve'
import { parseUnits } from 'ethers/lib/utils'
import { approveBentoBoxAction, batchAction, streamCreationAction } from 'features/actions'
import { createStreamSchema } from 'features/stream/CreateForm/schema'
import { StreamAmountDetails } from 'features/stream/CreateForm/StreamAmountDetails'
import { CreateStreamFormData, CreateStreamFormDataValidated } from 'features/stream/CreateForm/types'
import { useFuroStreamContract } from 'hooks'
import { FundSource } from 'hooks/useFundSourceToggler'
import { FC, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

import { GeneralDetailsSection } from './GeneralDetailsSection'

export const CreateForm: FC = () => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const [error, setError] = useState<string>()
  const contract = useFuroStreamContract()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  const methods = useForm<CreateStreamFormData>({
    // @ts-ignore
    resolver: yupResolver(createStreamSchema),
    defaultValues: {
      token: undefined,
      startDate: undefined,
      endDate: undefined,
      recipient: undefined,
      amount: undefined,
    },
    mode: 'onChange',
  })

  const {
    formState: { isValid, isValidating },
    watch,
  } = methods

  // @ts-ignore
  const [token, amount] = watch(['token', 'amount'])

  const amountAsEntity = useMemo(() => {
    if (!token || !amount) return undefined

    let value = undefined
    try {
      value = Amount.fromRawAmount(token, JSBI.BigInt(parseUnits(amount, token.decimals).toString()))
    } catch (e) {}

    return value
  }, [amount, token])

  const onSubmit = async (data: CreateStreamFormDataValidated) => {
    if (!amountAsEntity || !contract || !account?.address) return

    setError(undefined)

    const actions = [
      approveBentoBoxAction({ contract, user: account.address, signature }),
      streamCreationAction({
        contract,
        recipient: data.recipient,
        token: data.token,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        amount: amountAsEntity,
        fromBentobox: data.fundSource === FundSource.BENTOBOX,
      }),
    ]

    try {
      const data = await sendTransactionAsync({
        request: {
          from: account?.address,
          to: contract?.address,
          data: batchAction({ contract, actions }),
        },
      })

      createToast({
        title: 'Create stream',
        description: `You have successfully created a stream`,
        promise: data.wait(),
      })
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Stream" onSubmit={methods.handleSubmit(onSubmit)}>
          <GeneralDetailsSection />
          <StreamAmountDetails />
          <Form.Buttons>
            <Approve
              components={[
                <Approve.Bentobox key={0} watch token={token} address={contract?.address} />,
                <Approve.Token
                  key={1}
                  watch
                  amount={amountAsEntity}
                  address={activeChain ? BENTOBOX_ADDRESS[activeChain?.id] : undefined}
                />,
              ]}
              render={({ approved }) => (
                <Button
                  type="submit"
                  variant="filled"
                  color="gradient"
                  disabled={isWritePending || !approved || !isValid || isValidating}
                >
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create stream'}
                </Button>
              )}
            />
          </Form.Buttons>
        </Form>
      </FormProvider>
    </>
  )
}
