import { isAddress } from '@ethersproject/address'
import { Signature } from '@ethersproject/bytes'
import { TransactionRequest } from '@ethersproject/providers'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Dots } from '@sushiswap/ui/future/components/dots'
import {
  getFuroStreamRouterContractConfig,
  useAccount,
  useBentoBoxTotal,
  useFuroStreamRouterContract,
} from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { FuroStreamRouterChainId } from '@sushiswap/furo'

import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../../lib'
import { ZFundSourceToFundSource, ZTokenToToken } from '../../../lib/zod'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { Button } from '@sushiswap/ui/future/components/button'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Chain } from '@sushiswap/chain'
import { format } from 'date-fns'
import { TxStatusModalContent } from '@sushiswap/wagmi/future/components/TxStatusModal'
import { shortenAddress } from '@sushiswap/format'
import { CreateMultipleStreamFormSchemaType } from '../schema'

const APPROVE_TAG = 'createStreamSingle'
const MODAL_ID = 'createStreamSingle'

export const ExecuteSection: FC<{ chainId: FuroStreamRouterChainId; index: number }> = withCheckerRoot(
  ({ chainId, index }) => {
    const { address } = useAccount()
    const { approved } = useApproved(APPROVE_TAG)
    const contract = useFuroStreamRouterContract(chainId)
    const [signature, setSignature] = useState<Signature>()

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
    const rebase = useBentoBoxTotal(chainId, _amount?.currency)

    const onSettled = useCallback(
      async (data: SendTransactionResult | undefined) => {
        if (!data || !_amount) return

        const ts = new Date().getTime()

        void createToast({
          account: address,
          type: 'createStream',
          chainId: chainId,
          txHash: data.hash,
          promise: data.wait(),
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

    const prepare = useCallback(
      async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
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

        const actions: string[] = []
        if (signature) {
          actions.push(approveBentoBoxAction({ contract, user: address, signature }))
        }

        actions.push(
          streamCreationAction({
            contract,
            recipient,
            currency: _amount.currency,
            startDate: new Date(dates.startDate),
            endDate: new Date(dates.endDate),
            amount: _amount,
            fromBentobox: _fundSource === FundSource.BENTOBOX,
            minShare: _amount.toShare(rebase),
          })
        )

        setRequest({
          from: address,
          to: contract?.address,
          data: batchAction({ contract, actions }),
          value: _amount.currency.isNative ? _amount.quotient.toString() : '0',
        })
      },
      [_amount, _fundSource, address, chainId, contract, dates?.endDate, dates?.startDate, rebase, recipient, signature]
    )

    const { sendTransactionAsync, isLoading, data, isError } = useSendTransaction({
      chainId,
      prepare,
      onSettled,
      onSuccess: () => {
        setSignature(undefined)
      },
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

    const formValid = isValid && !isValidating && Object.keys(errors).length === 0

    return (
      <>
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
                  type="button"
                  fullWidth
                  id="furo-create-single-stream-approve-bentobox"
                  chainId={chainId as BentoBoxV1ChainId}
                  contract={getFuroStreamRouterContractConfig(chainId).address}
                  onSignature={setSignature}
                  className="col-span-3 md:col-span-2"
                >
                  <Checker.ApproveERC20
                    fullWidth
                    type="button"
                    contract={bentoBoxV1Address[chainId]}
                    id="furo-create-single-stream-approve-token"
                    amount={_amount}
                    className="col-span-3 md:col-span-2"
                  >
                    <Checker.Success tag={APPROVE_TAG}>
                      <Modal.Trigger tag={MODAL_ID}>
                        {({ open }) => (
                          <Button
                            type="button"
                            fullWidth
                            disabled={!formValid}
                            onClick={open}
                            testId="review-single-stream"
                            className="col-span-3 md:col-span-2"
                          >
                            {isLoading ? <Dots>Confirm transaction</Dots> : 'Review stream'}
                          </Button>
                        )}
                      </Modal.Trigger>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.ApproveBentobox>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </div>
        <Modal.Review tag={MODAL_ID} variant="opaque">
          {({ close, confirm }) => (
            <div className="max-w-[504px] mx-auto">
              <button onClick={close} className="p-3 pl-0">
                <ArrowLeftIcon strokeWidth={3} width={24} height={24} />
              </button>
              <div className="flex items-start justify-between gap-4 py-2">
                <div className="flex flex-col flex-grow gap-1">
                  <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-50">Create Stream</h1>
                  <h1 className="text-lg font-medium text-gray-600 dark:text-slate-300">{currency?.symbol}</h1>
                </div>
                <div>{_amount && <Currency.Icon currency={_amount.currency} width={56} height={56} />}</div>
              </div>
              <div className="flex flex-col gap-3">
                <List>
                  <List.Control>
                    <List.KeyValue flex title="Network">
                      {Chain.from(chainId).name}
                    </List.KeyValue>
                    {recipient && isAddress(recipient) && (
                      <List.KeyValue flex title="Recipient">
                        <a target="_blank" href={Chain.from(chainId).getAccountUrl(recipient)} rel="noreferrer">
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
              <div className="pt-4">
                <div className="space-y-4">
                  <Button
                    fullWidth
                    loading={isLoading && !isError}
                    onClick={() => sendTransactionAsync?.().then(() => confirm())}
                    disabled={isError || !sendTransactionAsync}
                    color={isError ? 'red' : 'blue'}
                    testId="confirm-stream-creation"
                  >
                    {isError ? 'Shoot! Something went wrong :(' : isLoading ? <Dots>Create</Dots> : 'Create'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Review>
        <Modal.Confirm tag={MODAL_ID} variant="transparent">
          {({ close }) => (
            <TxStatusModalContent
              testId="stream-confirmation-modal"
              tag={MODAL_ID}
              chainId={chainId}
              hash={data?.hash}
              successMessage={'Successfully created stream'}
              onClose={close}
            />
          )}
        </Modal.Confirm>
      </>
    )
  }
)
