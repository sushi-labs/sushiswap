import { TransactionRequest } from '@ethersproject/providers'
import { ArrowRightIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { ZERO } from '@sushiswap/math'
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
  _useSendTransaction as useSendTransaction,
  useAccount,
  useContract,
  useEnsAddress,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'

import { Stream, Vesting } from '../lib'

interface TransferModalProps {
  stream?: Stream | Vesting
  abi: NonNullable<Parameters<typeof useContract>['0']>['abi']
  address: string
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

  const {
    sendTransactionAsync,
    data,
    isLoading: isWritePending,
  } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    enabled: Boolean(stream && address && recipient && resolvedAddress),
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
                        !resolvedAddress ||
                        resolvedAddress.toLowerCase() === stream?.recipient.id.toLowerCase() ||
                        !sendTransactionAsync
                      }
                      onClick={() => sendTransactionAsync?.().then(() => confirm())}
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
          recipient ? shortenAddress(recipient) : ''
        }`}
        txHash={data?.hash}
      />
    </DialogProvider>
  )
}
