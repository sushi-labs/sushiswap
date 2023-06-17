import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionRequest } from '@ethersproject/providers'
import { Amount, Native, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Dots } from '@sushiswap/ui'
import {
  getFuroVestingRouterContractConfig,
  useAccount,
  useBentoBoxTotals,
  useFuroVestingRouterContract,
} from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { Address } from '@sushiswap/wagmi'
import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { approveBentoBoxAction, batchAction, useDeepCompareMemoize, vestingCreationAction } from '../../../lib'
import { useTokensFromZTokens, ZFundSourceToFundSource } from '../../../lib/zod'
import { calculateCliffDuration, calculateStepPercentage, calculateTotalAmount } from '../utils'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { FuroVestingRouterChainId } from '@sushiswap/furo'
import { bentoBoxV1Address } from '@sushiswap/bentobox'
import { CreateMultipleVestingFormSchemaType, STEP_CONFIGURATIONS } from '../schema'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { Button } from '@sushiswap/ui/future/components/button'

const APPROVE_TAG = 'approve-multiple-vestgs'

export const ExecuteMultipleSection: FC<{
  chainId: FuroVestingRouterChainId
  isReview: boolean
  onBack(): void
}> = withCheckerRoot(({ chainId, isReview, onBack }) => {
  const { address } = useAccount()
  const contract = useFuroVestingRouterContract(chainId)
  const [signature, setSignature] = useState<Signature>()
  const { approved } = useApproved(APPROVE_TAG)

  const {
    watch,
    formState: { isValid, isValidating },
  } = useFormContext<CreateMultipleVestingFormSchemaType>()

  // Watch mutates the same object which means effects do not trigger when you're watching an array
  const vestings = watch('vestings')
  const _vestings = useDeepCompareMemoize(vestings)

  const amounts = useMemo(() => {
    if (!_vestings) return []
    return _vestings.map(calculateTotalAmount)
  }, [_vestings])

  const currencies = useMemo(() => _vestings?.map((el) => el.currency) || [], [_vestings])
  const _tokens = useTokensFromZTokens(currencies)
  const rebases = useBentoBoxTotals(chainId, _tokens)

  const summedAmounts = useMemo(
    () =>
      amounts.reduce<Record<string, Amount<Type>>>((acc, cur) => {
        if (!cur) return acc
        const address = cur.currency.isNative ? AddressZero : cur.currency.address
        if (acc[address]) {
          acc[address] = acc[address].add(cur)
        } else {
          acc[address] = cur
        }
        return acc
      }, {}),
    [amounts]
  )

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !vestings) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'createVesting',
        chainId: chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Creating ${vestings.length} vests`,
          completed: `Creating ${vestings.length} vests`,
          failed: `Something went wrong trying to create ${vestings.length} vests`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, address, vestings]
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!isReview || !isValid || isValidating || !contract || !address || !chainId || !vestings || !rebases) return

      const summedValue = summedAmounts[AddressZero] || Amount.fromRawAmount(Native.onChain(chainId), '0')

      const actions: string[] = []
      if (signature) {
        actions.push(approveBentoBoxAction({ contract, user: address, signature }))
      }

      vestings
        .reduce<string[]>(
          (acc, { fundSource, recipient, currency, startDate, cliff, stepConfig, stepPayouts, stepAmount }, idx) => {
            const _currency = _tokens[idx]
            const _fundSource = ZFundSourceToFundSource.parse(fundSource)
            const stepPercentage = calculateStepPercentage({
              currency,
              cliff,
              stepAmount,
              stepPayouts,
            })
            const totalAmount = calculateTotalAmount({
              currency,
              cliff,
              stepAmount,
              stepPayouts,
            })
            const cliffDuration = calculateCliffDuration({ cliff, startDate })

            if (
              recipient &&
              startDate &&
              stepPayouts &&
              stepConfig &&
              stepPercentage &&
              totalAmount &&
              cliffDuration &&
              _currency &&
              rebases?.[_currency.wrapped.address]
            ) {
              acc.push(
                vestingCreationAction({
                  contract,
                  recipient,
                  currency: _currency,
                  startDate,
                  cliffDuration: cliffDuration.toString(),
                  stepDuration: STEP_CONFIGURATIONS[stepConfig].toString(),
                  steps: stepPayouts.toString(),
                  stepPercentage: stepPercentage.toString(),
                  amount: totalAmount.quotient.toString(),
                  fromBentobox: _fundSource === FundSource.BENTOBOX,
                  minShare: totalAmount.toShare(rebases[_currency.wrapped.address]),
                })
              )
            }
            return acc
          },
          []
        )
        .forEach((vesting) => actions.push(vesting))

      if (actions.length > 0) {
        setRequest({
          from: address,
          to: contract.address,
          data: batchAction({ contract, actions }),
          value: summedValue.quotient.toString(),
        })
      }
    },
    [_tokens, address, chainId, contract, isReview, isValid, isValidating, rebases, signature, summedAmounts, vestings]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => setSignature(undefined),
    enabled: Boolean(
      isReview && isValid && !isValidating && contract && address && chainId && vestings && rebases && approved
    ),
  })

  const approveAmounts = useMemo(
    () =>
      Object.values(summedAmounts).map((amount) => ({
        amount,
        contract: bentoBoxV1Address[chainId] as Address,
      })),
    [chainId, summedAmounts]
  )

  return (
    <div className="flex justify-end gap-4">
      <Button size="xl" type="button" variant="empty" onClick={onBack}>
        Cancel
      </Button>
      <Checker.Connect size="xl">
        <Checker.Network chainId={chainId} size="xl">
          <Checker.ApproveBentobox
            size="xl"
            id="create-multiple-vest-approve-bentobox"
            chainId={chainId}
            contract={getFuroVestingRouterContractConfig(chainId).address}
            onSignature={setSignature}
          >
            <Checker.ApproveERC20Multiple
              size="xl"
              id={'create-multiple-vest-approve-token'}
              amounts={approveAmounts}
            >
              <Checker.Success tag={APPROVE_TAG}>
                <Button
                  size="xl"
                  onClick={() => sendTransaction?.()}
                  type="submit"
                  loading={isWritePending}
                  disabled={!isValid || isValidating}
                  testdata-id="create-multiple-vest-confirm-button"
                >
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Vests'}
                </Button>
              </Checker.Success>
            </Checker.ApproveERC20Multiple>
          </Checker.ApproveBentobox>
        </Checker.Network>
      </Checker.Connect>
    </div>
  )
})
