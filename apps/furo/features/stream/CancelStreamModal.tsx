import { AddressZero } from '@ethersproject/constants'
import { ArrowSmDownIcon, CheckIcon, TrashIcon, XIcon } from '@heroicons/react/outline'
import { Button, Dialog, Dots, Switch,Typography } from '@sushiswap/ui'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import { createToast } from 'components'
import { Stream } from 'features/context/Stream'
import StreamProgress from 'features/stream/StreamProgress'
import { STREAM_ADDRESS, useStreamBalance } from 'hooks'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface CancelStreamModalProps {
  stream?: Stream
}

const CancelStreamModal: FC<CancelStreamModalProps> = ({ stream }) => {
  const [open, setOpen] = useState(false)
  const { activeChain } = useNetwork()
  const [toBentoBox, setToBentoBox] = useState<boolean>(true)
  const { data: account } = useAccount()
  const balance = useStreamBalance(stream?.id, stream?.token)

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    {
      addressOrName: activeChain?.id ? STREAM_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'cancelStream',
    {
      onSuccess() {
        setOpen(false)
      },
    },
  )

  const cancelStream = useCallback(async () => {
    if (!stream || !account) return
    const data = await writeAsync({ args: [stream.id, toBentoBox] })

    createToast({
      title: 'Cancel stream',
      description: `You have successfully cancelled your stream`,
      promise: data.wait(),
    })
  }, [account, stream, toBentoBox, writeAsync])

  // Hide if not stream owner
  if (stream?.createdBy.id.toLocaleLowerCase() !== account?.address?.toLocaleLowerCase()) return <></>

  return (
    <>
      <Button
        variant="filled"
        color="red"
        startIcon={<TrashIcon className="text-red-900" width={24} height={24} />}
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-5 !max-w-sm">
          <Dialog.Header title="Cancel Stream" onClose={() => setOpen(false)} />
          <StreamProgress stream={stream} />
          <div className="flex justify-center !-mb-8 !mt-3 relative">
            <div className="p-1 bg-slate-800 border-[3px] border-slate-700 rounded-2xl">
              <ArrowSmDownIcon width={24} height={24} className="text-blue" />
            </div>
          </div>
          <div className="-ml-6 !-mb-6 -mr-6 p-6 pt-9 bg-slate-800 border-t rounded-2xl border-slate-700 flex flex-col gap-4">
            <Typography variant="xs" weight={400} className="text-slate-200">
              This will send the remaining funds{' '}
              <span className="font-bold">
                {stream && balance ? stream.amount.subtract(balance).toExact().toString() : ''} {stream?.token.symbol}
              </span>{' '}
              to your {toBentoBox ? 'BentoBox' : 'account'}
            </Typography>
            <div className="flex items-center justify-between">
              <Typography variant="xs" weight={700} className="text-slate-200">
                Receive in BentoBox
              </Typography>
              <Switch
                size="sm"
                id="toggle-expert-mode-button"
                checked={toBentoBox}
                onChange={() => setToBentoBox((prevState) => !prevState)}
                checkedIcon={<CheckIcon className="text-slate-700" />}
                uncheckedIcon={<XIcon />}
                color="gradient"
              />
            </div>
            <Button
              variant="filled"
              color="gradient"
              fullWidth
              disabled={isWritePending || stream?.isEnded}
              onClick={cancelStream}
            >
              {isWritePending ? <Dots>Confirm Cancel</Dots> : 'Cancel'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default CancelStreamModal
