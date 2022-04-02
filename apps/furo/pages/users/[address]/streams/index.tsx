import { ContractInterface } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { Dialog } from 'ui'
import DialogContent from 'ui/dialog/DialogContent'
import { erc20ABI, useContract, useContractWrite, useSigner } from 'wagmi'
import { getBuiltGraphSDK } from '../../../../.graphclient'
// import FuroStreamABI from '../../../../abis/FuroStream.json'

interface StreamsProps {
  incomingStreams: Stream[]
  outgoingStreams: Stream[]
}

interface Stream {
  id: string
  status: string
  amount: string
  withdrawnAmount: string
  expiresAt: string
  startedAt: string
  recipient: User
  createdBy: User
  token: Token
}

interface Token {
  id: string
  symbol: string
  name: string
  decimals: string
}

interface User {
  id: string
}

const Streams: FC<StreamsProps> = (props) => {
  const router = useRouter()
  const address = router.query.address as string
  let { incomingStreams, outgoingStreams } = props
  let [isOpen, setIsOpen] = useState(false)
  const FuroStreamABI = require("../../../../abis/FuroStream.json")
  const [{ data, error, loading }, getSigner] = useSigner()

  const contract = useContract({
    addressOrName: '0x511D5aef6eb2eFDf71b98B4261Bbe68CC0A94Cd4',
    contractInterface: FuroStreamABI,
    signerOrProvider: data
  }
  )
  const [token, setToken] = useState<string>("0xb7a4F3E9097C08dA09517b5aB877F7a917224ede")
  const [amount, setAmount] = useState<number>()
  const [recipient, setRecipient] = useState<string>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  function createStream() {
    if(!token || !amount || !recipient || !startDate || !endDate) {
      console.log("missing required field")
    }
    console.log({token, amount, recipient, startDate, endDate})
    console.log(contract)
    contract.createStream(recipient, token, startDate.getTime() / 1000, endDate.getTime() / 1000, amount, false)
      // write({args: [
      //   recipient,
      //   token,
      //   startDate.getTime(),
      //   endDate.getTime(),
      //   amount,
      //   false
      // ]})
  }

  return (
    <>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Streams</h1>
        <h1 className="py-4 text-2xl font-bold">Incoming streams</h1>
        <div className="grid gap-2">
          {incomingStreams.length ? (
            Object.values(incomingStreams).map((stream) => (
              <div key={stream.id}>
                {stream.status} {``}
                {stream.createdBy.id} {``}
                {stream.amount} {``} {stream.token.symbol} {``}
                {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}
                {<Link href={'/stream/'.concat(stream.id)}> View</Link>}
              </div>
            ))
          ) : (
            <div>
              <i>No incoming streams found..</i>
            </div>
          )}
        </div>

        <h1 className="py-4 text-2xl font-bold">Outgoing streams</h1>
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

        <div className="grid gap-2">
          {outgoingStreams.length ? (
            Object.values(outgoingStreams).map((stream) => (
              <div key={stream.id}>
                {stream.status} {``}
                {stream.recipient.id} {``}
                {stream.amount} {``} {stream.token.symbol} {``}
                {new Date(parseInt(stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(stream.expiresAt) * 1000).toLocaleString()}
                {<Link href={'/stream/'.concat('/').concat(stream.id)}> View</Link>}
              </div>
            ))
          ) : (
            <div>
              <i>No outgoing streams found..</i>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Streams

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const user = (await sdk.UserStreams({ id: query.address })).user
  return {
    props: user,
  }
}
