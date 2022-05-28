import { Signature } from '@ethersproject/bytes'
import { parseUnits } from '@ethersproject/units'
import { yupResolver } from '@hookform/resolvers/yup'
import { Amount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import log from '@sushiswap/log'
import { JSBI } from '@sushiswap/math'
import { Button, Dots, Form } from '@sushiswap/ui'
import { BENTOBOX_ADDRESS } from '@sushiswap/wagmi'
import { Approve } from '@sushiswap/wagmi/systems'
import { createToast } from 'components'
import { approveBentoBoxAction, batchAction, streamCreationAction } from 'features/actions'
import { createStreamSchema } from 'features/stream/CreateForm/schema'
import { StreamAmountDetails } from 'features/stream/CreateForm/StreamAmountDetails'
import { CreateStreamFormData, CreateStreamFormDataValidated } from 'features/stream/CreateForm/types'
import { useFuroStreamContract } from 'hooks'
import { FC, useCallback, useMemo, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

import { GeneralDetailsSection } from './GeneralDetailsSection'

export const CreateForm: FC = () => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const [error, setError] = useState<string>()
  const contract = useFuroStreamContract(activeChain?.id)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()
  const [signature, setSignature] = useState<Signature>()

  const methods = useForm<CreateStreamFormData>({
    // @ts-ignore
    resolver: yupResolver(createStreamSchema),
    defaultValues: {
      currency: undefined,
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
  const [currency, amount] = watch(['currency', 'amount'])

  const amountAsEntity = useMemo(() => {
    if (!currency || !amount) return undefined

    let value = undefined
    try {
      value = Amount.fromRawAmount(currency, JSBI.BigInt(parseUnits(amount, currency.decimals).toString()))
    } catch (e) {}

    return value
  }, [amount, currency])

  const onSubmit: SubmitHandler<CreateStreamFormData> = useCallback(
    async (data) => {
      if (!amountAsEntity || !contract || !account?.address) return

      // Can cast here safely since input must have been validated already
      const _data = data as CreateStreamFormDataValidated

      setError(undefined)

      const actions = [
        approveBentoBoxAction({ contract, user: account.address, signature }),
        streamCreationAction({
          contract,
          recipient: _data.recipient,
          currency: _data.currency,
          startDate: new Date(_data.startDate),
          endDate: new Date(_data.endDate),
          amount: amountAsEntity,
          fromBentobox: _data.fundSource === FundSource.BENTOBOX,
        }),
      ]

      try {
        const data = await sendTransactionAsync({
          request: {
            from: account?.address,
            to: contract?.address,
            data: batchAction({ contract, actions }),
            value: amountAsEntity.currency.isNative ? amountAsEntity.quotient.toString() : '0',
          },
        })

        createToast({
          title: 'Create stream',
          description: `You have successfully created a stream`,
          promise: data.wait(),
        })
      } catch (e: any) {
        setError(e.message)

        log.tenderly({
          chainId: activeChain?.id,
          from: account.address,
          to: contract.address,
          data: batchAction({ contract, actions }),
          value: amountAsEntity.currency.isNative ? amountAsEntity.quotient.toString() : '0',
        })
      }
    },
    [account?.address, activeChain?.id, amountAsEntity, contract, sendTransactionAsync, signature]
  )

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Stream" onSubmit={methods.handleSubmit(onSubmit)}>
          <GeneralDetailsSection />
          <StreamAmountDetails />
          <Form.Buttons>
            <Approve
              components={
                <Approve.Components>
                  <Approve.Bentobox address={contract?.address} onSignature={setSignature} />
                  <Approve.Token
                    amount={amountAsEntity}
                    address={activeChain ? BENTOBOX_ADDRESS[activeChain?.id] : undefined}
                  />
                </Approve.Components>
              }
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
