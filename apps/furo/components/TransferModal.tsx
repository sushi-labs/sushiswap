import { ContractInterface } from '@ethersproject/contracts'
import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { Chain, ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { ZERO } from '@sushiswap/math'
import { Button, createToast, Dialog, Dots, Form, Input, Typography } from '@sushiswap/ui'
import { Stream } from 'lib'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useEnsAddress, useNetwork } from 'wagmi'

interface TransferModalProps {
  stream?: Stream
  abi: ContractInterface
  address: string
  fn?: string
}

export const TransferModal: FC<TransferModalProps> = ({ stream, abi, address, fn = 'transferFrom' }) => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [recipient, setRecipient] = useState<string>()
  const [error, setError] = useState<string>()
  const { data: resolvedAddress } = useEnsAddress({
    name: recipient,
    chainId: ChainId.ETHEREUM,
  })

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    {
      addressOrName: address,
      contractInterface: abi,
    },
    fn,
    {
      onSuccess() {
        setOpen(false)
      },
    }
  )

  const transferStream = useCallback(async () => {
    if (!stream || !account || !recipient || !resolvedAddress || !activeChain?.id) return
    setError(undefined)

    try {
      const data = await writeAsync({ args: [account?.address, resolvedAddress, stream?.id] })

      createToast({
        txHash: data.hash,
        href: Chain.from(activeChain.id).getTxUrl(data.hash),
        promise: data.wait(),
        summary: {
          pending: <Dots>Transferring stream</Dots>,
          completed: `Successfully transferred stream to ${shortenAddress(resolvedAddress)}`,
          failed: 'Something went wrong transferring the stream',
        },
      })
    } catch (e: any) {
      setError(e.message)
    }

    setRecipient(undefined)
  }, [account, recipient, resolvedAddress, stream, writeAsync])

  return (
    <>
      <Button
        startIcon={<PaperAirplaneIcon width={18} height={18} className="transform rotate-45 mt-[-4px]" />}
        fullWidth
        color="gray"
        disabled={!account || !stream?.canTransfer(account.address) || !stream?.remainingAmount?.greaterThan(ZERO)}
        onClick={() => setOpen(true)}
      >
        Transfer
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-6 !max-w-sm">
          <Dialog.Header title="Transfer Stream" onClose={() => setOpen(false)} />
          <Typography variant="xs" weight={400} className="text-slate-400">
            This will transfer a stream consisting of{' '}
            <span className="font-bold text-slate-200">
              {stream?.remainingAmount?.toSignificant(6)} {stream?.remainingAmount?.currency.symbol}
            </span>{' '}
            to the entered recipient.
            <p className="mt-2">
              Please note that this will transfer ownership of the entire stream to the recipient. You will not be able
              to withdraw from this stream after transferring
            </p>
          </Typography>
          <Form.Control label="Recipient">
            <Input.Address className="w-full" value={recipient} onChange={setRecipient} />
          </Form.Control>

          <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={
              isWritePending || !resolvedAddress || resolvedAddress.toLowerCase() == stream?.recipient.id.toLowerCase()
            }
            onClick={transferStream}
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
          {error && (
            <Typography variant="xs" className="text-center text-red" weight={700}>
              {error}
            </Typography>
          )}
        </Dialog.Content>
      </Dialog>
    </>
  )
}
