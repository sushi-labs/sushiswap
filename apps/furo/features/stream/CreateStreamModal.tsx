import { FC, useState } from 'react'
import { Dialog } from 'ui'
import DialogContent from 'ui/dialog/DialogContent'
import { useContract, useSigner } from 'wagmi'
import FuroStreamABI from '../../abis/FuroStream.json'

const CreateStreamModal: FC = () => {
  let [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState<string>('0xb7a4F3E9097C08dA09517b5aB877F7a917224ede')
  const [amount, setAmount] = useState<number>()
  const [recipient, setRecipient] = useState<string>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [{ data, error, loading }, getSigner] = useSigner()

  const contract = useContract({
    addressOrName: '0x511D5aef6eb2eFDf71b98B4261Bbe68CC0A94Cd4',
    contractInterface: FuroStreamABI,
    signerOrProvider: data,
  })

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  function createStream() {
    if (!token || !amount || !recipient || !startDate || !endDate) {
      console.log('missing required field')
    }
    console.log({ token, amount, recipient, startDate, endDate })
    console.log(contract)
    contract.createStream(recipient, token, startDate.getTime() / 1000, endDate.getTime() / 1000, amount, false)
  }

  return (
    <>
      <button type="button" onClick={openModal} className="font-medium text-white">
        Create stream
      </button>
      <Dialog open={isOpen} onClose={closeModal}>
        <DialogContent>
          {/* TODO: replace with Select component from ui package */}
          <div className="text-blue-600">
            Which asset do you want to stream?
            <div>
              <select>
                <option value="0xb7a4F3E9097C08dA09517b5aB877F7a917224ede">USDC</option>
              </select>
            </div>
            <div>
              How much do you want to send?
              <input
                type={'number'}
                defaultValue={500000}
                onChange={(e) => setAmount(parseInt(e.target.value))}
              ></input>
            </div>
            <div>
              Who is the recipient?
              <input
                type={'text'}
                defaultValue={'0x23defc2ca207e7fbd84ae43b00048fb5cb4db5b2'}
                onChange={(e) => setRecipient(e.target.value)}
              ></input>
            </div>
            <div>
              When should the stream start?
              <input type="datetime-local" onChange={(e) => setStartDate(new Date(e.target.value))}></input>
            </div>
            <div>
              When should the stream end?
              <input type="datetime-local" onChange={(e) => setEndDate(new Date(e.target.value))}></input>
            </div>
            <button onClick={createStream}>Create stream</button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default CreateStreamModal
