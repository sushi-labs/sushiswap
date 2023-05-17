import { TransactionRequest } from '@ethersproject/providers'
import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { ZERO } from '@sushiswap/math'
import { Button, classNames, DEFAULT_INPUT_CLASSNAME, Dialog, Dots, Form, Typography } from '@sushiswap/ui'
import { Checker, _useSendTransaction as useSendTransaction, Web3Input } from '@sushiswap/wagmi'
import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import { useAccount, useContract, useEnsAddress } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { Stream, Vesting } from '../lib'
import { createToast } from '@sushiswap/ui/future/components/toast'

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
  const [open, setOpen] = useState(false)
  const [recipient, setRecipient] = useState<string>()

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
          pending: `Transferring stream`,
          completed: `Successfully transferred stream to ${shortenAddress(resolvedAddress)}`,
          failed: 'Something went wrong transferring the stream',
        },
      })
    },
    [address, chainId, resolvedAddress]
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

  if (!stream || stream?.isEnded) return null

  return (
    <>
      <Checker.Connected>
        <Checker.Network chainId={chainId}>
          <Button
            color="gray"
            fullWidth
            startIcon={<PaperAirplaneIcon width={18} height={18} className="transform rotate-45 mt-[-4px] ml-0.5" />}
            disabled={!stream?.canTransfer(address) || !stream?.remainingAmount?.greaterThan(ZERO)}
            onClick={() => setOpen(true)}
          >
            Transfer
          </Button>
        </Checker.Network>
      </Checker.Connected>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-4 !max-w-xs !pb-4">
          <Dialog.Header title="Transfer Stream" onClose={() => setOpen(false)} />
          <Typography variant="sm" weight={400} className="text-slate-400">
            This will transfer a stream consisting of{' '}
            <span className="font-medium text-slate-200">
              {stream?.remainingAmount?.toSignificant(6)} {stream?.remainingAmount?.currency.symbol}
            </span>{' '}
            to the entered recipient.
            <p className="mt-2">
              Please note that this will transfer ownership of the entire stream to the recipient. You will not be able
              to withdraw from this stream after transferring
            </p>
          </Typography>
          <Form.Control label="Recipient">
            <Web3Input.Ens
              id="ens-input"
              value={recipient}
              onChange={setRecipient}
              placeholder="Address or ENS Name"
              className={classNames(DEFAULT_INPUT_CLASSNAME, 'ring-offset-slate-900')}
            />
          </Form.Control>
          <Button
            size="md"
            variant="filled"
            fullWidth
            disabled={
              isWritePending || !resolvedAddress || resolvedAddress.toLowerCase() == stream?.recipient.id.toLowerCase()
            }
            onClick={() => sendTransaction?.()}
          >
            {isWritePending ? (
              <Dots>Confirm Transfer</Dots>
            ) : resolvedAddress?.toLowerCase() == stream?.recipient.id.toLowerCase() ? (
              'Invalid recipient'
            ) : !resolvedAddress ? (
              'Enter recipient'
            ) : (
              'Transfer'
            )}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
