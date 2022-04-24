import { Dialog, Listbox } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { approveBentoBoxAction, batchAction, vestingCreationAction } from 'app/features/actions'
import { ApprovalState, useApproveCallback } from 'app/hooks'
import { useAllTokens } from 'app/hooks/Tokens'
import { useBentoBoxApproveCallback } from 'app/hooks/useBentoBoxApproveCallback'
import { useFuroVestingContract } from 'app/hooks/useFuroContract'
import { Amount, Token } from 'currency'
import { BigNumber } from 'ethers'
import { FC, useEffect, useState } from 'react'
import DialogContent from 'ui/dialog/DialogContent'
import { useAccount, useNetwork, useTransaction, useWaitForTransaction } from 'wagmi'


type StepConfig = {
  label: string
  time: number
}

const stepConfigurations: StepConfig[] = [
  { label: 'Weekly', time: 604800 },
  { label: 'Bi-weekly', time: 2 * 604800 },
  { label: 'Monthly', time: 2629800 },
  { label: 'Quarterly', time: 3 * 2629800 },
  { label: 'Yearly', time: 31557600 },
]

const CreateVestingModal: FC = () => {
  let [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState<Token>()
  const [stepConfig, setStepConfig] = useState<StepConfig>()
  const [amount, setAmount] = useState<Amount<Token>>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>('0xC39C2d6Eb8adef85f9caa141Ec95e7c0B34D8Dec')
  const [startDate, setStartDate] = useState<Date>()
  const [cliffDate, setCliffDate] = useState<Date>()
  const [cliffAmount, setCliffAmount] = useState<BigNumber>()
  const [stepAmount, setStepAmount] = useState<BigNumber>()
  const [stepEndDate, setStepEndDate] = useState<Date>()
  const [{ data: account }] = useAccount()
  const [{ data: network }] = useNetwork()
  const chainId = network?.chain?.id
  const tokens = useAllTokens()
  const contract = useFuroVestingContract()
  const [, sendTransaction] = useTransaction()
  const [{ data: waitTxData }, wait] = useWaitForTransaction({
    skip: true,
  })
  const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApproveCallback(contract.address)
  const [tokenApprovalState, approveToken] = useApproveCallback(amount, BENTOBOX_ADDRESS[chainId])

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  useEffect(() => {
    if (!cliffAmount && !stepAmount) return

    if (cliffAmount && stepAmount) {
      setAmount(Amount.fromRawAmount(token, BigNumber.from(cliffAmount).add(stepAmount).toString()))
    } else if (!stepAmount) {
      setAmount(Amount.fromRawAmount(token, BigNumber.from(cliffAmount).toString()))
    } else {
      setAmount(Amount.fromRawAmount(token, BigNumber.from(stepAmount).toString()))
    }
  }, [stepAmount, cliffAmount, token])

  async function createVesting() {
    if (!recipient || !startDate || !token) {
      console.log('missing required field', { token, recipient, startDate })
      return
    }
    const cliffDuration = cliffDate
      ? BigNumber.from((cliffDate.getTime() - startDate.getTime()) / 1000)
      : BigNumber.from(0)
    const stepDuration = stepEndDate
      ? cliffDuration
        ? BigNumber.from((stepEndDate.getTime() - cliffDate.getTime()) / 1000)
        : BigNumber.from((stepEndDate.getTime() - startDate.getTime()) / 1000)
      : BigNumber.from(0)
    const steps = stepDuration ? stepDuration.div(stepConfig.time) : BigNumber.from(0)
    const actions = [
      approveBentoBoxAction({ contract, user: account.address, signature }),
      vestingCreationAction({
        contract,
        recipient,
        token,
        startDate,
        cliffDuration,
        stepDuration,
        steps,
        cliffAmount,
        stepAmount,
        fromBentoBox,
      }),
    ]

    const tx = await sendTransaction({
      request: {
        from: account.address,
        to: contract.address,
        data: batchAction({ contract, actions }),
      },
    })

    if (tx.data && !tx.error) {
      await wait({ confirmations: 1, hash: tx.data.hash, timeout: 60000 })
      console.log('vesting created', waitTxData)
    }
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
    <div>
      <button type="button" onClick={openModal} className="font-medium text-white">
        Create Vesting
      </button>
      <Dialog open={isOpen} onClose={closeModal} className="absolute inset-0 overflow-y-auto">
        <DialogContent>
          {/* TODO: replace with Select component from ui package? */}
          <div className="text-blue-600">
            <div>
              <div>When should the vesting start?</div>
              <input type="datetime-local" onChange={(e) => setStartDate(new Date(e.target.value))}></input>
            </div>
            <div>
              Which asset do you want to vest?
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
            </div>
            <div>
              from BentoBox: <input type="checkbox" defaultChecked={fromBentoBox} onChange={handleBentoBoxCheck} />
            </div>
            <div>
              Who is the recipient?
              <div>
                <input type={'text'} defaultValue={recipient} onChange={(e) => setRecipient(e.target.value)}></input>
              </div>
            </div>
            <div className="border-4">
              <h1>Cliff Vesting</h1>
              <div>
                <div>Cliff ends:</div>
                <input type="datetime-local" onChange={(e) => setCliffDate(new Date(e.target.value))}></input>
              </div>
              How much should be paid out once the cliff has passed?
              <div>
                <input type={'number'} onChange={(e) => setCliffAmount(BigNumber.from(e.target.value))}></input>
              </div>
            </div>
            <div className="border-4">
              <h1>Graded Vesting</h1>
              <div>
                <div>How often should payments occur?</div>
                <Listbox value={stepConfig} onChange={setStepConfig}>
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-md cursor-default bg-slate-400">
                    {stepConfig?.label ?? 'Select payment frequency'}
                  </Listbox.Button>
                  <Listbox.Options>
                    {Object.values(stepConfigurations).map((stepConfig) => (
                      <Listbox.Option key={stepConfig.label} value={stepConfig}>
                        {stepConfig.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
              Total amount:
              <div>
                <input type={'number'} onChange={(e) => setStepAmount(BigNumber.from(e.target.value))}></input>
              </div>
              When should the payment end:
              <div>
                <input type="datetime-local" onChange={(e) => setStepEndDate(new Date(e.target.value))}></input>
              </div>
            </div>
            <ApproveTokenButton />
            <SignBentoBox />
            <button
              onClick={createVesting}
              disabled={
                tokenApprovalState === ApprovalState.PENDING ||
                tokenApprovalState === ApprovalState.NOT_APPROVED ||
                bentoBoxApprovalState === ApprovalState.NOT_APPROVED
              }
            >{`Create Vesting`}</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default CreateVestingModal
