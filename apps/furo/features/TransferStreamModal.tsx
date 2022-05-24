import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Button, Dialog, Dots, Form, Input, Typography } from '@sushiswap/ui'
import { createToast } from 'components'
import { Stream } from 'features/context/Stream'
import { useStreamBalance } from 'hooks'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useEnsAddress } from 'wagmi'

interface TransferStreamModalProps {
  stream?: Stream
  abi: object
  address: string
  fn?: string
}

const TransferStreamModal: FC<TransferStreamModalProps> = ({ stream, abi, address, fn = 'transferFrom' }) => {
  const { data: account } = useAccount()
  const [open, setOpen] = useState(false)
  const [recipient, setRecipient] = useState<string>()
  const [error, setError] = useState<string>()
  const balance = useStreamBalance(stream?.id, stream?.token)
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
    if (!stream || !account || !recipient || !resolvedAddress) return
    setError(undefined)

    try {
      const data = await writeAsync({ args: [account?.address, resolvedAddress, stream?.id] })

      createToast({
        title: 'Transfer stream',
        description: `You have successfully transferred your stream to ${recipient}`,
        promise: data.wait(),
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
        disabled={account?.address && !stream?.canTransfer(account.address)}
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
              {stream && balance ? stream.amount.subtract(balance).toExact().toString() : ''} {stream?.token.symbol}
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
export default TransferStreamModal
