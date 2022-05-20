import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { Fraction, JSBI, ZERO } from '@sushiswap/math'
import { Button, Dots, Form } from '@sushiswap/ui'
import { createToast } from 'components'
import { approveBentoBoxAction, batchAction, vestingCreationAction } from 'features/actions'
import { CreateVestingFormDataTransformed } from 'features/vesting/CreateForm/types'
import { parseAmount } from 'functions/parseAmount'
import { ApprovalState, useApproveCallback, useBentoBoxApproveCallback, useFuroVestingContract } from 'hooks'
import { FundSource } from 'hooks/useFundSourceToggler'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

interface CreateFormButtons {
  onDismiss(): void
  formData: CreateVestingFormDataTransformed
}

const CreateFormButtons: FC<CreateFormButtons> = ({
  onDismiss,
  formData: { token, startDate, stepAmount, fundSource, recipient, cliffAmount, steps, stepDuration, cliffDuration },
}) => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const [error, setError] = useState<string>()

  const contract = useFuroVestingContract()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()
  const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApproveCallback(true, contract?.address)

  const [totalAmountAsEntity, stepPercentage] = useMemo(() => {
    if (!token || !steps) return [undefined, undefined]

    const cliff = parseAmount(token, cliffAmount.toString())
    const step = parseAmount(token, stepAmount.toString())
    const totalStep = parseAmount(token, stepAmount.toString()).multiply(JSBI.BigInt(steps))
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
        fromBentobox: fundSource === FundSource.BENTOBOX,
      }),
    ]

    console.log({
      contract,
      recipient,
      token,
      startDate: new Date(startDate).getTime(),
      cliffDuration: cliffDuration.toString(),
      stepDuration: stepDuration.toString(),
      steps: steps.toString(),
      stepPercentage: stepPercentage.toString(),
      amount: totalAmountAsEntity ? totalAmountAsEntity.quotient.toString() : JSBI.from('0').toString(),
      fromBentobox: fundSource === FundSource.BENTOBOX,
    })
    try {
      const data = await sendTransactionAsync({
        request: {
          from: account.address,
          to: contract.address,
          data: batchAction({ contract, actions }),
        },
      })

      onDismiss()

      createToast({
        title: 'Create vesting',
        description: `You have successfully created a vested stream`,
        promise: data.wait(),
      })
    } catch (e: any) {
      setError(e.message)
    }
  }, [
    account.address,
    cliffDuration,
    contract,
    fundSource,
    onDismiss,
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

  return (
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
  )
}

export default CreateFormButtons
