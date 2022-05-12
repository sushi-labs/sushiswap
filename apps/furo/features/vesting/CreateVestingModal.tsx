import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { approveBentoBoxAction, batchAction, vestingCreationAction } from 'features/actions'
import { useApproveCallback, ApprovalState } from 'hooks'
import { useBentoBoxApproveCallback } from 'hooks/useBentoBoxApproveCallback'
import { useFuroVestingContract } from 'hooks/useFuroVestingContract'
import { Amount, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'
import Button from '@sushiswap/ui/button/Button'
import Dots from '@sushiswap/ui/dots/Dots'
import { createToast } from 'components/Toast'
import { Dialog } from '@sushiswap/ui/dialog'
import { Input, Select, Typography } from '@sushiswap/ui'
import { TokenSelectorOverlay } from 'features/stream'
import Switch from '@sushiswap/ui/switch/Switch'
import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { CurrencyInput } from 'components'
import { Disclosure, Transition } from '@headlessui/react'
import { parseUnits } from 'ethers/lib/utils'

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
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [cliff, setCliff] = useState(false)
  const [gradedVesting, setGradedVesting] = useState(false)
  const [token, setToken] = useState<Token>()
  const [error, setError] = useState<string>()
  const [stepConfig, setStepConfig] = useState<StepConfig>(stepConfigurations[0])
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>()
  const [startDate, setStartDate] = useState<string>()
  const [cliffDate, setCliffDate] = useState<string>()
  const [cliffAmount, setCliffAmount] = useState<string>()
  const [stepAmount, setStepAmount] = useState<string>()
  const [stepEndDate, setStepEndDate] = useState<string>()
  const contract = useFuroVestingContract()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()
  const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApproveCallback(open, contract?.address)

  const [cliffAmountAsEntity, stepAmountAsEntity, totalAmountAsEntity] = useMemo(() => {
    if (!token) {
      return [undefined, undefined, undefined]
    }

    const cliffAmountAsEntity = Amount.fromRawAmount(
      token,
      BigNumber.from(parseUnits(cliffAmount && Number(cliffAmount) > 0 ? cliffAmount : '0', token.decimals)).toString(),
    )
    const stepAmountAsEntity = Amount.fromRawAmount(
      token,
      BigNumber.from(parseUnits(stepAmount && Number(stepAmount) > 0 ? stepAmount : '0', token.decimals)).toString(),
    )

    return [cliffAmountAsEntity, stepAmountAsEntity, cliffAmountAsEntity.add(stepAmountAsEntity)]
  }, [cliffAmount, stepAmount, token])

  const [tokenApprovalState, approveToken] = useApproveCallback(
    open,
    totalAmountAsEntity,
    activeChain?.id ? BENTOBOX_ADDRESS[activeChain?.id] : undefined,
  )

  const createVesting = useCallback(async () => {
    if (!contract || !account?.address) return
    if (!recipient || !startDate || !token || (stepEndDate && !stepConfig) || (cliff && !cliffDate)) {
      setError('Missing required field')
      console.log('missing required field', { token, recipient, startDate, stepEndDate, stepConfig })
      return
    }

    setError(undefined)

    const _startDate = new Date(startDate)

    let cliffDuration = BigNumber.from(0)
    if (cliff && cliffDate) {
      cliffDuration = BigNumber.from((new Date(cliffDate).getTime() - _startDate.getTime()) / 1000)
    }

    let totalStepDuration = BigNumber.from(0)
    if (gradedVesting && stepEndDate) {
      const _stepEndDate = new Date(stepEndDate)
      totalStepDuration = cliffDate
        ? BigNumber.from((_stepEndDate.getTime() - new Date(cliffDate).getTime()) / 1000)
        : BigNumber.from((_stepEndDate.getTime() - _startDate.getTime()) / 1000)
    }

    const steps = totalStepDuration && stepConfig ? totalStepDuration.div(stepConfig?.time) : BigNumber.from(0)
    const stepDuration = totalStepDuration && stepConfig ? totalStepDuration.div(steps) : BigNumber.from(0)

    const actions = [
      approveBentoBoxAction({ contract, user: account.address, signature }),
      vestingCreationAction({
        contract,
        recipient,
        token,
        startDate: new Date(startDate),
        cliffDuration,
        stepDuration,
        steps,
        cliffAmount: cliffAmountAsEntity ? cliffAmountAsEntity.quotient.toString() : BigNumber.from(0),
        stepAmount: stepAmountAsEntity ? stepAmountAsEntity.quotient.toString() : BigNumber.from(0),
        fromBentoBox,
      }),
    ]

    try {
      const data = await sendTransactionAsync({
        request: {
          from: account.address,
          to: contract.address,
          data: batchAction({ contract, actions }),
        },
      })

      createToast({
        title: 'Create vesting',
        description: `You have successfully created a vested stream`,
        promise: data.wait(),
      })

      setOpen(false)
    } catch (e: any) {
      setError(e.message)
    }
  }, [
    account?.address,
    cliff,
    cliffAmountAsEntity,
    cliffDate,
    contract,
    fromBentoBox,
    gradedVesting,
    recipient,
    sendTransactionAsync,
    signature,
    startDate,
    stepAmountAsEntity,
    stepConfig,
    stepEndDate,
    token,
  ])

  return (
    <>
      <Button variant="filled" color="blue" size="sm" onClick={() => setOpen(true)}>
        Create vesting
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="!space-y-6 !max-w-4xl relative overflow-hidden border border-dark-900">
          <Dialog.Header title="Create Vesting" onClose={() => setOpen(false)} />
          <div className="grid grid-cols-2 divide-x divide-dark-800">
            <div className="space-y-6 pr-6">
              <TokenSelectorOverlay onSelect={setToken} currency={token} />
              <div className="flex flex-col gap-2">
                <Typography variant="sm" weight={500} className="text-high-emphesis">
                  Start date
                </Typography>
                <Input.DatetimeLocal value={startDate} onChange={setStartDate} />
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="sm" weight={500} className="text-high-emphesis">
                  Recipient (ENS name or Address)
                </Typography>
                <Input.Address placeholder="0x..." type="text" value={recipient} onChange={setRecipient} />
              </div>
              <div className="h-px bg-dark-800 my-2" />
              <div className="flex flex-col border border-dark-800 bg-dark-800/20 rounded-xl p-5">
                <Disclosure as="div">
                  <Disclosure.Button className="w-full">
                    <div className="flex items-center justify-between gap-3">
                      <Typography variant="sm" weight={700} className="text-high-emphesis">
                        Cliff
                      </Typography>
                      <Switch
                        checked={cliff}
                        onChange={() => setCliff((prevState) => !prevState)}
                        size="sm"
                        color="gradient"
                        uncheckedIcon={<XIcon />}
                        checkedIcon={<CheckIcon />}
                      />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    show={cliff}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    unmount={false}
                  >
                    <div className="space-y-6 mt-4">
                      <div className="flex flex-col gap-2">
                        <Typography variant="sm" weight={500} className="text-high-emphesis">
                          Cliff end date
                        </Typography>
                        <Input.DatetimeLocal value={cliffDate} onChange={setCliffDate} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Typography variant="sm" weight={500} className="text-high-emphesis">
                          Cliff amount
                        </Typography>
                        <CurrencyInput
                          onChange={setCliffAmount}
                          amount={cliffAmount}
                          token={token}
                          account={account?.address}
                        />
                      </div>
                    </div>
                  </Transition>
                </Disclosure>
              </div>
              <div className="flex flex-col border border-dark-800 bg-dark-800/20 rounded-xl p-5">
                <Disclosure as="div">
                  <Disclosure.Button className="w-full">
                    <div className="flex items-center justify-between gap-3">
                      <Typography variant="sm" weight={700} className="text-high-emphesis">
                        Graded vesting
                      </Typography>
                      <Switch
                        checked={gradedVesting}
                        onChange={() => setGradedVesting((prevState) => !prevState)}
                        size="sm"
                        color="gradient"
                        uncheckedIcon={<XIcon />}
                        checkedIcon={<CheckIcon />}
                      />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    show={gradedVesting}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    unmount={false}
                  >
                    <div className="space-y-6 mt-4">
                      <div className="flex flex-col gap-2">
                        <Typography variant="sm" weight={500} className="text-high-emphesis">
                          Step end date
                        </Typography>
                        <Input.DatetimeLocal value={stepEndDate} onChange={setStepEndDate} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Typography variant="sm" weight={500} className="text-high-emphesis">
                          Total amount
                        </Typography>
                        <CurrencyInput
                          onChange={setStepAmount}
                          account={account?.address}
                          amount={stepAmount}
                          token={token}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Select
                          button={<Select.Button>{stepConfig.label}</Select.Button>}
                          label={<Select.Label>Payment frequency</Select.Label>}
                          value={stepConfig}
                          onChange={setStepConfig}
                        >
                          <Select.Options>
                            {Object.values(stepConfigurations).map((stepConfig) => (
                              <Select.Option key={stepConfig.label} value={stepConfig}>
                                {stepConfig.label}
                              </Select.Option>
                            ))}
                          </Select.Options>
                        </Select>
                      </div>
                    </div>
                  </Transition>
                </Disclosure>
              </div>
            </div>
            <div className="space-y-6 pl-6">Vesting chart</div>
          </div>
          <div className="h-px bg-dark-800 my-2" />
          <div className="flex justify-end gap-4">
            {(bentoBoxApprovalState !== ApprovalState.APPROVED ||
              (token && tokenApprovalState !== ApprovalState.APPROVED)) && (
              <div className="flex flex-col gap-4 md:flex-row">
                {bentoBoxApprovalState !== ApprovalState.APPROVED && (
                  <Button variant="filled" color="blue" disabled={!!signature} onClick={approveBentoBox}>
                    Approve Bentobox
                  </Button>
                )}
                {token && tokenApprovalState !== ApprovalState.APPROVED && (
                  <Button
                    variant="filled"
                    color="blue"
                    disabled={tokenApprovalState === ApprovalState.PENDING}
                    onClick={approveToken}
                  >
                    {tokenApprovalState === ApprovalState.PENDING ? (
                      <Dots>Approving {token?.symbol}</Dots>
                    ) : (
                      `Approve ${token?.symbol}`
                    )}
                  </Button>
                )}
              </div>
            )}
            <Button
              variant="filled"
              color="gradient"
              disabled={
                isWritePending ||
                tokenApprovalState !== ApprovalState.APPROVED ||
                (bentoBoxApprovalState !== ApprovalState.APPROVED && !signature)
              }
              onClick={createVesting}
            >
              {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create vesting'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default CreateVestingModal
