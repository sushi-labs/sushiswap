import { AddressZero } from '@ethersproject/constants'
import { ArrowSmDownIcon, PaperAirplaneIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Button, Dialog,Dots, Typography } from '@sushiswap/ui'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import { createToast } from 'components'
import { Stream } from 'features/context/Stream'
import StreamProgress from 'features/stream/StreamProgress'
import { STREAM_ADDRESS, useStreamBalance } from 'hooks'
import { FC, useCallback, useRef, useState } from 'react'
import { useAccount, useContractWrite, useEnsAddress, useNetwork } from 'wagmi'

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

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    {
      addressOrName: activeChain?.id ? STREAM_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'transferFrom',
    {
      onSuccess() {
        setOpen(false)
      },
    },
  )

  const transferStream = useCallback(async () => {
    if (!stream || !account || !recipient || !resolvedAddress) return
    const data = await writeAsync({ args: [account?.address, resolvedAddress, stream?.id] })

    createToast({
      title: 'Transfer stream',
      description: `You have successfully transferred your stream to ${recipient}`,
      promise: data.wait(),
    })

    setRecipient(undefined)
  }, [account, recipient, resolvedAddress, stream, writeAsync])

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
        <Dialog.Content className="space-y-5 !max-w-sm">
          <Dialog.Header title="Transfer Stream" onClose={() => setOpen(false)} />
          <StreamProgress stream={stream} />
          <div className="flex justify-center !-mb-8 !mt-3 relative">
            <div className="p-1 bg-slate-800 border-[3px] border-slate-700 rounded-2xl">
              <ArrowSmDownIcon width={24} height={24} className="text-blue" />
            </div>
          </div>
          <div
            className="-ml-6 !-mb-6 -mr-6 p-6 pt-8 bg-slate-800 border-t rounded-2xl border-slate-700 flex flex-col gap-3"
            onClick={() => inputRef.current?.focus()}
          >
            <Typography variant="xs" weight={400} className="text-slate-200">
              This will transfer a stream consisting of{' '}
              <span className="font-bold">
                {stream && balance ? stream.amount.subtract(balance).toExact().toString() : ''} {stream?.token.symbol}
              </span>{' '}
              to the entered recipient
            </Typography>
            <div className="flex mb-2">
              <input
                value={recipient}
                ref={inputRef}
                onChange={(e) => setRecipient(e.target.value)}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                placeholder="Recipient address or ENS name"
                className="placeholder:text-sm pb-1 !border-b border-t-0 border-l-0 border-r-0 border-slate-700 bg-transparent placeholder:text-slate-500 p-0 !ring-0 !outline-none font-medium w-full"
              />
            </div>
            <Button
              variant="filled"
              color="gradient"
              fullWidth
              disabled={
                isWritePending ||
                !resolvedAddress ||
                resolvedAddress.toLowerCase() == stream?.recipient.id.toLowerCase()
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
            <div className="pt-3 rounded-xl">
              <Typography variant="xs" className="text-center text-yellow-700">
                Please note that this will transfer ownership of the entire stream to the recipient. You will not be
                able to withdraw from this stream after transferring
              </Typography>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default TransferStreamModal
