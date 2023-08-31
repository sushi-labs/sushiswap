import { DownloadIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { TextField } from '@sushiswap/ui'
import { DialogDescription, DialogHeader, DialogTitle } from '@sushiswap/ui'
import { DialogContent, DialogFooter, DialogTrigger } from '@sushiswap/ui'
import { DialogConfirm, DialogProvider, DialogReview } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  useAccount,
  useFuroStreamContract,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { Address, encodeFunctionData } from 'viem'

import { Stream, useStreamBalance } from '../../lib'

interface WithdrawModalProps {
  stream: Stream
  chainId: FuroChainId
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
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Withdrawing ${amount.toSignificant(6)} ${amount.currency.symbol}`,
          completed: `Successfully withdrawn ${amount.toSignificant(6)} ${amount.currency.symbol}`,
          failed: 'Something went wrong withdrawing from stream',
        },
      })
    },
    [amount, chainId, address]
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!stream || !amount || !chainId || !contract) return

    return {
      account: address,
      to: contract.address,
      data: encodeFunctionData({
        abi: contract.abi,
        functionName: 'withdrawFromStream',
        args: [BigInt(stream.id), amount.toShare(stream.rebase).quotient, stream.recipient.id as Address, false, '0x'],
      }),
    }
  }, [stream, amount, chainId, contract, address])

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(!!stream && !!amount && !!chainId && !!contract),
  })

  const {
    sendTransactionAsync,
    data,
    isLoading: isWritePending,
  } = useSendTransaction({
    ...config,
    onSettled,
  })

  const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

  if (!address || !stream.canWithdraw(address)) return <></>

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <DialogTrigger asChild>
              <Button
                id="stream-withdraw"
                icon={DownloadIcon}
                variant="secondary"
                disabled={!stream.canWithdraw(address)}
              >
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw</DialogTitle>
                <DialogDescription>
                  You have{' '}
                  <span
                    onClick={() => setInput(balance?.toExact() ?? '')}
                    onKeyDown={() => setInput(balance?.toExact() ?? '')}
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
                        guardText="No available tokens for withdrawal"
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
        successMessage={'Successfully withdrawn from stream'}
        txHash={data?.hash}
      />
    </DialogProvider>
  )
}
