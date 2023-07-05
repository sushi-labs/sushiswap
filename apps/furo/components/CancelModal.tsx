import { TransactionRequest } from '@ethersproject/providers'
import { TrashIcon } from '@heroicons/react/outline'
import { Chain, ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { Button } from '@sushiswap/ui/components/button'
import { Dialog } from '@sushiswap/ui/components/dialog/Dialog'
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import { useAccount, useContract } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useState } from 'react'

import { Stream, Vesting } from '../lib'

interface CancelModalProps {
  title: string
  stream?: Stream | Vesting
  abi: NonNullable<Parameters<typeof useContract>['0']>['abi']
  address: string
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

  const contract = useContract({
    address: contractAddress,
    abi: abi,
  })

  const type = stream instanceof Vesting ? 'Vest' : 'Stream'

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!stream || !address) return

      setRequest({
        from: address,
        to: contractAddress,
        data: contract?.interface.encodeFunctionData(fn, [stream.id, false]),
      })
    },
    [stream, address, contractAddress, contract?.interface, fn]
  )

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
        promise: data.wait(),
        summary: {
          pending: `Cancelling ${type}`,
          completed: `Successfully cancelled ${type}`,
          failed: `Something went wrong cancelling the ${type}`,
        },
      })
    },
    [type, chainId, address]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess() {
      setOpen(false)
    },
    enabled: Boolean(stream && address),
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
