import { Dialog } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { Stream } from 'app/features/context/Stream'
import { useToken } from 'app/hooks/Tokens'
import { useFuroContract, useStreamBalance } from 'app/hooks/useFuroContract'
import { Amount, Token } from 'currency'
import { BigNumber } from 'ethers'
import { FC, useState } from 'react'
import DialogContent from 'ui/dialog/DialogContent'
import { useAccount, useNetwork, useTransaction, useWaitForTransaction } from 'wagmi'

interface WithdrawModalProps {
  stream?: Stream
}

const WithdrawModal: FC<WithdrawModalProps> = ({ stream }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState<Amount<Token>>()
  const [toBentoBox, setToBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>('0xC39C2d6Eb8adef85f9caa141Ec95e7c0B34D8Dec')

  const [{ data: account }] = useAccount()
  const [{ data: network }] = useNetwork()
  const chainId = network?.chain?.id

  const token = useToken(stream?.token.id)
  const contract = useFuroContract()
  const [, sendTransaction] = useTransaction()
  const [{ data: waitTxData }, wait] = useWaitForTransaction({
    skip: true,
  })
  const balance = useStreamBalance(stream.id)

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  async function withdraw() {
    if (!stream || !amount || !recipient) {
      console.log({ stream, amount, recipient })
      return
    }
    const tx = contract.withdrawFromStream(
      BigNumber.from(stream.id),
      BigNumber.from(amount.quotient.toString()),
      recipient,
      toBentoBox,
      '0x',
    )
    console.log({ tx })
  }

  const handleBentoBoxCheck = () => {
    setToBentoBox(!toBentoBox)
  }

  return (
    <>
      <button
        type="button"
        disabled={stream.recipient.id.toLocaleLowerCase() !== account?.address.toLocaleLowerCase()}
        onClick={openModal}
      >
        Withdraw
      </button>
      <Dialog open={isOpen} onClose={closeModal}>
        <div className="text-blue-600">
          <DialogContent>
            <div>
              Withdrawn: {stream?.withdrawnAmount.toString()} {stream?.token.symbol}
            </div>
            <div>
              Not yet streamed: {stream?.amount.sub(balance ?? 0).toString()} {stream?.token.symbol}
            </div>
            <div>
              Available: {balance ? balance.toString() : ''} {stream?.token.symbol}
            </div>
            <div>
              Amount:
              <input
                type={'number'}
                onChange={(e) => setAmount(Amount.fromRawAmount(token, parseInt(e.target.value)))}
              ></input>
            </div>
            <div>
              from BentoBox: <input type="checkbox" defaultChecked={toBentoBox} onChange={handleBentoBoxCheck} />
            </div>
            Who is the recipient?
            <div>
              <input
                type={'text'}
                defaultValue={account?.address}
                onChange={(e) => setRecipient(e.target.value)}
              ></input>
            </div>
            <button onClick={withdraw}>{`Withdraw`}</button>
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}
export default WithdrawModal
