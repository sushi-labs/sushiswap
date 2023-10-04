import { isAddress } from '@ethersproject/address'
import { BENTOBOX_ADDRESS, BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { shortenAddress } from 'sushi'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { FundSource } from '@sushiswap/hooks'
import {
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Dots } from '@sushiswap/ui/components/dots'
import { List } from '@sushiswap/ui/components/list/List'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  getFuroStreamRouterContractConfig,
  useAccount,
  useBentoBoxTotal,
  useFuroStreamRouterContract,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { useApproved, useSignature, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { format } from 'date-fns'
import React, { FC, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { Hex } from 'viem'

import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../../lib'
import { ZFundSourceToFundSource, ZTokenToToken } from '../../../lib/zod'
import { CreateMultipleStreamFormSchemaType } from '../schema'

const APPROVE_TAG = 'createStreamSingle'

export const ExecuteSection: FC<{ chainId: FuroChainId; index: number }> = withCheckerRoot(({ chainId, index }) => {
  const { address } = useAccount()
  const { approved } = useApproved(APPROVE_TAG)
  const { signature, setSignature } = useSignature(APPROVE_TAG)
  const contract = useFuroStreamRouterContract(chainId)

  const {
    watch,
    formState: { isValid, isValidating, errors },
  } = useFormContext<CreateMultipleStreamFormSchemaType>()

  const [amount, currency, fundSource, recipient, dates] = watch([
    `streams.${index}.amount`,
    `streams.${index}.currency`,
    `streams.${index}.fundSource`,
    `streams.${index}.recipient`,
    `streams.${index}.dates`,
  ])

  const _amount = useMemo(
    () => (currency ? tryParseAmount(amount, ZTokenToToken.parse(currency)) : undefined),
    [amount, currency]
  )
  const _fundSource = ZFundSourceToFundSource.parse(fundSource)
  const rebase = useBentoBoxTotal(chainId as BentoBoxChainId, _amount?.currency)

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !_amount) return

      const ts = new Date().getTime()

      void createToast({
        account: address,
        type: 'createStream',
        chainId: chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Creating ${_amount.toSignificant(6)} ${_amount.currency.symbol} stream`,
          completed: `Created ${_amount.toSignificant(6)} ${_amount.currency.symbol} stream`,
          failed: 'Something went wrong trying to create a stream',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [_amount, chainId, address]
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (
      !_amount ||
      !contract ||
      !address ||
      !chainId ||
      !rebase ||
      !dates?.startDate ||
      !dates?.endDate ||
      !recipient ||
      !isAddress(recipient)
    )
      return

    const actions: Hex[] = []
    if (signature) {
      actions.push(approveBentoBoxAction({ user: address, signature }))
    }

    actions.push(
      streamCreationAction({
        recipient,
        currency: _amount.currency,
        startDate: new Date(dates.startDate),
        endDate: new Date(dates.endDate),
        amount: _amount,
        fromBentobox: _fundSource === FundSource.BENTOBOX,
        minShare: _amount.toShare(rebase),
      })
    )

    return {
      account: address,
      to: contract?.address,
      data: batchAction({ actions }),
      value: _amount.currency.isNative ? _amount.quotient : 0n,
    }
  }, [_amount, _fundSource, address, chainId, contract, dates?.endDate, dates?.startDate, rebase, recipient, signature])

  const { config, isError } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(
      isValid &&
        _amount &&
        contract &&
        address &&
        chainId &&
        rebase &&
        dates?.startDate &&
        dates?.endDate &&
        recipient &&
        isAddress(recipient) &&
        approved
    ),
  })

  const { sendTransactionAsync, isLoading, data } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: () => {
      setSignature(undefined)
    },
  })

  const formValid = isValid && !isValidating && Object.keys(errors).length === 0

  const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

  return (
    <DialogProvider>
      <div className="grid grid-cols-3 gap-x-10">
        <div />
        <Checker.Connect fullWidth type="button" className="col-span-3 md:col-span-2">
          <Checker.Network fullWidth type="button" chainId={chainId} className="col-span-3 md:col-span-2">
            <Checker.Amounts
              fullWidth
              type="button"
              chainId={chainId}
              amounts={[_amount]}
              className="col-span-3 md:col-span-2"
            >
              <Checker.ApproveBentobox
                tag={APPROVE_TAG}
                type="button"
                fullWidth
                id="furo-create-single-stream-approve-bentobox"
                chainId={chainId as BentoBoxChainId}
                masterContract={getFuroStreamRouterContractConfig(chainId).address}
                className="col-span-3 md:col-span-2"
              >
                <Checker.ApproveERC20
                  fullWidth
                  type="button"
                  contract={BENTOBOX_ADDRESS[chainId as BentoBoxChainId]}
                  id="furo-create-single-stream-approve-token"
                  amount={_amount}
                  className="col-span-3 md:col-span-2"
                >
                  <Checker.Success tag={APPROVE_TAG}>
                    <DialogReview>
                      {({ confirm }) => (
                        <>
                          <DialogTrigger asChild>
                            <Button
                              size="xl"
                              type="button"
                              fullWidth
                              disabled={!formValid}
                              testId="review-single-stream"
                              className="col-span-3 md:col-span-2"
                            >
                              Review stream
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Stream</DialogTitle>
                              <DialogDescription>
                                {_amount?.toSignificant(6)} {_amount?.currency.symbol}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                              <List className="!pt-0">
                                <List.Control>
                                  <List.KeyValue flex title="Network">
                                    {Chain.from(chainId).name}
                                  </List.KeyValue>
                                  {recipient && isAddress(recipient) && (
                                    <List.KeyValue flex title="Recipient">
                                      <a
                                        target="_blank"
                                        href={Chain.from(chainId).getAccountUrl(recipient)}
                                        rel="noreferrer"
                                      >
                                        {shortenAddress(recipient)}
                                      </a>
                                    </List.KeyValue>
                                  )}
                                  {_amount && (
                                    <List.KeyValue flex title="Total amount">
                                      <div className="flex items-center gap-2">
                                        <Currency.Icon currency={_amount.currency} width={18} height={18} />
                                        {_amount?.toSignificant(6)} {_amount.currency.symbol}
                                      </div>
                                    </List.KeyValue>
                                  )}
                                  {dates?.startDate && (
                                    <List.KeyValue flex title="End date">
                                      {format(dates.startDate, 'dd MMM yyyy hh:mm')}
                                    </List.KeyValue>
                                  )}
                                  {dates?.endDate && (
                                    <List.KeyValue flex title="End date">
                                      {format(dates.endDate, 'dd MMM yyyy hh:mm')}
                                    </List.KeyValue>
                                  )}
                                </List.Control>
                              </List>
                            </div>
                            <DialogFooter>
                              <Button
                                fullWidth
                                size="xl"
                                loading={isLoading && !isError}
                                onClick={() => sendTransactionAsync?.().then(() => confirm())}
                                disabled={isError || !sendTransactionAsync}
                                color={isError ? 'red' : 'blue'}
                                testId="confirm-stream-creation"
                              >
                                {isError ? (
                                  'Shoot! Something went wrong :('
                                ) : isLoading ? (
                                  <Dots>Create</Dots>
                                ) : (
                                  'Create'
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </>
                      )}
                    </DialogReview>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </Checker.ApproveBentobox>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connect>
      </div>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="stream-confirmation-modal"
        successMessage="Successfully created stream!"
        txHash={data?.hash}
      />
    </DialogProvider>
  )
})
