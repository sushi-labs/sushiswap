import { Stream } from 'features/context/Stream'
import { STREAM_ADDRESS, useStreamBalance } from 'hooks/useFuroStreamContract'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { AddressZero } from '@ethersproject/constants'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import Dots from '@sushiswap/ui/dots/Dots'
import { createToast } from 'components/Toast'
import Button from '../../../../packages/ui/button/Button'
import { Dialog } from '@sushiswap/ui/dialog'
import StreamProgress from 'features/stream/StreamProgress'
import { ArrowSmDownIcon, CheckIcon, XIcon } from '@heroicons/react/outline'
import { Typography } from '@sushiswap/ui/typography/Typography'
import Switch from '../../../../packages/ui/switch/Switch'

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
      <Button variant="filled" color="red" onClick={() => setOpen(true)}>
        Cancel
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-5 !max-w-sm">
          <Dialog.Header title="Cancel Stream" onClose={() => setOpen(false)} />
          <StreamProgress stream={stream} />
          <div className="flex justify-center !-mb-8 !mt-3 relative">
            <div className="p-1 bg-dark-800 border-[3px] border-dark-900 rounded-2xl">
              <ArrowSmDownIcon width={24} height={24} className="text-blue" />
            </div>
          </div>
          <div className="-ml-6 !-mb-6 -mr-6 p-6 pt-9 bg-dark-800 border-t rounded-2xl border-dark-800 flex flex-col gap-4">
            <Typography variant="xs" weight={400} className="text-high-emphesis">
              This will send the remaining funds{' '}
              <span className="font-bold">
                {stream && balance ? stream.amount.subtract(balance).toExact().toString() : ''} {stream?.token.symbol}
              </span>{' '}
              to your {toBentoBox ? 'BentoBox' : 'account'}
            </Typography>
            <div className="flex justify-between items-center">
              <Typography variant="xs" weight={700} className="text-high-emphesis">
                Receive in BentoBox
              </Typography>
              <Switch
                size="sm"
                id="toggle-expert-mode-button"
                checked={toBentoBox}
                onChange={() => setToBentoBox((prevState) => !prevState)}
                checkedIcon={<CheckIcon className="text-dark-700" />}
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
