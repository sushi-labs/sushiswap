import { ArrowRightIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from 'sushi'
import { ZERO } from 'sushi'
import {
  DialogConfirm,
  DialogFooter,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  TextField,
} from '@sushiswap/ui'
import { DialogContent, DialogDescription, DialogHeader, Label } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  useAccount,
  useEnsAddress,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { Abi, Address, encodeFunctionData, isAddress } from 'viem'

import { Stream, Vesting } from '../lib'

interface TransferModalProps {
  stream?: Stream | Vesting
  abi: Abi
  address: Address
  fn?: string
  chainId: ChainId
}

export const TransferModal: FC<TransferModalProps> = ({
  stream,
  abi,
  address: contractAddress,
  fn = 'transferFrom',
  chainId,
}) => {
  const { address } = useAccount()
  const [recipient, setRecipient] = useState<string>('')

  const type = stream instanceof Vesting ? 'Vest' : 'Stream'

  const { data: resolvedAddress } = useEnsAddress({
    name: recipient,
    chainId: ChainId.ETHEREUM,
    enabled: Boolean(recipient.includes('.eth')),
  })

  const recipientAddress = isAddress(recipient) ? recipient : resolvedAddress

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!stream || !address || !recipientAddress) return

    return {
      from: address,
      to: contractAddress,
      data: encodeFunctionData({ abi, functionName: fn, args: [address, recipientAddress, stream?.id] }),
    }
  }, [stream, address, recipientAddress, contractAddress, abi, fn])

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !recipientAddress || !address) return

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
          completed: `Successfully transferred ${type} to ${shortenAddress(recipientAddress)}`,
          failed: `Something went wrong transferring the ${type}`,
        },
      })
    },
    [address, chainId, recipientAddress, type]
  )

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(stream && address && recipient && recipientAddress),
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

  if (!stream) return <></>

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                testId={`${type.toLowerCase()}-transfer`}
                disabled={
                  stream?.isEnded || !stream?.canTransfer(address) || !stream?.remainingAmount?.greaterThan(ZERO)
                }
                icon={ArrowRightIcon}
              >
                Transfer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer stream</DialogTitle>
                <DialogDescription>
                  This will transfer a {type.toLowerCase()} consisting of{' '}
                  <span className="font-medium text-gray-900 dark:text-slate-200">
                    {stream?.remainingAmount?.toSignificant(6)} {stream?.remainingAmount?.currency.symbol}
                  </span>{' '}
                  to the entered recipient. Please note that this will transfer ownership of the entire{' '}
                  {type.toLowerCase()} to the recipient. You will not be able to withdraw from this {type.toLowerCase()}{' '}
                  after transferring
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Label>Recipient</Label>
                <TextField
                  type="text"
                  value={recipient}
                  onValueChange={setRecipient}
                  testdata-id="transfer-recipient-input"
                  placeholder="0x..."
                />
              </div>
              <DialogFooter>
                <Checker.Connect fullWidth>
                  <Checker.Network fullWidth chainId={chainId}>
                    <Button
                      size="xl"
                      fullWidth
                      disabled={
                        isWritePending ||
                        !recipientAddress ||
                        recipientAddress?.toLowerCase() === stream?.recipient.id.toLowerCase() ||
                        !sendTransactionAsync
                      }
                      onClick={() => sendTransactionAsync?.().then(() => confirm())}
                      testId="transfer-confirmation"
                    >
                      {isWritePending ? (
                        <Dots>Confirm Transfer</Dots>
                      ) : recipientAddress?.toLowerCase() === stream?.recipient.id.toLowerCase() ? (
                        'Invalid recipient'
                      ) : !recipientAddress ? (
                        'Enter recipient'
                      ) : (
                        'Transfer'
                      )}
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
        testId={`update-${type.toLowerCase()}-confirmation-modal`}
        successMessage={`Successfully transferred ${type.toLowerCase()} to ${
          recipientAddress ? shortenAddress(recipientAddress) : ''
        }`}
        txHash={data?.hash}
      />
    </DialogProvider>
  )
}
