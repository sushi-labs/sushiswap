import { Signature } from '@ethersproject/bytes'
import { ArrowCircleLeftIcon } from '@heroicons/react/outline'
import { yupResolver } from '@hookform/resolvers/yup'
import { Chain } from '@sushiswap/chain'
import { Amount, Native, tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import log from '@sushiswap/log'
import { Button, createToast, Dots, Form, Typography } from '@sushiswap/ui'
import { Approve, BENTOBOX_ADDRESS, useFuroStreamContract } from '@sushiswap/wagmi'
import Link from 'next/link'
import { FC, useCallback, useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../../lib'
import { CreateMultipleStreamFormData } from '../types'
import { ImportZone } from './ImportZone'
import { createMultipleStreamSchema } from './schema'
import { TableSection } from './TableSection'

export const CreateMultipleForm: FC = () => {
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const contract = useFuroStreamContract(activeChain?.id)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()
  const [signature, setSignature] = useState<Signature>()

  const methods = useForm<CreateMultipleStreamFormData>({
    // @ts-ignore
    resolver: yupResolver(createMultipleStreamSchema),
    defaultValues: {
      streams: [
        {
          currency: undefined,
          startDate: undefined,
          endDate: undefined,
          recipient: undefined,
          amount: undefined,
          fundSource: FundSource.WALLET,
        },
      ],
    },
    mode: 'onChange',
  })

  const {
    formState: { isValid, isValidating },
    reset,
    watch,
  } = methods

  // @ts-ignore
  const streams = watch('streams')

  const onSubmit: SubmitHandler<CreateMultipleStreamFormData> = useCallback(
    async (data) => {
      if (!contract || !address || !activeChain?.id || !data.streams) return

      const summedValue = data.streams.reduce<Amount<Native>>((acc, cur) => {
        if (cur.currency?.isNative) {
          const amount = tryParseAmount(cur.amount, cur.currency as Native)
          if (amount) acc.add(amount)
        }

        return acc
      }, Amount.fromRawAmount(Native.onChain(activeChain.id), '0'))

      const actions = [
        approveBentoBoxAction({ contract, user: address, signature }),
        ...data.streams.reduce<string[]>((acc, { recipient, currency, startDate, endDate, amount, fundSource }) => {
          if (recipient && amount && startDate && endDate) {
            const parsedAmount = tryParseAmount(amount, currency as Type)
            if (parsedAmount) {
              acc.push(
                streamCreationAction({
                  contract,
                  recipient,
                  currency: currency as Type,
                  startDate: new Date(startDate),
                  endDate: new Date(endDate),
                  amount: parsedAmount,
                  fromBentobox: fundSource === FundSource.BENTOBOX,
                })
              )
            }
          }

          return acc
        }, []),
      ]

      try {
        const resp = await sendTransactionAsync({
          request: {
            from: address,
            to: contract?.address,
            data: batchAction({ contract, actions }),
            value: summedValue.quotient.toString(),
          },
        })

        createToast({
          txHash: resp.hash,
          href: Chain.from(activeChain.id).getTxUrl(resp.hash),
          promise: resp.wait(),
          summary: {
            pending: (
              <Dots>
                Creating {data.streams.length} stream{data.streams.length > 0 ? 's' : ''}
              </Dots>
            ),
            completed: `Successfully created ${data.streams.length} stream${data.streams.length > 0 ? 's' : ''}`,
            failed: 'Something went wrong creating streams',
          },
        })
      } catch (e: any) {
        log.tenderly({
          chainId: activeChain?.id,
          from: address,
          to: contract.address,
          data: batchAction({ contract, actions }),
          value: summedValue.quotient.toString(),
        })
      }
    },
    [address, activeChain?.id, contract, sendTransactionAsync, signature]
  )

  useEffect(() => {
    reset()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChain?.id, address])

  // createMultipleStreamSchema
  //   .validate(data, { abortEarly: false })
  //   .then(function () {
  //     console.log('valid')
  //   })
  //   .catch(function (err) {
  //     err?.inner?.forEach((e) => {
  //       console.log(e.message, e.path)
  //     })
  //   })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col mt-10 gap-20">
          <Link href="/vesting/create" passHref={true}>
            <a>
              <button className="group hover:text-white text-slate-200 flex gap-3 font-medium">
                <ArrowCircleLeftIcon width={24} height={24} /> <span>Create Stream</span>
              </button>
            </a>
          </Link>
          <div className="flex flex-col md:grid md:grid-cols-[296px_auto] gap-y-10 lg:gap-20">
            <ImportZone />
            <div className="flex flex-col gap-4 col-span-2">
              <Typography weight={500}>Streams</Typography>
              <TableSection />
              <Form.Buttons>
                <Approve
                  components={
                    <Approve.Components>
                      <Approve.Bentobox address={contract?.address} onSignature={setSignature} />
                      {streams.map((stream, index) => (
                        <Approve.Token
                          key={index}
                          amount={tryParseAmount(stream.amount, stream.currency)}
                          address={activeChain?.id ? BENTOBOX_ADDRESS[activeChain.id] : undefined}
                        />
                      ))}
                    </Approve.Components>
                  }
                  render={({ approved }) => {
                    return (
                      <Button
                        type="submit"
                        variant="filled"
                        color="gradient"
                        disabled={isWritePending || !approved || !isValid || isValidating}
                      >
                        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Streams'}
                      </Button>
                    )
                  }}
                />
              </Form.Buttons>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
