import { TransactionRequest } from '@ethersproject/providers'
import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { ZERO } from '@sushiswap/math'
import { Button } from '@sushiswap/ui/components/button'
import { Dialog } from '@sushiswap/ui/components/dialog/Dialog'
import { Dots } from '@sushiswap/ui/components/dots'
import { Text } from '@sushiswap/ui/components/input/Text'
import { createToast } from '@sushiswap/ui/components/toast'
import { _useSendTransaction as useSendTransaction, useAccount, useContract, useEnsAddress } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useState } from 'react'

import { Stream, Vesting } from '../lib'

interface TransferModalProps {
  stream?: Stream | Vesting
  abi: NonNullable<Parameters<typeof useContract>['0']>['abi']
  address: string
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

  const contract = useContract({
    address: contractAddress,
    abi: abi,
  })
  const { data: resolvedAddress } = useEnsAddress({
    name: recipient,
    chainId: ChainId.ETHEREUM,
  })

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!stream || !address || !recipient || !resolvedAddress) return

      setRequest({
        from: address,
        to: contractAddress,
        data: contract?.interface.encodeFunctionData(fn, [address, resolvedAddress, stream?.id]),
      })
    },
    [stream, address, recipient, resolvedAddress, contractAddress, contract?.interface, fn]
  )

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
        promise: data.wait(),
        summary: {
          pending: `Transferring ${type}`,
          completed: `Successfully transferred ${type} to ${shortenAddress(resolvedAddress)}`,
          failed: `Something went wrong transferring the ${type}`,
        },
      })
    },
    [address, chainId, resolvedAddress, type]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess() {
      setOpen(false)
    },
    enabled: Boolean(stream && address && recipient && resolvedAddress),
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
