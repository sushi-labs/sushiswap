import { TrashIcon } from '@heroicons/react/outline'
import { Chain, ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { Button } from '@sushiswap/ui/components/button'
import { Dialog } from '@sushiswap/ui/components/dialog/Dialog'
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import { useAccount, usePrepareSendTransaction } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Abi, Address, encodeFunctionData } from 'viem'

import { Stream, Vesting } from '../lib'

interface CancelModalProps {
  title: string
  stream?: Stream | Vesting
  abi: Abi
  address: Address
  fn: string
  chainId: ChainId
  children?({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
}

export const CancelModal: FC<CancelModalProps> = ({
  stream,
  abi,
  address: contractAddress,
  fn,
  title,
  chainId,
  children,
}) => {
  const [open, setOpen] = useState(false)
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
          pending: `Cancelling ${type}`,
          completed: `Successfully cancelled ${type}`,
          failed: `Something went wrong cancelling the ${type}`,
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

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess() {
      setOpen(false)
    },
  })

  if (!address || !stream?.canCancel(address)) return <></>

  return (
    <>
      {typeof children === 'function' ? (
        children({ setOpen })
      ) : (
        <Button fullWidth variant="destructive" icon={TrashIcon} onClick={() => setOpen(true)}>
          Cancel
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-4 !pb-3 !bg-white dark:!bg-slate-800">
          <Dialog.Header title={title} onClose={() => setOpen(false)} />
          <p className="text-sm text-gray-700 dark:text-slate-400">
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
          </p>
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={chainId}>
              <Button
                size="xl"
                fullWidth
                disabled={isWritePending || stream?.isEnded}
                onClick={() => sendTransaction?.()}
                testId="cancel-confirmation"
              >
                {isWritePending ? <Dots>Confirm Cancel</Dots> : title}
              </Button>
            </Checker.Network>
          </Checker.Connect>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
