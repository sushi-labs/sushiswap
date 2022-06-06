import { Signature } from '@ethersproject/bytes'
import { parseUnits } from '@ethersproject/units'
import { yupResolver } from '@hookform/resolvers/yup'
import { Chain } from '@sushiswap/chain'
import { Amount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import log from '@sushiswap/log'
import { JSBI } from '@sushiswap/math'
import { Button, createToast, Dots, Form } from '@sushiswap/ui'
import { BENTOBOX_ADDRESS, useFuroStreamContract } from '@sushiswap/wagmi'
import { Approve } from '@sushiswap/wagmi/systems'
import { approveBentoBoxAction, batchAction, streamCreationAction } from 'lib'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

import { GeneralDetailsSection } from './GeneralDetailsSection'
import { createStreamSchema } from './schema'
import { StreamAmountDetails } from './StreamAmountDetails'
import { CreateStreamFormData, CreateStreamFormDataValidated } from './types'

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
      amount: '',
    },
    mode: 'onChange',
  })

  const {
    formState: { isValid, isValidating },
    watch,
    reset,
  } = methods

  // @ts-ignore
  const [currency, amount] = watch(['currency', 'amount'])

  const amountAsEntity = useMemo(() => {
    if (!currency || !amount) return undefined

    let value = undefined
    try {
      value = Amount.fromRawAmount(currency, JSBI.BigInt(parseUnits(amount, currency.decimals).toString()))
    } catch (e) {
      console.debug(e)
    }

    return value
  }, [amount, currency])

  const onSubmit: SubmitHandler<CreateStreamFormData> = useCallback(
    async (data) => {
      if (!amountAsEntity || !contract || !account?.address || !activeChain?.id) return

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
          txHash: data.hash,
          href: Chain.from(activeChain.id).getTxUrl(data.hash),
          promise: data.wait(),
          summary: {
            pending: (
              <Dots>
                Creating {amountAsEntity?.toSignificant(6)} {amountAsEntity.currency.symbol} stream
              </Dots>
            ),
            completed: `Successfully created a ${amountAsEntity?.toSignificant(6)} ${
              amountAsEntity.currency.symbol
            } stream`,
            failed: 'Something went wrong creating a new stream',
          },
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

  useEffect(() => {
    reset()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChain?.id, account?.address])

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
                    address={activeChain?.id ? BENTOBOX_ADDRESS[activeChain.id] : undefined}
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
