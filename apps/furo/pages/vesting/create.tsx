import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { Amount, Token } from '@sushiswap/currency'
import { Fraction, JSBI, ZERO } from '@sushiswap/math'
import { Button, classNames, Dialog, Dots, Form, Input, Select, Switch, Typography } from '@sushiswap/ui'
import { createToast, CurrencyInput } from 'components'
import Layout from 'components/Layout'
import { parseUnits } from 'ethers/lib/utils'
import { approveBentoBoxAction, batchAction, vestingCreationAction } from 'features/actions'
import { TokenSelectorOverlay } from 'features/stream'
import {
  ApprovalState,
  useApproveCallback,
  useBentoBoxApproveCallback,
  useFuroVestingContract,
  useTokenBentoboxBalance,
  useTokenWalletBalance,
} from 'hooks'
import { FundSource, useFundSourceToggler } from 'hooks/useFundSourceToggler'
import { useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

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

const parseAmount = (token: Token, amount: string | undefined) => {
  return Amount.fromRawAmount(
    token,
    JSBI.BigInt(parseUnits(amount && Number(amount) > 0 ? amount : '0', token.decimals)).toString(),
  )
}

const Create = () => {
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const [token, setToken] = useState<Token>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const [error, setError] = useState<string>()
  const [cliff, setCliff] = useState(true)
  const [startDate, setStartDate] = useState<string>()
  const [recipient, setRecipient] = useState<string>()
  const [cliffEndDate, setCliffEndDate] = useState<string>()
  const [cliffAmount, setCliffAmount] = useState<string>()
  const [stepEndDate, setStepEndDate] = useState<string>()
  const [stepAmount, setStepAmount] = useState<string>()
  const [stepConfig, setStepConfig] = useState<StepConfig>(stepConfigurations[0])

  const contract = useFuroVestingContract()
  const { data: walletBalance } = useTokenWalletBalance(account?.address, token)
  const { data: bentoBalance } = useTokenBentoboxBalance(account?.address, token)
  const { value: fundSource, fromWallet, fromBentobox, setValue } = useFundSourceToggler(FundSource.BENTOBOX)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()
  const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApproveCallback(true, contract?.address)

  const [steps, stepDuration, cliffDuration] = useMemo(() => {
    if (!startDate || (stepEndDate && !stepConfig) || (cliff && !cliffEndDate)) {
      return [undefined, undefined]
    }

    const _startDate = new Date(startDate)
    let cliffDuration = JSBI.BigInt(0)
    if (cliff && cliffEndDate) {
      cliffDuration = JSBI.BigInt((new Date(cliffEndDate).getTime() - _startDate.getTime()) / 1000)
    }

    let totalStepDuration = JSBI.BigInt(0)
    if (stepEndDate) {
      const _stepEndDate = new Date(stepEndDate)
      totalStepDuration = cliffEndDate
        ? JSBI.BigInt((_stepEndDate.getTime() - new Date(cliffEndDate).getTime()) / 1000)
        : JSBI.BigInt((_stepEndDate.getTime() - _startDate.getTime()) / 1000)
    }

    const steps =
      totalStepDuration && stepConfig && JSBI.greaterThan(JSBI.BigInt(stepConfig?.time), JSBI.BigInt('0'))
        ? JSBI.divide(totalStepDuration, JSBI.BigInt(stepConfig?.time))
        : JSBI.BigInt(1)
    const stepDuration =
      totalStepDuration && stepConfig && JSBI.greaterThan(steps, JSBI.BigInt('0'))
        ? JSBI.divide(totalStepDuration, steps)
        : JSBI.BigInt(1)

    return [steps, stepDuration, cliffDuration]
  }, [cliff, cliffEndDate, startDate, stepConfig, stepEndDate])

  const [totalAmountAsEntity, stepPercentage] = useMemo(() => {
    if (!token || !steps) return [undefined, undefined]

    const cliff = parseAmount(token, cliffAmount)
    const step = parseAmount(token, stepAmount)
    const totalStep = parseAmount(token, stepAmount).multiply(JSBI.BigInt(steps))
    const totalAmount = cliff.add(totalStep)

    return [
      totalAmount,
      totalAmount?.greaterThan(ZERO)
        ? new Fraction(step.multiply(JSBI.BigInt(1e18)).quotient, totalAmount.quotient).quotient
        : JSBI.BigInt(0),
    ]
  }, [cliffAmount, stepAmount, steps, token])

  const [tokenApprovalState, approveToken] = useApproveCallback(
    true,
    totalAmountAsEntity,
    activeChain?.id ? BENTOBOX_ADDRESS[activeChain?.id] : undefined,
  )

  const createVesting = useCallback(async () => {
    if (!contract || !account?.address) return
    if (!recipient || !token || !startDate || !cliffDuration || !stepDuration || !stepPercentage) {
      setError('Missing required field')
      return
    }

    setError(undefined)

    const actions = [
      approveBentoBoxAction({ contract, user: account.address, signature }),
      vestingCreationAction({
        contract,
        recipient,
        token,
        startDate: new Date(startDate),
        cliffDuration: cliffDuration.toString(),
        stepDuration: stepDuration.toString(),
        steps: steps.toString(),
        stepPercentage: stepPercentage.toString(),
        amount: totalAmountAsEntity ? totalAmountAsEntity.quotient.toString() : JSBI.from('0').toString(),
        fromBentobox,
      }),
    ]

    console.log({
      contract,
      recipient,
      token,
      startDate: new Date(startDate),
      cliffDuration: cliffDuration.toString(),
      stepDuration: stepDuration.toString(),
      steps: steps.toString(),
      stepPercentage: stepPercentage.toString(),
      amount: totalAmountAsEntity ? totalAmountAsEntity.quotient.toString() : JSBI.from('0').toString(),
      fromBentobox,
    })
    console.log(contract.address, batchAction({ contract, actions }))

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
    } catch (e: any) {
      setError(e.message)
    }
  }, [
    account?.address,
    cliffDuration,
    contract,
    fromBentobox,
    recipient,
    sendTransactionAsync,
    signature,
    startDate,
    stepDuration,
    stepPercentage,
    steps,
    token,
    totalAmountAsEntity,
  ])

  // const schedule = new Schedule({ token, schedule: })

  return (
    <Layout gradient={false}>
      <Form header="Create vesting">
        <Form.Section
          title="General Details"
          description="Furo allows for creating a vested stream using your Bentobox balance."
        >
          <Form.Control label="Token">
            <Select.Button standalone className="!cursor-pointer" onClick={() => setDialogOpen(true)}>
              {token?.symbol || <span className="text-slate-500">Select a token</span>}
            </Select.Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <Dialog.Content className="!space-y-6 min-h-[300px] !max-w-md relative overflow-hidden border border-slate-700">
                <TokenSelectorOverlay onSelect={setToken} currency={token} />
              </Dialog.Content>
            </Dialog>
          </Form.Control>
          <Form.Control label="Start date">
            <Input.DatetimeLocal value={startDate} onChange={setStartDate} />
          </Form.Control>
          <Form.Control label="Recipient">
            <Input.Address placeholder="0x..." type="text" value={recipient} onChange={setRecipient} />
          </Form.Control>
          <Form.Control label="Change Funds Source">
            <div className="flex gap-3 items-center">
              <div
                onClick={() => setValue(FundSource.BENTOBOX)}
                className={classNames(
                  fromBentobox ? 'border-green/70 ring-green/70' : 'ring-transparent border-slate-700',
                  'ring-1 border bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]',
                )}
              >
                <Typography weight={700} variant="xs" className="!leading-5 tracking-widest text-slate-300">
                  Bentobox
                </Typography>
                {bentoBalance && (
                  <div className="flex flex-col gap-1">
                    <Typography variant="xs">Available Balance</Typography>
                    <Typography weight={700} variant="xs" className="text-slate-200">
                      {bentoBalance.toSignificant(6)}{' '}
                      <span className="text-slate-500">{bentoBalance.currency.symbol}</span>
                    </Typography>
                  </div>
                )}
                {fromBentobox && (
                  <div className="absolute top-3 right-3 w-5 h-5">
                    <CheckCircleIcon className="text-green/70" />
                  </div>
                )}
              </div>
              <div
                onClick={() => setValue(FundSource.WALLET)}
                className={classNames(
                  fromWallet ? 'border-green/70 ring-green/70' : 'ring-transparent border-slate-700',
                  'ring-1 border bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]',
                )}
              >
                <Typography weight={700} variant="sm" className="!leading-5 tracking-widest text-slate-300">
                  Wallet
                </Typography>
                {walletBalance && (
                  <div className="flex flex-col gap-1">
                    <Typography variant="xs">Available Balance</Typography>
                    <Typography weight={700} variant="xs" className="text-slate-200">
                      {walletBalance.toSignificant(6)}{' '}
                      <span className="text-slate-500">{walletBalance.currency.symbol}</span>
                    </Typography>
                  </div>
                )}
                {fromWallet && (
                  <div className="absolute top-3 right-3 w-5 h-5">
                    <CheckCircleIcon className="text-green/70" />
                  </div>
                )}
              </div>
            </div>
          </Form.Control>
        </Form.Section>
        <Form.Section title="Cliff details" description="Optionally provide cliff details for your vesting">
          <Form.Control label="Enable Cliff">
            <Switch
              checked={cliff}
              onChange={() => setCliff((prevState) => !prevState)}
              size="sm"
              color="gradient"
              uncheckedIcon={<XIcon />}
              checkedIcon={<CheckIcon />}
            />
          </Form.Control>
          <Form.Control disabled={!cliff} label="Cliff End Date">
            <Input.DatetimeLocal value={cliffEndDate} onChange={setCliffEndDate} />
          </Form.Control>
          <Form.Control disabled={!cliff} label="Cliff Amount">
            <CurrencyInput
              onChange={setCliffAmount}
              amount={cliffAmount}
              token={token}
              account={account?.address}
              fundSource={fundSource}
            />
            <Typography variant="xs" className="text-slate-500">
              Amount the recipient receives after the cliff end date
            </Typography>
          </Form.Control>
        </Form.Section>
        <Form.Section title="Graded Vesting Details" description="Optionally provide graded vesting details">
          <Form.Control label="Graded Vesting End Date">
            <Input.DatetimeLocal value={stepEndDate} onChange={setStepEndDate} />
          </Form.Control>
          <Form.Control label="Payment Frequency">
            <Select
              button={<Select.Button>{stepConfig.label}</Select.Button>}
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
          </Form.Control>
          <Form.Control label="Payout Per Frequency">
            <CurrencyInput
              onChange={setStepAmount}
              account={account?.address}
              amount={stepAmount}
              token={token}
              fundSource={fundSource}
            />
            <Typography variant="xs" className="text-slate-500">
              Amount the recipient receives after the graded vesting end date
            </Typography>
          </Form.Control>
        </Form.Section>
        <Form.Buttons>
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
        </Form.Buttons>
      </Form>
      {/*<VestingChart schedule={} vesting={} />*/}
    </Layout>
  )
}

export default Create
