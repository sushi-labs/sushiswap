import { Dialog, Listbox } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { ApprovalState, useApproveCallback } from 'app/hooks'
import { useAllTokens } from 'app/hooks/Tokens'
import { useFuroContract } from 'app/hooks/useFuroContract'
import { Amount, Token } from 'currency'
import { FC, useState } from 'react'
import DialogContent from 'ui/dialog/DialogContent'
import { useAccount, useNetwork, useSigner, useTransaction, useWaitForTransaction } from 'wagmi'
import { approveBentoBoxAction, batchAction, streamCreationAction } from './actions'
// import {Dial} from '@headlessui/react'

const CreateStreamModal: FC = () => {
  let [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState<Token>()
  const [amount, setAmount] = useState<Amount<Token>>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>('0x23defc2ca207e7fbd84ae43b00048fb5cb4db5b2')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [{ data, error, loading }, getSigner] = useSigner()
  const [{ data: account }] = useAccount()
  const [{ data: network }, switchNetwork] = useNetwork()
  const chainId = network?.chain?.id
  // const tokentest = useToken('0xb7a4F3E9097C08dA09517b5aB877F7a917224ede')
  const tokens = useAllTokens()
  const contract = useFuroContract()
  const [{ data: txData, error: txError }, sendTransaction] = useTransaction()
  const [{ data: waitTxData }, wait] = useWaitForTransaction({
    skip: true,
  })

  // const approved = useApproveCallback()
  const [approvalState, approve] = useApproveCallback(amount, BENTOBOX_ADDRESS[chainId]) // approve bentobox

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  console.log({ state: approvalState })

  async function createStream() {
    if (!token || !amount || !recipient || !startDate || !endDate) {
      console.log('missing required field', { token, amount, recipient, startDate, endDate })
      return
    }
    const actions = [
      approveBentoBoxAction({ contract, user: account.address }),
      streamCreationAction({ contract, recipient, token, startDate, endDate, amount, fromBentoBox }),
    ]
    console.log({ actions })
    const tx = await sendTransaction({
      request: {
        to: contract.address,
        data: batchAction({ contract, actions }),
      },
    })
    if (tx.data && !tx.error) {
      await wait({ confirmations: 1, hash: tx.data.hash, timeout: 60000 })
      console.log({ waitTxData })
    }
    // contract.createStream(recipient, token.address, startDate.getTime() / 1000, endDate.getTime() / 1000, amount.toExact(), fromBentoBox)
  }

  const handleBentoBoxCheck = () => {
    setFromBentoBox(!fromBentoBox)
  }

  const ApproveButton: FC = () => {
    return approvalState === ApprovalState.NOT_APPROVED ? (
      <button onClick={approve}>{`Approve ${token.symbol}`}</button>
    ) : approvalState === ApprovalState.PENDING ? (
      <button disabled={true}>{`Approving`}</button>
    ) : (
      <></>
    )
  }

  return (
    <div>
      <button type="button" onClick={openModal} className="font-medium text-white">
        Create stream
      </button>
      <Dialog open={isOpen} onClose={closeModal}>
        <DialogContent>
          {/* TODO: replace with Select component from ui package? */}
          <div className="text-blue-600">
            Which asset do you want to stream?
            <div>
              <Listbox value={token} onChange={setToken}>
                <Listbox.Button>{token?.symbol ?? 'Select token'}</Listbox.Button>
                <Listbox.Options>
                  {Object.values(tokens).map((token) => (
                    <Listbox.Option key={token.address} value={token}>
                      {token.symbol}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
            from BentoBox: <input type="checkbox" defaultChecked={fromBentoBox} onChange={handleBentoBoxCheck} />
            <div>
              How much do you want to send?
              <input
                type={'number'}
                // defaultValue={amount}
                onChange={(e) => setAmount(Amount.fromRawAmount(token, parseInt(e.target.value)))}
              ></input>
            </div>
            Who is the recipient?
            <div>
              <input type={'text'} defaultValue={recipient} onChange={(e) => setRecipient(e.target.value)}></input>
            </div>
            <div>
              When should the stream start?
              <input type="datetime-local" onChange={(e) => setStartDate(new Date(e.target.value))}></input>
            </div>
            <div>
              When should the stream end?
              <input type="datetime-local" onChange={(e) => setEndDate(new Date(e.target.value))}></input>
            </div>
            <ApproveButton />
            <button
              onClick={createStream}
              disabled={approvalState === ApprovalState.PENDING || approvalState === ApprovalState.NOT_APPROVED}
            >{`Create stream`}</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default CreateStreamModal
