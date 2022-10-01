import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { ArrowCircleLeftIcon, ArrowLeftIcon, ExclamationCircleIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import { yupResolver } from '@hookform/resolvers/yup'
import { Chain } from '@sushiswap/chain'
import { Amount, Native, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import log from '@sushiswap/log'
import { Button, classNames, createToast, Currency, Dots, Form, Link as UILink, Table, Typography } from '@sushiswap/ui'
import { Approve, BENTOBOX_ADDRESS, useBentoBoxTotals, useFuroStreamRouterContract, usePrices } from '@sushiswap/wagmi'
import { format } from 'date-fns'
import Link from 'next/link'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useAccount, useNetwork, useDeprecatedSendTransaction } from 'wagmi'

import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../../lib'
import { CreateMultipleStreamFormData, CreateStreamFormDataValidated } from '../types'
import { ImportZone } from './ImportZone'
import { createMultipleStreamSchema } from './schema'
import { TableSection } from './TableSection'
import { transformStreamFormData } from './transformStreamFormData'

export const CreateMultipleForm: FC = () => {
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const contract = useFuroStreamRouterContract(activeChain?.id)
  const { sendTransactionAsync, isLoading: isWritePending } = useDeprecatedSendTransaction()
  const [signature, setSignature] = useState<Signature>()
  const [errors, setErrors] = useState<string[]>([])
  const [review, setReview] = useState(false)
  const { data: prices } = usePrices({ chainId: activeChain?.id })

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
    formState: { isValid, isValidating, errors: formStateErrors },
    reset,
    watch,
  } = methods

  // @ts-ignore
  const streams = watch('streams')

  const rebases = useBentoBoxTotals(
    activeChain?.id,
    streams.map(({ currency }) => {
      if (!currency) return undefined
      return currency.isNative
        ? Native.onChain(currency.chainId)
        : new Token({
            chainId: currency.chainId,
            decimals: currency.decimals,
            address: (currency as Token).address,
            name: currency.name,
            symbol: currency.symbol,
          })
    })
  )

  const onSubmit: SubmitHandler<CreateMultipleStreamFormData> = useCallback(
    async (data) => {
      if (!contract || !address || !activeChain?.id || !data.streams || !rebases) return

      const summedValue = data.streams.reduce<Amount<Native>>((acc, cur) => {
        if (cur.currency?.isNative) {
          const amount = tryParseAmount(String(cur.amount), cur.currency as Native)
          if (amount) {
            return acc.add(amount)
          }
        }
        return acc
      }, Amount.fromRawAmount(Native.onChain(activeChain.id), '0'))

      const actions = []

      if (signature) {
        actions.push(approveBentoBoxAction({ contract, user: address, signature }))
      }

      data.streams
        .reduce<string[]>((acc, { recipient, currency, startDate, endDate, amount, fundSource }) => {
          const _currency = currency.isNative
            ? Native.onChain(currency.chainId)
            : new Token({
                chainId: currency.chainId,
                decimals: currency.decimals,
                address: (currency as Token).address,
                name: currency.name,
                symbol: currency.symbol,
              })

          if (recipient && amount && startDate && endDate && rebases?.[_currency.wrapped.address]) {
            const parsedAmount = tryParseAmount(String(amount), _currency)
            if (parsedAmount) {
              acc.push(
                streamCreationAction({
                  contract,
                  recipient,
                  currency: _currency,
                  startDate: new Date(startDate),
                  endDate: new Date(endDate),
                  amount: parsedAmount,
                  fromBentobox: fundSource === FundSource.BENTOBOX,
                  minShare: parsedAmount.toShare(rebases[_currency.wrapped.address]),
                })
              )
            }
          }

          return acc
        }, [])
        .forEach((action) => actions.push(action))

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

        setSignature(undefined)
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
    [address, activeChain?.id, contract, sendTransactionAsync, signature, rebases]
  )

  useEffect(() => {
    reset()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChain?.id, address])

  const validatedData = useMemo(() => {
    if (!isValid || isValidating) return undefined
    return {
      ...streams,
      streams: streams.map((vest) => transformStreamFormData(vest as CreateStreamFormDataValidated)),
    }
  }, [isValid, isValidating, streams])

  // createMultipleStreamSchema
  //   .validate(validatedData, { abortEarly: false })
  //   .then(function () {
  //     console.log('valid')
  //   })
  //   .catch(function (err) {
  //     err?.inner?.forEach((e) => {
  //       console.log(e.message, e.path)
  //     })
  //   })

  const summedAmounts = validatedData
    ? Object.values(
        validatedData.streams.reduce<Record<string, Amount<Type>>>((acc, cur) => {
          if (!cur.amount) return acc
          const address = cur.amount.currency.isToken ? cur.amount.currency.address : AddressZero
          if (acc[address]) {
            acc[address] = acc[address].add(cur.amount)
          } else {
            acc[address] = cur.amount
          }
          return acc
        }, {})
      )
    : []

  return (
    <div className={classNames('flex flex-col gap-10')}>
      <Link href="/stream/create" passHref={true}>
        <a>
          <button className="flex gap-3 font-medium group hover:text-white text-slate-200">
            <ArrowCircleLeftIcon width={24} height={24} /> <span>Create Stream</span>
          </button>
        </a>
      </Link>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div
            className={classNames(
              review ? 'hidden md:hidden' : 'flex',
              'flex flex-col md:grid md:grid-cols-[296px_auto] gap-y-10 lg:gap-20'
            )}
          >
            <ImportZone onErrors={setErrors} />
            <div className="flex flex-col col-span-2 gap-4">
              <Typography weight={500}>Streams</Typography>
              <div className="flex flex-col">
                {errors.map((el, idx) => (
                  <Typography variant="sm" className="flex items-center gap-2 text-red" key={idx}>
                    <ExclamationCircleIcon width={20} height={20} />
                    {el}
                  </Typography>
                ))}
                {formStateErrors.streams?.map((errors, idx) => {
                  if (errors) {
                    return Object.entries(errors).map(([k, v]) => (
                      <Typography variant="sm" className="flex items-center gap-2 text-red" key={`${idx}-${k}`}>
                        <ExclamationCircleIcon width={20} height={20} />
                        Stream {idx + 1}: {(v as any).message}
                      </Typography>
                    ))
                  }
                })}
              </div>
              <TableSection />
              <Form.Buttons className="flex flex-col items-end gap-3">
                <Button
                  type="button"
                  onClick={() => setReview(true)}
                  disabled={streams?.length === 0 || !isValid || isValidating}
                >
                  Review Details
                </Button>
              </Form.Buttons>
            </div>
          </div>
          {review && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col bg-white bg-opacity-[0.01] rounded-2xl p-6 gap-10">
                <div className="flex flex-col gap-4">
                  <Typography variant="h3" className="text-slate-50" weight={500}>
                    Review Streams
                  </Typography>
                  <Typography variant="sm" className="text-slate-400" weight={500}>
                    Created streams can be cancelled anytime by the owner of the stream.
                  </Typography>
                </div>

                <div className="flex flex-col gap-4">
                  <Table.container>
                    <Table.table>
                      <Table.thead>
                        <Table.thr>
                          <Table.th className="text-left">Token</Table.th>
                          <Table.th className="text-left">Amount</Table.th>
                          <Table.th className="text-left">Value</Table.th>
                        </Table.thr>
                      </Table.thead>
                      <Table.tbody>
                        {summedAmounts.map((el, idx) => (
                          <Table.tr key={idx}>
                            <Table.td className="flex items-center gap-2">
                              <Currency.Icon currency={el.currency} width={20} height={20} />
                              {el.currency.symbol}
                            </Table.td>
                            <Table.td>
                              {el.toSignificant(6)} {el.currency.symbol}
                            </Table.td>
                            <Table.td>
                              {prices && prices?.[el.currency.wrapped.address]
                                ? `$${el.multiply(prices[el.currency.wrapped.address].asFraction).toFixed(2)}`
                                : '-'}
                            </Table.td>
                          </Table.tr>
                        ))}
                      </Table.tbody>
                    </Table.table>
                  </Table.container>
                </div>
                <div className="flex flex-col gap-4">
                  <Typography variant="sm">Recipient List</Typography>
                  <Table.container>
                    <Table.table>
                      <Table.thead>
                        <Table.thr>
                          <Table.th className="text-left">Recipient</Table.th>
                          <Table.th className="text-left">Token</Table.th>
                          <Table.th className="text-left">Total Amount</Table.th>
                          <Table.th className="text-left">Start Date</Table.th>
                          <Table.th className="text-left">End Date</Table.th>
                        </Table.thr>
                      </Table.thead>
                      <Table.tbody>
                        {validatedData?.streams.map((el, idx) => (
                          <Table.tr key={idx}>
                            <Table.td>
                              {activeChain && (
                                <UILink.External
                                  className="flex items-center gap-1 text-blue hover:underline-none hover:text-blue-400"
                                  href={Chain.from(activeChain.id).getAccountUrl(el.recipient)}
                                >
                                  {shortenAddress(el.recipient)} <ExternalLinkIcon width={16} height={16} />
                                </UILink.External>
                              )}
                            </Table.td>
                            <Table.td>{el.currency?.symbol}</Table.td>
                            <Table.td>
                              {el.amount?.toSignificant(6)} {el.amount?.currency.symbol}
                            </Table.td>
                            <Table.td>
                              {el.startDate instanceof Date && !isNaN(el.startDate?.getTime()) ? (
                                <Typography variant="sm" className="text-slate-50" weight={500}>
                                  {format(el.startDate, 'dd MMM yyyy hh:mmaaa')}
                                </Typography>
                              ) : (
                                <Typography variant="sm" className="italic text-slate-500">
                                  Not available
                                </Typography>
                              )}
                            </Table.td>
                            <Table.td>
                              {el.endDate instanceof Date && !isNaN(el.endDate?.getTime()) ? (
                                <Typography variant="sm" className="text-slate-50" weight={500}>
                                  {format(el.endDate, 'dd MMM yyyy hh:mmaaa')}
                                </Typography>
                              ) : (
                                <Typography variant="sm" className="italic text-slate-500">
                                  Not available
                                </Typography>
                              )}
                            </Table.td>
                          </Table.tr>
                        ))}
                      </Table.tbody>
                    </Table.table>
                  </Table.container>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="empty"
                  color="gray"
                  className="flex items-center gap-1 whitespace-nowrap"
                  onClick={() => setReview(false)}
                >
                  <ArrowLeftIcon width={16} height={16} /> Go Back and Edit
                </Button>
                <Approve
                  className="!items-end"
                  components={
                    <Approve.Components>
                      <Approve.Bentobox address={contract?.address} onSignature={setSignature} />
                      {summedAmounts.map((amount, index) => (
                        <Approve.Token
                          key={index}
                          amount={amount}
                          address={activeChain?.id ? BENTOBOX_ADDRESS[activeChain.id] : undefined}
                        />
                      ))}
                    </Approve.Components>
                  }
                  render={({ approved }) => {
                    return (
                      <Button
                        type="submit"
                        color="gradient"
                        disabled={
                          validatedData?.streams?.length === 0 ||
                          isWritePending ||
                          !approved ||
                          !isValid ||
                          isValidating
                        }
                      >
                        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Streams'}
                      </Button>
                    )
                  }}
                />
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}
