import { ArrowSmDownIcon, TrashIcon } from '@heroicons/react/outline'
import { Button, Dialog, Dots, Switch, Typography } from '@sushiswap/ui'
import { createToast } from 'components'
import { Stream } from 'features/context/Stream'
import StreamProgress from 'features/stream/StreamProgress'
import { useStreamBalance } from 'hooks'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite } from 'wagmi'

interface CancelStreamModalProps {
  stream?: Stream
  abi: object
  address: string
  fn: string
}

const CancelStreamModal: FC<CancelStreamModalProps> = ({ stream, abi, address, fn }) => {
  const balance = useStreamBalance(stream?.id, stream?.token)
  const [open, setOpen] = useState(false)
  const [toBentoBox, setToBentoBox] = useState<boolean>(true)
  const { data: account } = useAccount()

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

  if (account?.address && !stream?.canCancel(account.address)) return <></>

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
              to your {toBentoBox ? 'Bentobox' : 'wallet'}
            </Typography>
            <div className="flex items-center justify-between">
              <Typography variant="xs" weight={700} className="text-slate-200">
                Receive in {toBentoBox ? 'Bentobox' : 'wallet'}
              </Typography>
              <Switch
                size="sm"
                id="toggle-expert-mode-button"
                checked={toBentoBox}
                onChange={() => setToBentoBox((prevState) => !prevState)}
                color="default"
              />
            </div>
            <Button
              variant="filled"
              color="gradient"
              fullWidth
              disabled={isWritePending || stream?.isEnded}
              onClick={cancelStream}
            >
              {isWritePending ? <Dots>Confirm Cancel</Dots> : 'Cancel Stream'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default CancelStreamModal
