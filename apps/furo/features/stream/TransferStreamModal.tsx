import { Dialog } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { Stream } from 'features/context/Stream'
import { useFuroStreamContract, useStreamBalance } from 'hooks/useFuroStreamContract'
import { Amount } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { FC, useState } from 'react'
import DialogContent from '@sushiswap/ui/dialog/DialogContent'
import { useAccount, useEnsName } from 'wagmi'

interface TransferStreamModalProps {
  stream?: Stream
}

const TransferStreamModal: FC<TransferStreamModalProps> = ({ stream }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [recipient, setRecipient] = useState<string>()

  const { data: account } = useAccount()

  const { data, refetch } = useEnsName({
    address: recipient,
  })

  const contract = useFuroStreamContract()
  const balance = useStreamBalance(stream?.id)

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  async function transferStream() {
    if (!stream || !account || !recipient) {
      console.log(stream, account.address, recipient)
      return
    }
    const { data: resolvedAddress, error } = await refetch()
    if (!resolvedAddress || error) {
      console.log('error resolving ens')
      return
    }
    console.log(account.address, resolvedAddress, stream?.id)
    const tx = await contract.transferFrom(account?.address, resolvedAddress, stream?.id)
    console.log({ tx })
  }

  return (
    <>
      <button
        type="button"
        disabled={stream?.recipient.id.toLocaleLowerCase() !== account?.address.toLocaleLowerCase()}
        onClick={openModal}
      >
        Transfer
      </button>
      <Dialog open={isOpen} onClose={closeModal} className="absolute inset-0 overflow-y-auto">
        <div className="text-blue-600">
          <DialogContent>
            <div>
              Amount left:{' '}
              {stream?.amount
                .subtract(Amount.fromRawAmount(stream?.token, JSBI.BigInt(balance ?? 0)))
                .toExact()
                .toString()}{' '}
              {stream?.token.symbol}
            </div>
            Recipient ETH address or ENS name:
            <div>
              <input type={'text'} defaultValue={recipient} onChange={(e) => setRecipient(e.target.value)}></input>
            </div>
            <button onClick={transferStream}>{`Transfer Ownership`}</button>
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}
export default TransferStreamModal
