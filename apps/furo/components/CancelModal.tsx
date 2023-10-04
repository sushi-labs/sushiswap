import { TrashIcon } from '@heroicons/react/outline'
import { Chain, ChainId } from '@sushiswap/chain'
import { shortenAddress } from 'sushi'
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
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import { useAccount, usePrepareSendTransaction, useWaitForTransaction } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { FC, useCallback, useMemo } from 'react'
import { Abi, Address, encodeFunctionData } from 'viem'

import { Stream, Vesting } from '../lib'

interface CancelModalProps {
  title: string
  stream?: Stream | Vesting
  abi: Abi
  address: Address
  fn: string
  chainId: ChainId
}

export const CancelModal: FC<CancelModalProps> = ({ stream, abi, address: contractAddress, fn, title, chainId }) => {
  const { address } = useAccount()

  const type = stream instanceof Vesting ? 'Vest' : 'Stream'

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!stream || !address) return

    return {
      account: address,
      to: contractAddress,
      data: encodeFunctionData({ abi, functionName: fn, args: [stream.id, false] }),
    }
  }, [stream, address, contractAddress, abi, fn])

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data) return

      const ts = new Date().getTime()
      createToast({
        account: address,
        type: 'cancelStream',
        txHash: data.hash,
        chainId,
        timestamp: ts,
        groupTimestamp: ts,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Cancelling ${type.toLowerCase()}`,
          completed: `Successfully cancelled ${type.toLowerCase()}`,
          failed: `Something went wrong cancelling the ${type.toLowerCase()}`,
        },
      })
    },
    [type, chainId, address]
  )

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(stream && address),
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

  if (!address || !stream?.canCancel(address)) return <></>

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <DialogTrigger asChild>
              <Button testId={`${type.toLowerCase()}-cancel`} variant="secondary" icon={TrashIcon}>
                Cancel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel stream</DialogTitle>
                <DialogDescription>
                  This will send the remaining amount of{' '}
                  <span className="font-medium text-gray-900 dark:text-slate-200">
                    {stream?.remainingAmount?.toSignificant(6)} {stream?.remainingAmount?.currency.symbol}
                  </span>{' '}
                  to{' '}
                  <a
                    target="_blank"
                    className="font-semibold text-blue"
                    href={Chain.from(stream.chainId).getAccountUrl(stream.createdBy.id)}
                    rel="noreferrer"
                  >
                    {shortenAddress(stream?.createdBy.id)}
                  </a>
                  .
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4" />
              <DialogFooter>
                <Checker.Connect fullWidth>
                  <Checker.Network fullWidth chainId={chainId}>
                    <Button
                      size="xl"
                      fullWidth
                      disabled={isWritePending || stream?.isEnded}
                      onClick={() => sendTransactionAsync?.().then(() => confirm())}
                      testId="cancel-confirmation"
                    >
                      {isWritePending ? <Dots>Confirm Cancel</Dots> : title}
                    </Button>
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
        testId={`cancel-${type.toLowerCase()}-confirmation-modal`}
        successMessage={`Successfully cancelled ${type.toLowerCase()}`}
        txHash={data?.hash}
      />
    </DialogProvider>
  )
}
