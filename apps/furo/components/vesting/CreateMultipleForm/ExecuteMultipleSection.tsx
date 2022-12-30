import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionRequest } from '@ethersproject/providers'
import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dots } from '@sushiswap/ui'
import { Approve, useBentoBoxTotals, useFuroVestingRouterContract } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { Address } from '@wagmi/core'
import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { approveBentoBoxAction, batchAction, useDeepCompareMemoize, vestingCreationAction } from '../../../lib'
import { useNotifications } from '../../../lib/state/storage'
import { useTokensFromZTokens, ZFundSourceToFundSource } from '../../../lib/zod'
import { calculateCliffDuration, calculateStepPercentage, calculateTotalAmount } from '../utils'
import { CreateMultipleVestingFormSchemaType } from './schema'

export const ExecuteMultipleSection: FC<{
  chainId: ChainId
  isReview: boolean
}> = ({ chainId, isReview }) => {
  const { address } = useAccount()
  const contract = useFuroVestingRouterContract(chainId)
  const [, { createNotification }] = useNotifications(address)
  const [signature, setSignature] = useState<Signature>()

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

      createNotification({
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
    [chainId, createNotification, vestings]
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
                  stepDuration: stepConfig.time.toString(),
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
    enabled: Boolean(isReview && isValid && !isValidating && contract && address && chainId && vestings && rebases),
  })

  return (
    <Approve
      onSuccess={createNotification}
      className="!items-end"
      components={
        <Approve.Components>
          <Approve.Bentobox
            id="furo-create-multiple-vest-approve-bentobox"
            enabled={!!contract}
            address={contract ? (contract.address as Address) : undefined}
            onSignature={setSignature}
          />
          {Object.values(summedAmounts).map((amount, index) => (
            <Approve.Token
              id={`furo-create-multiple-vest-approve-token${index}`}
              enabled={!!amount}
              key={index}
              amount={amount}
              address={BENTOBOX_ADDRESS[chainId]}
            />
          ))}
        </Approve.Components>
      }
      render={({ approved }) => {
        return (
          <Button
            type="submit"
            onClick={() => sendTransaction?.()}
            disabled={isWritePending || !approved || !isValid || isValidating}
          >
            {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Vests'}
          </Button>
        )
      }}
    />
  )
}
