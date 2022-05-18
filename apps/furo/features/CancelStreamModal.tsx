import { TrashIcon } from '@heroicons/react/outline'
import { Button, Dialog, Dots, Switch, Typography } from '@sushiswap/ui'
import { createToast } from 'components'
import { Stream } from 'features/context/Stream'
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
          <Typography variant="xs" weight={400} className="text-slate-400">
            This will send the remaining amount of{' '}
            <span className="font-bold">
              {stream && balance ? stream.amount.subtract(balance).toExact().toString() : ''} {stream?.token.symbol}
            </span>{' '}
            to your {toBentoBox ? 'Bentobox' : 'wallet'}
          </Typography>
          <div className="flex items-center justify-between border border-slate-800 px-5 py-3 rounded-2xl">
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
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default CancelStreamModal
