import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import {
  ArrowCircleLeftIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  ExternalLinkIcon,
  TableIcon,
} from '@heroicons/react/outline'
import { yupResolver } from '@hookform/resolvers/yup'
import { Chain } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import log from '@sushiswap/log'
import {
  Button,
  classNames,
  createToast,
  Currency,
  Dots,
  Form,
  IconButton,
  Link as UILink,
  Table,
  Tooltip,
  Typography,
} from '@sushiswap/ui'
import { Approve, BENTOBOX_ADDRESS, useBentoBoxTotals, useFuroVestingRouterContract, usePrices } from '@sushiswap/wagmi'
import { format } from 'date-fns'
import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

import { approveBentoBoxAction, batchAction, vestingCreationAction } from '../../../lib'
import {
  CreateMultipleVestingFormData,
  CreateMultipleVestingFormDataTransformed,
  CreateVestingFormData,
  ScheduleReview,
  stepConfigurations,
  transformVestingFormData,
} from '../CreateForm'
import { createScheduleRepresentation } from '../createScheduleRepresentation'
import { ImportZone } from './ImportZone'
import { createMultipleVestingSchema } from './schema'
import { TableSection } from './TableSection'

export const CreateMultipleForm = () => {
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const contract = useFuroVestingRouterContract(activeChain?.id)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()
  const [signature, setSignature] = useState<Signature>()
  const [errors, setErrors] = useState<string[]>([])
  const [review, setReview] = useState(false)
  const { data: prices } = usePrices({ chainId: activeChain?.id })

  const methods = useForm<CreateMultipleVestingFormData>({
    // @ts-ignore
    resolver: yupResolver(createMultipleVestingSchema),
    defaultValues: {
      vestings: [
        {
          currency: undefined,
          cliff: false,
          startDate: undefined,
          recipient: undefined,
          cliffEndDate: undefined,
          cliffAmount: '',
          stepPayouts: 1,
          stepAmount: '',
          stepConfig: stepConfigurations[0],
          fundSource: undefined,
          insufficientBalance: false,
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

  const formData = watch()

  // @ts-ignore
  const vestings = watch('vestings')

  const rebases = useBentoBoxTotals(
    activeChain?.id,
    vestings.map(({ currency }) => {
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

  const onSubmit = useCallback(
    async (data: CreateMultipleVestingFormDataTransformed | undefined) => {
      if (!contract || !address || !activeChain?.id || !data) return

      const summedValue = data.vestings.reduce<Amount<Native>>((acc, cur) => {
        if (cur.totalAmount?.currency?.isNative) {
          acc = acc.add(cur.totalAmount as Amount<Native>)
        }

        return acc
      }, Amount.fromRawAmount(Native.onChain(activeChain.id), '0'))

      const actions = []

      if (signature) {
        actions.push(approveBentoBoxAction({ contract, user: address, signature }))
      }

      data.vestings
        .reduce<string[]>((acc, cur) => {
          if (
            cur?.recipient &&
            cur?.currency &&
            cur?.startDate &&
            cur?.cliffDuration &&
            cur?.stepConfig?.time &&
            cur?.stepPercentage &&
            cur?.totalAmount &&
            cur?.stepPayouts
          ) {
            acc.push(
              vestingCreationAction({
                contract,
                recipient: cur.recipient,
                currency: cur.currency,
                startDate: new Date(cur.startDate),
                cliffDuration: cur.cliffDuration.toString(),
                stepDuration: cur.stepConfig?.time.toString(),
                steps: cur.stepPayouts.toString(),
                stepPercentage: cur.stepPercentage.toString(),
                amount: cur.totalAmount.quotient.toString(),
                fromBentobox: cur.fundSource === FundSource.BENTOBOX,
                minShare: cur.totalAmount.toShare(rebases[cur.currency.wrapped.address]),
              })
            )
          }
          return acc
        }, [])
        .forEach((vesting) => actions.push(vesting))

      try {
        const resp = await sendTransactionAsync({
          request: {
            from: address,
            to: contract.address,
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
                Creating {data.vestings.length} stream{data.vestings.length > 0 ? 's' : ''}
              </Dots>
            ),
            completed: `Successfully created ${data.vestings.length} stream${data.vestings.length > 0 ? 's' : ''}`,
            failed: 'Something went wrong creating vestings',
          },
        })

        setSignature(undefined)
      } catch (e: any) {
        console.log(contract.address, batchAction({ contract, actions }), summedValue.quotient.toString())
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

  const validatedData: CreateMultipleVestingFormDataTransformed | undefined = useMemo(() => {
    if (!isValid || isValidating) return undefined
    return {
      ...formData,
      vestings: formData.vestings.map((vest) => transformVestingFormData(vest as CreateVestingFormData)),
    }
  }, [formData, isValid, isValidating])

  useEffect(() => {
    reset()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChain?.id, address])

  // createMultipleVestingSchema
  //   .validate(formData, { abortEarly: false })
  //   .then(function () {
  //     console.log('valid')
  //   })
  //   .catch(function (err) {
  //     err?.inner?.forEach((e: any) => {
  //       console.log(e.message, e.path)
  //     })
  //   })

  const summedAmounts = validatedData
    ? Object.values(
        validatedData.vestings.reduce<Record<string, Amount<Type>>>((acc, cur) => {
          if (!cur.totalAmount) return acc
          const address = cur.totalAmount.currency.isToken ? cur.totalAmount.currency.address : AddressZero
          if (acc[address]) {
            acc[address] = acc[address].add(cur.totalAmount)
          } else {
            acc[address] = cur.totalAmount
          }

          return acc
        }, {})
      )
    : []

  return (
    <div className={classNames('flex flex-col gap-10')}>
      <Link href="/vesting/create" passHref={true}>
        <a>
          <button className="flex gap-3 font-medium group hover:text-white text-slate-200">
            <ArrowCircleLeftIcon width={24} height={24} /> <span>Create Vesting</span>
          </button>
        </a>
      </Link>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => onSubmit(validatedData))}>
          <div
            className={classNames(
              review ? 'hidden md:hidden' : 'flex',
              'flex-col md:grid md:grid-cols-[296px_auto] gap-y-10 lg:gap-20'
            )}
          >
            <ImportZone onErrors={setErrors} />
            <div className="flex flex-col col-span-2 gap-4">
              <Typography weight={500}>Vestings</Typography>
              <div className="flex flex-col">
                {errors.map((el, idx) => (
                  <Typography variant="sm" className="flex items-center gap-2 text-red" key={idx}>
                    <ExclamationCircleIcon width={20} height={20} />
                    {el}
                  </Typography>
                ))}
                <>
                  {formStateErrors.vestings?.map((errors, idx) =>
                    Object.entries(errors).map(([k, v]) => (
                      <Typography variant="sm" className="flex items-center gap-2 text-red" key={`${idx}-${k}`}>
                        <ExclamationCircleIcon width={20} height={20} />
                        Vesting {idx + 1}: {(v as any).message}
                      </Typography>
                    ))
                  )}
                </>
              </div>
              <TableSection />
              <Form.Buttons className="flex flex-col items-end gap-3 mt-[-68px]">
                <Button
                  type="button"
                  onClick={() => setReview(true)}
                  disabled={formData?.vestings?.length === 0 || !isValid || isValidating}
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
                    Review Vestings
                  </Typography>
                  <Typography variant="sm" className="text-slate-400" weight={500}>
                    Created vestings can be cancelled anytime by the owner of the stream.
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
                          <Table.th className="text-left">End Date</Table.th>
                          <Table.th className="text-left">Vesting Schedule</Table.th>
                        </Table.thr>
                      </Table.thead>
                      <Table.tbody>
                        {validatedData?.vestings.map((el, idx) => (
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
                              {el.totalAmount?.toSignificant(6)} {el.totalAmount?.currency.symbol}
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
                            <Table.td className="flex items-center gap-2">
                              {el.cliff ? `Cliff, ${el.stepConfig?.label}` : el.stepConfig.label}
                              <Tooltip
                                button={
                                  <IconButton as="div">
                                    <TableIcon width={16} height={16} />
                                  </IconButton>
                                }
                                panel={
                                  el.currency && el.stepPayouts ? (
                                    <div className="p-1 bg-slate-800">
                                      <ScheduleReview
                                        currency={el.currency}
                                        schedule={createScheduleRepresentation({
                                          currency: el.currency,
                                          cliffAmount: el.cliffAmount,
                                          stepAmount: el.stepAmount,
                                          stepDuration: el.stepConfig.time * 1000,
                                          startDate: el.startDate,
                                          cliffEndDate: el.cliffEndDate,
                                          stepPayouts: el.stepPayouts,
                                        })}
                                      />
                                    </div>
                                  ) : (
                                    <div />
                                  )
                                }
                              />
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
                          formData?.vestings?.length === 0 || isWritePending || !approved || !isValid || isValidating
                        }
                      >
                        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Vestings'}
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
