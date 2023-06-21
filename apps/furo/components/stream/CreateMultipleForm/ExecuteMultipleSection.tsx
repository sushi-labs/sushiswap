import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionRequest } from '@ethersproject/providers'
import { Amount, Native, tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Dots } from '@sushiswap/ui/future/components/dots'
import {
  getFuroStreamRouterContractConfig,
  useAccount,
  useBentoBoxTotals,
  useFuroStreamRouterContract,
} from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { Address } from '@sushiswap/wagmi'
import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { approveBentoBoxAction, batchAction, streamCreationAction, useDeepCompareMemoize } from '../../../lib'
import { useTokensFromZTokens, ZFundSourceToFundSource } from '../../../lib/zod'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { FuroStreamRouterChainId } from '@sushiswap/furo'
import { bentoBoxV1Address } from '@sushiswap/bentobox'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { Button } from '@sushiswap/ui/future/components/button'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { CreateMultipleStreamFormSchemaType } from '../schema'

const APPROVE_TAG = 'approve-multiple-streams'

export const ExecuteMultipleSection: FC<{
  chainId: FuroStreamRouterChainId
  isReview: boolean
  onBack(): void
}> = withCheckerRoot(({ chainId, isReview, onBack }) => {
  const { address } = useAccount()
  const contract = useFuroStreamRouterContract(chainId)
  const [signature, setSignature] = useState<Signature>()
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

  const rebases = useBentoBoxTotals(chainId, _tokens)
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
        promise: data.wait(),
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

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!isReview || !contract || !address || !chainId || !streams || streams?.length === 0 || !rebases) return

      const summedValue = summedAmounts[AddressZero] || Amount.fromRawAmount(Native.onChain(chainId), '0')

      const actions: string[] = []

      if (signature) {
        actions.push(approveBentoBoxAction({ contract, user: address, signature }))
      }

      streams
        .reduce<string[]>((acc, { recipient, dates, fundSource }, idx) => {
          const _amount = _amounts[idx]
          const _fundSource = ZFundSourceToFundSource.parse(fundSource)

          if (
            recipient &&
            _amount &&
            dates?.startDate &&
            dates?.endDate &&
            rebases?.[_amount.currency.wrapped.address]
          ) {
            acc.push(
              streamCreationAction({
                contract,
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
        setRequest({
          from: address,
          to: contract?.address,
          data: batchAction({ contract, actions }),
          value: summedValue.quotient.toString(),
        })
      }
    },
    [_amounts, address, chainId, contract, isReview, rebases, signature, streams, summedAmounts]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => setSignature(undefined),
    enabled: Boolean(isValid && !isValidating && isReview && approved),
  })

  const approveAmounts = useMemo(
    () =>
      Object.values(summedAmounts).map((amount) => ({
        amount,
        contract: bentoBoxV1Address[chainId] as Address,
      })),
    [chainId, summedAmounts]
  )
  console.log({ approveAmounts })

  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="ghost" onClick={onBack}>
        Cancel
      </Button>
      <Checker.Connect>
        <Checker.Network chainId={chainId}>
          <Checker.ApproveBentobox
            id="create-multiple-stream-approve-bentobox"
            chainId={chainId}
            contract={getFuroStreamRouterContractConfig(chainId).address}
            onSignature={setSignature}
          >
            <Checker.ApproveERC20Multiple id={'create-multiple-stream-approve-token'} amounts={approveAmounts}>
              <Checker.Success tag={APPROVE_TAG}>
                <Button
                  size="xl"
                  onClick={() => sendTransaction?.()}
                  type="submit"
                  loading={isWritePending}
                  disabled={!isValid || isValidating || !sendTransaction}
                  testdata-id="create-multiple-streams-confirm-button"
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
