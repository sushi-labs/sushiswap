import { Signature } from '@ethersproject/bytes'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import log from '@sushiswap/log'
import { Fraction, JSBI, ZERO } from '@sushiswap/math'
import { Button, createToast, Dots, Form } from '@sushiswap/ui'
import { BENTOBOX_ADDRESS, useFuroVestingContract } from '@sushiswap/wagmi'
import { Approve } from '@sushiswap/wagmi/systems'
import { CreateVestingFormDataTransformedAndValidated } from 'components/vesting'
import { approveBentoBoxAction, batchAction, vestingCreationAction } from 'lib'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

interface CreateFormButtons {
  onDismiss(): void
  formData: CreateVestingFormDataTransformedAndValidated
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
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const [signature, setSignature] = useState<Signature>()

  const contract = useFuroVestingContract(activeChain?.id)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  const [totalAmountAsEntity, stepPercentage] = useMemo(() => {
    if (!currency || !stepPayouts) return [undefined, undefined]

    const cliff = tryParseAmount(cliffAmount?.toString(), currency)
    const step = tryParseAmount(stepAmount.toString(), currency)
    const totalStep = tryParseAmount(stepAmount.toString(), currency)?.multiply(JSBI.BigInt(stepPayouts))
    let totalAmount = totalStep

    if (cliff && totalStep) {
      totalAmount = totalStep.add(cliff)
    }

    return [
      totalAmount,
      totalAmount?.greaterThan(ZERO) && step
        ? new Fraction(step.multiply(JSBI.BigInt(1e18)).quotient, totalAmount.quotient).quotient
        : JSBI.BigInt(0),
    ]
  }, [cliffAmount, stepAmount, stepPayouts, currency])

  const createVesting = useCallback(async () => {
    if (!contract || !address || !activeChain?.id) return
    if (
      !recipient ||
      !currency ||
      !startDate ||
      !cliffDuration ||
      !stepConfig?.time ||
      !stepPercentage ||
      !totalAmountAsEntity ||
      !stepPayouts
    ) {
      return
    }

    const actions = [
      approveBentoBoxAction({ contract, user: address, signature }),
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
          from: address,
          to: contract.address,
          data: batchAction({ contract, actions }),
          value: totalAmountAsEntity.currency.isNative ? totalAmountAsEntity.quotient.toString() : '0',
        },
      })

      onDismiss()

      createToast({
        txHash: data.hash,
        href: Chain.from(activeChain.id).getTxUrl(data.hash),
        promise: data.wait(),
        summary: {
          pending: (
            <Dots>
              Creating a {totalAmountAsEntity?.toSignificant(6)} {totalAmountAsEntity.currency.symbol} vesting schedule
            </Dots>
          ),
          completed: `Successfully created a ${totalAmountAsEntity?.toSignificant(6)} ${
            totalAmountAsEntity.currency.symbol
          } vesting schedule`,
          failed: 'Something went wrong creating a vesting schedule',
        },
      })
    } catch (e: any) {
      log.tenderly({
        chainId: activeChain?.id,
        from: address,
        to: contract.address,
        data: batchAction({ contract, actions }),
        value: totalAmountAsEntity.currency.isNative ? totalAmountAsEntity.quotient.toString() : '0',
      })
    }
  }, [
    address,
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
        render={({ approved }) => {
          return (
            <Button
              variant="filled"
              color="gradient"
              disabled={isWritePending || !approved || !totalAmountAsEntity?.greaterThan(ZERO)}
              onClick={createVesting}
            >
              {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create vesting'}
            </Button>
          )
        }}
      />
    </Form.Buttons>
  )
}

export default CreateFormButtons
