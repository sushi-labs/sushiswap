import { Dialog } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { Stream } from 'app/features/context/Stream'
import { useFuroContract, useStreamBalance } from 'app/hooks/useFuroContract'
import { FC, useState } from 'react'
import DialogContent from 'ui/dialog/DialogContent'
import { useAccount, useEnsResolveName } from 'wagmi'

interface CancelStreamModalProps {
  stream?: Stream
}

const CancelStreamModal: FC<CancelStreamModalProps> = ({ stream }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [toBentoBox, setToBentoBox] = useState<boolean>(true)
  const [{ data: account }] = useAccount()
  const contract = useFuroContract()
  const balance = useStreamBalance(stream?.id)

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  async function cancelStream() {
    if (!stream || !account) {
      console.log(stream, account.address)
      return
    }
    const tx = await contract.cancelStream(stream?.id, toBentoBox)
    console.log({ tx })
  }

  const handleBentoBoxCheck = () => {
    setToBentoBox(!toBentoBox)
  }

  return (
    <>
      <button
        type="button"
        disabled={stream?.createdBy.id.toLocaleLowerCase() !== account?.address.toLocaleLowerCase()}
        onClick={openModal}
      >
        Cancel
      </button>
      <Dialog open={isOpen} onClose={closeModal} className="absolute inset-0 overflow-y-auto">
        <div className="text-blue-600">
          <DialogContent>
            <div>
              Amount left: {stream?.amount.sub(balance ?? 0).toString()} {stream?.token.symbol}
            </div>
            <div>
              from BentoBox: <input type="checkbox" defaultChecked={toBentoBox} onChange={handleBentoBoxCheck} />
            </div>
            <button onClick={cancelStream}>{`Cancel Stream`}</button>
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}
export default CancelStreamModal
