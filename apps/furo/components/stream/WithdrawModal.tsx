import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { DownloadIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { FuroStreamChainId } from '@sushiswap/furo'
import { TextField } from '@sushiswap/ui'
import { DialogDescription, DialogHeader, DialogTitle } from '@sushiswap/ui'
import { DialogContent, DialogFooter, DialogTrigger } from '@sushiswap/ui'
import { DialogConfirm, DialogProvider, DialogReview } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  _useSendTransaction as useSendTransaction,
  useAccount,
  useFuroStreamContract,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'

import { Stream, useStreamBalance } from '../../lib'

interface WithdrawModalProps {
  stream: Stream
  chainId: FuroStreamChainId
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ stream, chainId }) => {
  const { address } = useAccount()
  const { data: balance } = useStreamBalance({ chainId, streamId: stream.id, token: stream.token })
  const contract = useFuroStreamContract(chainId)

  const [input, setInput] = useState<string>('')

  const amount = useMemo(() => {
    if (!stream.token) return undefined
    return tryParseAmount(input, stream.token)
  }, [input, stream.token])

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !amount) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'withdrawStream',
        txHash: data.hash,
        chainId: chainId,
        timestamp: ts,
        groupTimestamp: ts,
        promise: data.wait(),
        summary: {
          pending: `Withdrawing ${amount.toSignificant(6)} ${amount.currency.symbol}`,
          completed: `Successfully withdrawn ${amount.toSignificant(6)} ${amount.currency.symbol}`,
          failed: 'Something went wrong withdrawing from stream',
        },
      })
    },
    [amount, chainId, address]
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!stream || !amount || !chainId || !contract) return

      setRequest({
        from: address,
        to: contract.address,
        data: contract.interface.encodeFunctionData('withdrawFromStream', [
          BigNumber.from(stream.id),
          BigNumber.from(amount.toShare(stream.rebase).quotient.toString()),
          stream.recipient.id,
          false,
          '0x',
        ]),
      })
    },
    [stream, amount, chainId, contract, address]
  )

  const {
    sendTransactionAsync,
    isLoading: isWritePending,
    data,
  } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    enabled: Boolean(!!stream && !!amount && !!chainId && !!contract),
  })

  const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

  if (!address || !stream.canWithdraw(address)) return <></>

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div>
              <DialogTrigger asChild>
                <Button icon={DownloadIcon} variant="secondary" fullWidth disabled={!stream.canWithdraw(address)}>
                  Withdraw
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw</DialogTitle>
                <DialogDescription>
                  You have{' '}
                  <span
                    onClick={() => setInput(balance?.toExact() ?? '')}
                    role="button"
                    className="font-semibold text-blue"
                  >
                    {balance?.toSignificant(6)} {balance?.currency.symbol}
                  </span>{' '}
                  available for withdrawal. <br />
                  Any withdrawn amount will be sent to{' '}
                  <a
                    target="_blank"
                    className="font-semibold text-blue"
                    href={Chain.from(stream.chainId).getAccountUrl(stream.recipient.id)}
                    rel="noreferrer"
                  >
                    {shortenAddress(stream.recipient.id)}
                  </a>
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <TextField
                  type="number"
                  placeholder="Amount"
                  testdata-id="withdraw-modal-input"
                  value={input}
                  onValueChange={setInput}
                  unit={stream.token?.symbol}
                />
              </div>
              <DialogFooter>
                <Checker.Connect fullWidth>
                  <Checker.Network fullWidth chainId={chainId}>
                    <Checker.Guard guardWhen={!amount?.greaterThan(0)} guardText="Enter amount">
                      <Checker.Guard
                        guardWhen={Boolean(stream.balance && amount?.greaterThan(stream.balance))}
                        guardText="Not enough available"
                      >
                        <Button
                          size="xl"
                          fullWidth
                          disabled={isWritePending || !stream.balance}
                          onClick={() => sendTransactionAsync?.().then(() => confirm())}
                          testId="withdraw-modal-confirmation"
                        >
                          {!stream.token ? (
                            'Invalid stream token'
                          ) : isWritePending ? (
                            <Dots>Confirm Withdraw</Dots>
                          ) : (
                            'Withdraw'
                          )}
                        </Button>
                      </Checker.Guard>
                    </Checker.Guard>
                  </Checker.Network>
                </Checker.Connect>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="withdraw-stream-confirmation-modal"
        successMessage={`Successfully withdrawn from stream`}
        txHash={data?.hash}
      />
    </DialogProvider>
  )
}
