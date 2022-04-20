import { FC, useState } from 'react'
import {Dialog} from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import DialogContent from 'ui/dialog/DialogContent'
import { useContract, useNetwork, useSigner } from 'wagmi'
import FUROSTREAM from 'furo/typechain/FuroStream'
import FuroExport from 'furo/exports/kovan.json'
import { useFuroContract } from 'app/hooks/useFuroContract'
import { useApproveCallback, useTokenAllowance } from 'app/hooks'
import { useToken } from 'app/hooks/Tokens'
// import {Dial} from '@headlessui/react'

const CreateStreamModal: FC = () => {
  let [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState<string>('0xb7a4F3E9097C08dA09517b5aB877F7a917224ede')
  const [amount, setAmount] = useState<number>()
  const [recipient, setRecipient] = useState<string>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [{ data, error, loading }, getSigner] = useSigner()
  const [{ data: network }, switchNetwork] = useNetwork()
  const tokentest = useToken('0xb7a4F3E9097C08dA09517b5aB877F7a917224ede')
  const contract = useFuroContract()
  console.log({tokentest})

  
  // const [] = useApproveCallback() // TODO: need Token from tokenlist

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  function createStream() {
    if (!token || !amount || !recipient || !startDate || !endDate) {
      console.log('missing required field')
      return
    }
    // contract.createStream(recipient, token, startDate.getTime() / 1000, endDate.getTime() / 1000, amount, false)
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
