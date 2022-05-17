import { Disclosure, Transition } from '@headlessui/react'
import { CheckIcon, PlusIcon, XIcon } from '@heroicons/react/solid'
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { Amount, Token } from '@sushiswap/currency'
import { ZERO } from '@sushiswap/math'
import { Button, Dialog, Dots, Input, Select, Typography } from '@sushiswap/ui'
import Switch from '@sushiswap/ui/switch/Switch'
import { CurrencyInput } from 'components'
import { createToast } from 'components/Toast'
import { BigNumber, utils } from 'ethers'
import { approveBentoBoxAction, batchAction, vestingCreationAction } from 'features/actions'
import { TokenSelectorOverlay } from 'features/stream'
import { ApprovalState, useApproveCallback } from 'hooks'
import { useBentoBoxApproveCallback } from 'hooks/useBentoBoxApproveCallback'
import { useFundSourceToggler } from 'hooks/useFundSourceToggler'
import { useFuroVestingContract } from 'hooks/useFuroVestingContract'
import { cloneElement, FC, ReactElement, useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

const { parseUnits } = utils

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

interface CreateVestingModal {
  button?: ReactElement
}

const CreateVestingModal: FC<CreateVestingModal> = ({ button }) => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [cliff, setCliff] = useState(false)
  const [gradedVesting, setGradedVesting] = useState(false)
  const [token, setToken] = useState<Token>()
  const [error, setError] = useState<string>()
  const [stepConfig, setStepConfig] = useState<StepConfig>(stepConfigurations[0])
  const { value: fundSource, fromBentobox, toggle } = useFundSourceToggler()
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
        fromBentobox,
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
    fromBentobox,
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
      {button ? (
        cloneElement(button, { onClick: () => setOpen(true) })
      ) : (
        <Button
          startIcon={<PlusIcon width={18} height={18} />}
          variant="filled"
          color="blue"
          size="sm"
          onClick={() => setOpen(true)}
          className="rounded-xl"
        >
          New vesting
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="!space-y-6 !max-w-5xl relative overflow-hidden border border-slate-700">
          <Dialog.Header title="Create Vesting" onClose={() => setOpen(false)} />
          <div className="grid md:grid-cols-2 md:divide-x divide-slate-800 space-y-6">
            <div className="md:pr-6 space-y-6">
              <div className="grid md:grid-cols-2 md:space-x-6 space-y-6 md:space-y-0">
                <TokenSelectorOverlay onSelect={setToken} currency={token} />
                <div className="flex flex-col gap-2">
                  <Typography variant="sm" weight={500} className="text-slate-200">
                    Start date
                  </Typography>
                  <Input.DatetimeLocal value={startDate} onChange={setStartDate} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="sm" weight={500} className="text-slate-200">
                  Recipient (ENS name or Address)
                </Typography>
                <Input.Address placeholder="0x..." type="text" value={recipient} onChange={setRecipient} />
              </div>
              <div className="h-px my-2 bg-slate-800" />
              <div className="flex items-center justify-between gap-3">
                <Typography variant="sm" weight={700} className="text-slate-200">
                  Use funds from
                </Typography>
                <div className="flex gap-3 items-center">
                  <Typography
                    variant="sm"
                    weight={!fromBentobox ? 700 : 400}
                    className={!fromBentobox ? 'text-slate-50' : 'text-slate-400'}
                  >
                    Wallet
                  </Typography>
                  <Switch size="sm" checked={fromBentobox} onChange={toggle} color="default" />
                  <Typography
                    variant="sm"
                    weight={fromBentobox ? 700 : 400}
                    className={fromBentobox ? 'text-slate-50' : 'text-slate-400'}
                  >
                    Bentobox
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col p-5 border border-slate-700 bg-slate-800/30 rounded-xl">
                <Disclosure as="div">
                  <Disclosure.Button className="w-full">
                    <div className="flex items-center justify-between gap-3">
                      <Typography variant="sm" weight={700} className="text-slate-200">
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
                    <div className="mt-4 space-y-6">
                      <div className="flex flex-col gap-2">
                        <Typography variant="sm" weight={500} className="text-slate-200">
                          Cliff end date
                        </Typography>
                        <Input.DatetimeLocal value={cliffDate} onChange={setCliffDate} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Typography variant="sm" weight={500} className="text-slate-200">
                          Cliff amount
                        </Typography>
                        <CurrencyInput
                          onChange={setCliffAmount}
                          amount={cliffAmount}
                          token={token}
                          account={account?.address}
                          fundSource={fundSource}
                        />
                      </div>
                    </div>
                  </Transition>
                </Disclosure>
              </div>
              <div className="flex flex-col p-5 border border-slate-700 bg-slate-800/30 rounded-xl">
                <Disclosure as="div">
                  <Disclosure.Button className="w-full">
                    <div className="flex items-center justify-between gap-3">
                      <Typography variant="sm" weight={700} className="text-slate-200">
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
                    <div className="mt-4 space-y-6">
                      <div className="flex flex-col gap-2">
                        <Typography variant="sm" weight={500} className="text-slate-200">
                          Step end date
                        </Typography>
                        <Input.DatetimeLocal value={stepEndDate} onChange={setStepEndDate} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Typography variant="sm" weight={500} className="text-slate-200">
                          Total amount
                        </Typography>
                        <CurrencyInput
                          onChange={setStepAmount}
                          account={account?.address}
                          amount={stepAmount}
                          token={token}
                          fundSource={fundSource}
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
            <div className="md:pl-6 space-y-6">Vesting chart</div>
          </div>
          <div className="flex justify-end gap-4">
            {(bentoBoxApprovalState !== ApprovalState.APPROVED ||
              (token && [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(tokenApprovalState))) && (
              <div className="flex flex-col gap-4 md:flex-row">
                {bentoBoxApprovalState !== ApprovalState.APPROVED && (
                  <Button variant="filled" color="blue" disabled={!!signature} onClick={approveBentoBox}>
                    Approve Bentobox
                  </Button>
                )}
                {token && [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(tokenApprovalState) && (
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
                (bentoBoxApprovalState !== ApprovalState.APPROVED && !signature) ||
                !totalAmountAsEntity?.greaterThan(ZERO)
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
