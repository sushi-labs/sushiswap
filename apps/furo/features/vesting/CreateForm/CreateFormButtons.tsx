import { Signature } from '@ethersproject/bytes'
import { tryParseAmount } from '@sushiswap/currency'
import { FuroVesting } from '@sushiswap/furo/typechain'
import { FundSource } from '@sushiswap/hooks'
import log from '@sushiswap/log'
import { Fraction, JSBI, ZERO } from '@sushiswap/math'
import { Button, Dots, Form } from '@sushiswap/ui'
import { BENTOBOX_ADDRESS } from '@sushiswap/wagmi'
import { Approve } from '@sushiswap/wagmi/systems'
import { createToast } from 'components'
import { approveBentoBoxAction, batchAction, vestingCreationAction } from 'features/actions'
import { CreateVestingFormDataTransformed } from 'features/vesting/CreateForm/types'
import { useFuroVestingContract } from 'hooks'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

interface CreateFormButtons {
  onDismiss(): void
  formData: CreateVestingFormDataTransformed
}

const CreateFormButtons: FC<CreateFormButtons> = ({
  onDismiss,
  formData: {
    currency,
    startDate,
    stepAmount,
    fundSource,
    recipient,
    cliffAmount,
    cliffDuration,
    stepPayouts,
    stepConfig,
  },
}) => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const [signature, setSignature] = useState<Signature>()

  const contract = useFuroVestingContract(activeChain?.id)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  const [totalAmountAsEntity, stepPercentage] = useMemo(() => {
    if (!currency || !stepPayouts) return [undefined, undefined]

    const cliff = tryParseAmount(cliffAmount?.toString(), currency)
    const step = tryParseAmount(stepAmount.toString(), currency)
    const totalStep = tryParseAmount(stepAmount.toString(), currency)?.multiply(JSBI.BigInt(stepPayouts))
    const totalAmount = cliff && totalStep ? cliff.add(totalStep) : undefined

    return [
      totalAmount,
      totalAmount?.greaterThan(ZERO) && step
        ? new Fraction(step.multiply(JSBI.BigInt(1e18)).quotient, totalAmount.quotient).quotient
        : JSBI.BigInt(0),
    ]
  }, [cliffAmount, stepAmount, stepPayouts, currency])

  const createVesting = useCallback(async () => {
    if (!contract || !account?.address) return
    if (
      !recipient ||
      !currency ||
      !startDate ||
      !cliffDuration ||
      !stepConfig?.time ||
      !stepPercentage ||
      !totalAmountAsEntity
    ) {
      return
    }

    const actions = [
      approveBentoBoxAction<FuroVesting>({ contract, user: account.address, signature }),
      vestingCreationAction({
        contract,
        recipient,
        currency: currency,
        startDate: new Date(startDate),
        cliffDuration: cliffDuration.toString(),
        stepDuration: stepConfig?.time.toString(),
        steps: stepPayouts.toString(),
        stepPercentage: stepPercentage.toString(),
        amount: totalAmountAsEntity.quotient.toString(),
        fromBentobox: fundSource === FundSource.BENTOBOX,
      }),
    ]

    try {
      const data = await sendTransactionAsync({
        request: {
          from: account.address,
          to: contract.address,
          data: batchAction<FuroVesting>({ contract, actions }),
          value: totalAmountAsEntity.currency.isNative ? totalAmountAsEntity.quotient.toString() : '0',
        },
      })

      onDismiss()

      createToast({
        title: 'Create vesting',
        description: `You have successfully created a vested stream`,
        promise: data.wait(),
      })
    } catch (e: any) {
      log.tenderly({
        chainId: activeChain?.id,
        from: account.address,
        to: contract.address,
        data: batchAction<FuroVesting>({ contract, actions }),
        value: totalAmountAsEntity.currency.isNative ? totalAmountAsEntity.quotient.toString() : '0',
      })
    }
  }, [
    account?.address,
    activeChain?.id,
    cliffDuration,
    contract,
    fundSource,
    onDismiss,
    recipient,
    sendTransactionAsync,
    signature,
    startDate,
    stepConfig?.time,
    stepPayouts,
    stepPercentage,
    currency,
    totalAmountAsEntity,
  ])

  return (
    <Form.Buttons>
      <Approve
        components={
          <Approve.Components>
            <Approve.Bentobox watch address={contract?.address} onSignature={setSignature} />
            <Approve.Token
              watch
              amount={totalAmountAsEntity}
              address={activeChain ? BENTOBOX_ADDRESS[activeChain?.id] : undefined}
            />
          </Approve.Components>
        }
        render={({ approved }) => (
          <Button
            variant="filled"
            color="gradient"
            disabled={isWritePending || !approved || !totalAmountAsEntity?.greaterThan(ZERO)}
            onClick={createVesting}
          >
            {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create vesting'}
          </Button>
        )}
      />
    </Form.Buttons>
  )
}

export default CreateFormButtons
