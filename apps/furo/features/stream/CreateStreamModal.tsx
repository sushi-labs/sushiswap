import { Dialog, Listbox } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { useApproveCallback, ApprovalState } from 'hooks'
import { useAllTokens } from 'hooks/Tokens'
import { useBentoBoxApproveCallback } from 'hooks/useBentoBoxApproveCallback'
import { useFuroStreamContract } from 'hooks/useFuroStreamContract'
import { Amount, Token } from '@sushiswap/currency'
import { FC, useState } from 'react'
import DialogContent from '@sushiswap/ui/dialog/DialogContent'
import { useAccount, useNetwork, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { approveBentoBoxAction, batchAction, streamCreationAction } from '../actions'

const CreateStreamModal: FC = () => {
  let [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState<Token>()
  const [amount, setAmount] = useState<Amount<Token>>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>('0xC39C2d6Eb8adef85f9caa141Ec95e7c0B34D8Dec')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const chainId = activeChain?.id
  const tokens = useAllTokens()
  const contract = useFuroStreamContract()
  const { data: tx, sendTransactionAsync } = useSendTransaction()

  const { refetch: wait } = useWaitForTransaction({ confirmations: 1, hash: tx?.hash, timeout: 60000 })

  const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApproveCallback(isOpen, contract.address)
  const [tokenApprovalState, approveToken] = useApproveCallback(amount, BENTOBOX_ADDRESS[chainId])

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  console.log({ tokenApprovalState, bentoBoxApprovalState })

  async function createStream() {
    if (!token || !amount || !recipient || !startDate || !endDate) {
      console.log('missing required field', { token, amount, recipient, startDate, endDate })
      return
    }

    const actions = [
      approveBentoBoxAction({ contract, user: account.address, signature }),
      streamCreationAction({ contract, recipient, token, startDate, endDate, amount, fromBentoBox }),
    ]

    const tx = await sendTransactionAsync({
      request: {
        from: account.address,
        to: contract.address,
        data: batchAction({ contract, actions }),
      },
    })

    const data = await wait()
    console.log('stream created', data)
  }

  const handleBentoBoxCheck = () => {
    setFromBentoBox(!fromBentoBox)
  }

  const ApproveTokenButton: FC = () => {
    return tokenApprovalState === ApprovalState.NOT_APPROVED ? (
      <button onClick={approveToken}>{`Approve ${token.symbol}`}</button>
    ) : tokenApprovalState === ApprovalState.PENDING ? (
      <button disabled={true}>{`Approving Token`}</button>
    ) : (
      <></>
    )
  }

  const SignBentoBox: FC = () => {
    return bentoBoxApprovalState === ApprovalState.NOT_APPROVED ? (
      <button onClick={approveBentoBox}>{`Approve BentoBox`}</button>
    ) : tokenApprovalState === ApprovalState.PENDING ? (
      <button disabled={true}>{`Approving BentoBox`}</button>
    ) : (
      <></>
    )
  }

  return (
    <>
      <button type="button" onClick={openModal} className="font-medium text-white">
        Create stream
      </button>
      <Dialog open={isOpen} onClose={closeModal} className="absolute inset-0 z-50 overflow-y-auto">
        <DialogContent>
          {/* TODO: replace with Select component from ui package? */}
          <div className="text-blue-600">
            Which asset do you want to stream?
            <div>
              <Listbox value={token} onChange={setToken}>
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-md cursor-default bg-slate-400">
                  {token?.symbol ?? 'Select token'}
                </Listbox.Button>
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
            <ApproveTokenButton />
            <SignBentoBox />
            <button
              onClick={createStream}
              disabled={
                tokenApprovalState === ApprovalState.PENDING || tokenApprovalState === ApprovalState.NOT_APPROVED
              }
            >{`Create stream`}</button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default CreateStreamModal
