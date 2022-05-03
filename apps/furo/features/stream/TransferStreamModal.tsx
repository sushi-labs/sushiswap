import { Stream } from 'features/context/Stream'
import { STREAM_ADDRESS, useStreamBalance } from 'hooks/useFuroStreamContract'
import { FC, useCallback, useRef, useState } from 'react'
import { useAccount, useContractWrite, useEnsAddress, useNetwork, useWaitForTransaction } from 'wagmi'
import Button from '../../../../packages/ui/button/Button'
import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import StreamProgress from 'features/stream/StreamProgress'
import { Dialog } from '@sushiswap/ui/dialog'
import { Typography } from '@sushiswap/ui/typography/Typography'
import Dots from '@sushiswap/ui/dots/Dots'
import { AddressZero } from '@ethersproject/constants'
import FUROSTREAM_ABI from 'abis/FuroStream.json'

interface TransferStreamModalProps {
  stream?: Stream
}

const TransferStreamModal: FC<TransferStreamModalProps> = ({ stream }) => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [recipient, setRecipient] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)
  const balance = useStreamBalance(stream?.id, stream?.token)
  const { data: resolvedAddress } = useEnsAddress({
    name: recipient,
    chainId: ChainId.ETHEREUM,
  })

  const {
    data,
    write,
    isLoading: isWritePending,
  } = useContractWrite(
    {
      addressOrName: activeChain?.id ? STREAM_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'transferFrom',
  )

  const { isLoading: isTxPending } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      setRecipient(undefined)
    },
  })

  const transferStream = useCallback(() => {
    if (!stream || !account || !recipient || !resolvedAddress) return
    return write({ args: [account?.address, resolvedAddress, stream?.id] })
  }, [account, recipient, resolvedAddress, stream, write])

  const buttonText = isTxPending ? (
    <Dots>Transferring</Dots>
  ) : isWritePending ? (
    <Dots>Confirm Transfer</Dots>
  ) : resolvedAddress?.toLowerCase() == stream?.recipient.id.toLowerCase() ? (
    'Invalid recipient'
  ) : !resolvedAddress ? (
    'Enter recipient'
  ) : (
    'Transfer'
  )

  return (
    <>
      <Button
        startIcon={<PaperAirplaneIcon width={18} height={18} className="transform rotate-45 mt-[-4px]" />}
        fullWidth
        variant="outlined"
        color="gray"
        disabled={stream?.recipient.id.toLocaleLowerCase() !== account?.address?.toLocaleLowerCase()}
        onClick={() => setOpen(true)}
      >
        Transfer
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-4 !max-w-sm">
          <Dialog.Header title="Transfer Stream" onClose={() => setOpen(false)} />
          <StreamProgress stream={stream} />
          <div
            className="border border-blue/30 hover:border-blue/60 p-5 rounded-lg flex flex-col gap-3"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex justify-between gap-3">
              <Typography variant="sm" weight={400}>
                Amount to transfer:
              </Typography>
              <Typography weight={700} className="text-high-emphesis">
                {stream && balance ? stream.amount.subtract(balance).toExact().toString() : ''} {stream?.token.symbol}
              </Typography>
            </div>
            <div className="flex">
              <input
                value={recipient}
                ref={inputRef}
                onChange={(e) => setRecipient(e.target.value)}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                placeholder="Address or ENS name"
                className="placeholder:text-secondary bg-transparent p-0 text-sm !ring-0 !outline-none !border-none font-medium w-full"
              />
            </div>
          </div>
          <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={
              isTxPending ||
              isWritePending ||
              !resolvedAddress ||
              resolvedAddress.toLowerCase() == stream?.recipient.id.toLowerCase()
            }
            onClick={transferStream}
          >
            {buttonText}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default TransferStreamModal
