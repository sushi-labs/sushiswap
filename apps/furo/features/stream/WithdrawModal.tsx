import { Dialog, Listbox } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { ApprovalState, useApproveCallback } from 'app/hooks'
import { useAllTokens } from 'app/hooks/Tokens'
import { useBentoBoxApproveCallback } from 'app/hooks/useBentoBoxApproveCallback'
import { useFuroContract, useStreamBalance } from 'app/hooks/useFuroContract'
import { Amount, Token } from 'currency'
import { FC, useState } from 'react'
import DialogContent from 'ui/dialog/DialogContent'
import { useAccount, useNetwork, useTransaction, useWaitForTransaction } from 'wagmi'
import { Stream } from 'app/features/context/Stream'
import { approveBentoBoxAction, batchAction, streamCreationAction } from './actions'
// import {Dial} from '@headlessui/react'

interface WithdrawModalProps {
  stream?: Stream
}

const WithdrawModal: FC<WithdrawModalProps> = ({ stream }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState<Token>()
  const [amount, setAmount] = useState<Amount<Token>>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>('0xC39C2d6Eb8adef85f9caa141Ec95e7c0B34D8Dec')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [{ data: account }] = useAccount()
  const [{ data: network }] = useNetwork()
  const chainId = network?.chain?.id

  const tokens = useAllTokens()
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

  async function withdraw() {}

  return (
    <>
      <button type="button" onClick={openModal}>
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
            <div>
              Amount:
              <input
                type={'number'}
                // defaultValue={amount}
                onChange={(e) => setAmount(Amount.fromRawAmount(token, parseInt(e.target.value)))}
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
