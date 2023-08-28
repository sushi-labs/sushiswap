import { AddressZero } from '@ethersproject/constants'
import { BENTOBOX_ADDRESS, BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Amount, Native, tryParseAmount, Type } from '@sushiswap/currency'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { FundSource } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  Address,
  getFuroStreamRouterContractConfig,
  useAccount,
  useBentoBoxTotals,
  useFuroStreamRouterContract,
  usePrepareSendTransaction,
} from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useSignature } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { FC, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { Hex } from 'viem'

import { approveBentoBoxAction, batchAction, streamCreationAction, useDeepCompareMemoize } from '../../../lib'
import { useTokensFromZTokens, ZFundSourceToFundSource } from '../../../lib/zod'
import { CreateMultipleStreamFormSchemaType } from '../schema'

const APPROVE_TAG = 'approve-multiple-streams'

export const ExecuteMultipleSection: FC<{
  chainId: FuroChainId
  isReview: boolean
  onBack(): void
}> = withCheckerRoot(({ chainId, isReview, onBack }) => {
  const { address } = useAccount()
  const contract = useFuroStreamRouterContract(chainId)
  const { signature, setSignature } = useSignature(APPROVE_TAG)
  const { approved } = useApproved(APPROVE_TAG)

  const {
    watch,
    formState: { isValid, isValidating },
  } = useFormContext<CreateMultipleStreamFormSchemaType>()

  // Watch mutates the same object which means effects do not trigger when you're watching an array
  const streams = watch('streams')
  const _streams = useDeepCompareMemoize(streams)

  const amounts = useMemo(() => (_streams || []).map((el) => el.amount), [_streams])
  const tokens = useMemo(() => (_streams || []).map((el) => el.currency), [_streams])

  const _tokens = useTokensFromZTokens(tokens)
  const _amounts = useMemo(() => {
    return amounts.map((el, index) => tryParseAmount(el, _tokens[index]))
  }, [_tokens, amounts])

  const rebases = useBentoBoxTotals(chainId as BentoBoxChainId, _tokens)
  const summedAmounts = useMemo(
    () =>
      _amounts.reduce<Record<string, Amount<Type>>>((acc, cur) => {
        if (!cur) return acc
        const address = cur.currency.isNative ? AddressZero : cur.currency.address
        if (acc[address]) {
          acc[address] = acc[address].add(cur)
        } else {
          acc[address] = cur
        }
        return acc
      }, {}),
    [_amounts]
  )

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !streams) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'createStream',
        chainId: chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Creating ${streams.length} streams`,
          completed: `Created ${streams.length} streams`,
          failed: `Something went wrong trying to create ${streams.length} streams`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [address, chainId, streams]
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!isReview || !contract || !address || !chainId || !streams || streams?.length === 0 || !rebases) return

    const summedValue = summedAmounts[AddressZero] || Amount.fromRawAmount(Native.onChain(chainId), '0')

    const actions: Hex[] = []

    if (signature) {
      actions.push(approveBentoBoxAction({ user: address, signature }))
    }

    streams
      .reduce<Hex[]>((acc, { recipient, dates, fundSource }, idx) => {
        const _amount = _amounts[idx]
        const _fundSource = ZFundSourceToFundSource.parse(fundSource)

        if (recipient && _amount && dates?.startDate && dates?.endDate && rebases?.[_amount.currency.wrapped.address]) {
          acc.push(
            streamCreationAction({
              recipient,
              currency: _amount.currency,
              startDate: dates.startDate,
              endDate: dates.endDate,
              amount: _amount,
              fromBentobox: _fundSource === FundSource.BENTOBOX,
              minShare: _amount.toShare(rebases[_amount.currency.wrapped.address]),
            })
          )
        }

        return acc
      }, [])
      .forEach((action) => actions.push(action))

    if (actions.length > 0) {
      return {
        account: address,
        to: contract?.address,
        data: batchAction({ actions }),
        value: summedValue.quotient,
      }
    }

    return {}
  }, [_amounts, address, chainId, contract, isReview, rebases, signature, streams, summedAmounts])

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(isValid && !isValidating && isReview && approved),
  })

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: () => setSignature(undefined),
  })

  const approveAmounts = useMemo(
    () =>
      Object.values(summedAmounts).map((amount) => ({
        amount,
        contract: BENTOBOX_ADDRESS[chainId as BentoBoxChainId] as Address,
      })),
    [chainId, summedAmounts]
  )

  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="ghost" onClick={onBack}>
        Cancel
      </Button>
      <Checker.Connect size="default" fullWidth={false}>
        <Checker.Network size="default" fullWidth={false} chainId={chainId}>
          <Checker.ApproveBentobox
            size="default"
            fullWidth={false}
            tag={APPROVE_TAG}
            id="create-multiple-stream-approve-bentobox"
            chainId={chainId as BentoBoxChainId}
            masterContract={getFuroStreamRouterContractConfig(chainId).address}
          >
            <Checker.ApproveERC20Multiple
              size="default"
              fullWidth={false}
              id={'create-multiple-stream-approve-token'}
              amounts={approveAmounts}
            >
              <Checker.Success tag={APPROVE_TAG}>
                <Button
                  onClick={() => sendTransaction?.()}
                  type="submit"
                  loading={isWritePending}
                  disabled={!isValid || isValidating || !sendTransaction}
                  testId="create-multiple-streams-confirm"
                >
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Streams'}
                </Button>
              </Checker.Success>
            </Checker.ApproveERC20Multiple>
          </Checker.ApproveBentobox>
        </Checker.Network>
      </Checker.Connect>
    </div>
  )
})
