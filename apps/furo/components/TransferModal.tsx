import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { ZERO } from '@sushiswap/math'
import { Button } from '@sushiswap/ui/components/button'
import { Dialog } from '@sushiswap/ui/components/dialog/Dialog'
import { Dots } from '@sushiswap/ui/components/dots'
import { Text } from '@sushiswap/ui/components/input/Text'
import { createToast } from '@sushiswap/ui/components/toast'
import { useAccount, useEnsAddress, usePrepareSendTransaction, useSendTransaction } from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Abi, Address, encodeFunctionData } from 'viem'

import { Stream, Vesting } from '../lib'

interface TransferModalProps {
  stream?: Stream | Vesting
  abi: Abi
  address: Address
  fn?: string
  chainId: ChainId
  children?({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
}

export const TransferModal: FC<TransferModalProps> = ({
  stream,
  abi,
  address: contractAddress,
  fn = 'transferFrom',
  chainId,
  children,
}) => {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)
  const [recipient, setRecipient] = useState<string>('')

  const type = stream instanceof Vesting ? 'Vest' : 'Stream'

  const { data: resolvedAddress } = useEnsAddress({
    name: recipient,
    chainId: ChainId.ETHEREUM,
  })

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!stream || !address || !recipient || !resolvedAddress) return

    return {
      from: address,
      to: contractAddress,
      data: encodeFunctionData({ abi, functionName: fn, args: [address, resolvedAddress, stream?.id] }),
    }
  }, [stream, address, recipient, resolvedAddress, contractAddress, abi, fn])

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !resolvedAddress || !address) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'transferStream',
        txHash: data.hash,
        chainId,
        timestamp: ts,
        groupTimestamp: ts,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Transferring ${type}`,
          completed: `Successfully transferred ${type} to ${shortenAddress(resolvedAddress)}`,
          failed: `Something went wrong transferring the ${type}`,
        },
      })
    },
    [address, chainId, resolvedAddress, type]
  )

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(stream && address && recipient && resolvedAddress),
  })

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess() {
      setOpen(false)
    },
  })

  if (!stream || stream?.isEnded || !stream?.canTransfer(address) || !stream?.remainingAmount?.greaterThan(ZERO))
    return <></>

  return (
    <>
      {typeof children === 'function' ? (
        children({ setOpen })
      ) : (
        <Button
          fullWidth
          icon={PaperAirplaneIcon}
          iconProps={{ className: 'transform rotate-45 mt-[-4px] ml-0.5' }}
          onClick={() => setOpen(true)}
        >
          Transfer
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-4 !pb-3 !bg-white dark:!bg-slate-800">
          <Dialog.Header title="Transfer Stream" onClose={() => setOpen(false)} />
          <div className="text-gray-700 dark:text-slate-400">
            This will transfer a {type.toLowerCase()} consisting of{' '}
            <span className="font-medium text-gray-900 dark:text-slate-200">
              {stream?.remainingAmount?.toSignificant(6)} {stream?.remainingAmount?.currency.symbol}
            </span>{' '}
            to the entered recipient.
            <p className="mt-2">
              Please note that this will transfer ownership of the entire {type.toLowerCase()} to the recipient. You
              will not be able to withdraw from this {type.toLowerCase()} after transferring
            </p>
          </div>
          <Text
            label="Address"
            value={recipient}
            onChange={(val) => setRecipient(`${val}`)}
            id="ens-input"
            testdata-id="transfer-recipient-input"
          />
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={chainId}>
              <Button
                size="xl"
                fullWidth
                disabled={
                  isWritePending ||
                  !resolvedAddress ||
                  resolvedAddress.toLowerCase() === stream?.recipient.id.toLowerCase() ||
                  !sendTransaction
                }
                onClick={() => sendTransaction?.()}
                testId="transfer-confirmation"
              >
                {isWritePending ? (
                  <Dots>Confirm Transfer</Dots>
                ) : resolvedAddress?.toLowerCase() === stream?.recipient.id.toLowerCase() ? (
                  'Invalid recipient'
                ) : !resolvedAddress ? (
                  'Enter recipient'
                ) : (
                  'Transfer'
                )}
              </Button>
            </Checker.Network>
          </Checker.Connect>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
