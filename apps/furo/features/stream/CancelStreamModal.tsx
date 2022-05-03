import { Dialog } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { Stream } from 'features/context/Stream'
import { STREAM_ADDRESS, useStreamBalance } from 'hooks/useFuroStreamContract'
import { FC, useCallback, useState } from 'react'
import DialogContent from '@sushiswap/ui/dialog/DialogContent'
import { useAccount, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import { AddressZero } from '@ethersproject/constants'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import Dots from '@sushiswap/ui/dots/Dots'

interface CancelStreamModalProps {
  stream?: Stream
}

const CancelStreamModal: FC<CancelStreamModalProps> = ({ stream }) => {
  const [open, setOpen] = useState(false)
  const { activeChain } = useNetwork()
  const [toBentoBox, setToBentoBox] = useState<boolean>(true)
  const { data: account } = useAccount()
  const balance = useStreamBalance(stream?.id, stream?.token)

  const {
    data,
    write,
    isLoading: isWritePending,
  } = useContractWrite(
    {
      addressOrName: activeChain?.id ? STREAM_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'cancelStream',
  )

  const { isLoading: isTxPending } = useWaitForTransaction({
    hash: data?.hash,
  })

  const cancelStream = useCallback(() => {
    if (!stream || !account) return
    return write({ args: [stream.id, toBentoBox] })
  }, [account, stream, toBentoBox, write])

  const handleBentoBoxCheck = () => {
    setToBentoBox(!toBentoBox)
  }

  const buttonText = isTxPending ? <Dots>Cancelling</Dots> : isWritePending ? <Dots>Confirm Cancel</Dots> : 'Cancel'

  return (
    <>
      <button
        type="button"
        disabled={stream?.createdBy.id.toLocaleLowerCase() !== account?.address?.toLocaleLowerCase()}
        onClick={() => setOpen(true)}
      >
        Cancel
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} className="absolute inset-0 overflow-y-auto">
        <div className="text-blue-600">
          <DialogContent>
            <div>
              Amount left: {stream && balance ? stream.amount.subtract(balance).toExact() : ''} {stream?.token.symbol}
            </div>
            <div>
              from BentoBox: <input type="checkbox" defaultChecked={toBentoBox} onChange={handleBentoBoxCheck} />
            </div>
            <button onClick={cancelStream}>{buttonText}</button>
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}
export default CancelStreamModal
