import { Dialog } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { Stream } from 'app/features/context/Stream'
import { useToken } from 'app/hooks/Tokens'
import { useFuroContract, useStreamBalance } from 'app/hooks/useFuroContract'
import { Amount, Token } from 'currency'
import { BigNumber } from 'ethers'
import { shortenAddress } from 'format'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { FC, useState } from 'react'
import DialogContent from 'ui/dialog/DialogContent'
import { useAccount, useNetwork, useTransaction, useWaitForTransaction } from 'wagmi'

interface UpdateStreamModalProps {
  stream?: Stream
}

const UpdateStreamModal: FC<UpdateStreamModalProps> = ({ stream }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState<Amount<Token>>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>('0xC39C2d6Eb8adef85f9caa141Ec95e7c0B34D8Dec')
  const [newEndTime, setNewEndTime] = useState<Date>()
 

  const [{ data: account }] = useAccount()
  const [{ data: network }] = useNetwork()
  const chainId = network?.chain?.id

  const token = useToken(stream?.token.id)
  const contract = useFuroContract()
  const [, sendTransaction] = useTransaction()
  const [{ data: waitTxData }, wait] = useWaitForTransaction({
    skip: true,
  })
  const balance = useStreamBalance(stream?.id)

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  async function update() {
    if (!stream || (!amount && !newEndTime)) {
      console.log({ stream, amount, recipient })
      return
    }
    const difference = (newEndTime?.getTime() - stream?.endTime.getTime()) / 1000
    const topUpAmount = amount?.greaterThan(0) ? amount.toSignificant() : '0'
    const tx = contract.updateStream(
      BigNumber.from(stream.id),
      BigNumber.from(topUpAmount),
      difference > 0 ? difference : 0,
      fromBentoBox,
    )
    console.log({ tx })
  }

  const handleBentoBoxCheck = () => {
    setFromBentoBox(!fromBentoBox)
  }

  return (
    <>
      <button
        type="button"
        disabled={stream?.createdBy.id.toLocaleLowerCase() !== account?.address.toLocaleLowerCase()}
        onClick={openModal}
      >
        Edit
      </button>
      <Dialog open={isOpen} onClose={closeModal}>
        <div className="text-blue-600">
          <DialogContent>
            <div>Recipient: {shortenAddress(stream?.recipient.id)}</div>
            <div>
              Amount left: {stream?.amount.sub(balance ?? 0).toString()} {stream?.token.symbol}
            </div>
            <div>Start date: {stream?.startTime.toLocaleString()}</div>
            <div>End date: {stream?.endTime.toLocaleString()}</div>
            <div>
              Top up amount
              <input
                type={'number'}
                onChange={(e) => setAmount(Amount.fromRawAmount(token, parseInt(e.target.value)))}
              ></input>
            </div>
            <div>
              from BentoBox: <input type="checkbox" defaultChecked={fromBentoBox} onChange={handleBentoBoxCheck} />
            </div>
            <div>
              Change end date
              <input
                type="datetime-local"
                // value={stream?.endTime.toISOString().substring(0, 16)}
                // min={minimumDate?.toISOString().substring(0, 16)}
                onChange={(e) => setNewEndTime(new Date(e.target.value))}
              ></input>
            </div>
            <button onClick={update}>{`Update stream`}</button>
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}
export default UpdateStreamModal
