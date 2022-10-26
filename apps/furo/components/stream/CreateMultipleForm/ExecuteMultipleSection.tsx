import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dots } from '@sushiswap/ui'
import { Approve, BENTOBOX_ADDRESS, useBentoBoxTotals, useFuroStreamRouterContract } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../../lib'
import { useNotifications } from '../../../lib/state/storage'
import {
  useAmountsFromZAmounts,
  useTokensFromZAmounts,
  ZAmountToAmount,
  ZFundSourceToFundSource,
} from '../../../lib/zod'
import { CreateMultipleStreamBaseSchemaType } from './schema'

export const ExecuteMultipleSection: FC<{ chainId: ChainId; isReview: boolean }> = ({ chainId, isReview }) => {
  const { address } = useAccount()
  const contract = useFuroStreamRouterContract(chainId)
  const [, { createNotification }] = useNotifications(address)
  const [signature, setSignature] = useState<Signature>()

  const {
    watch,
    formState: { isValid, isValidating },
  } = useFormContext<CreateMultipleStreamBaseSchemaType>()

  const streams = watch('streams')
  const _amounts = useAmountsFromZAmounts((streams || []).map((el) => el.amount))
  const _tokens = useTokensFromZAmounts((streams || []).map((el) => el.amount))

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

      createNotification({
        type: 'send',
        chainId: chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Creating ${streams.length} streams`,
          completed: `Creating ${streams.length} streams`,
          failed: `Something went wrong trying to create ${streams.length} streams`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, streams]
  )

  const prepare = useCallback(
    (setRequest) => {
      if (!isReview || !contract || !address || !chainId || !streams || streams?.length === 0 || !rebases) return

      const summedValue = summedAmounts[AddressZero] || Amount.fromRawAmount(Native.onChain(chainId), '0')

      const actions: string[] = []

      if (signature) {
        actions.push(approveBentoBoxAction({ contract, user: address, signature }))
      }

      streams
        .reduce<string[]>((acc, { recipient, amount, dates, fundSource }) => {
          const _amount = ZAmountToAmount.parse(amount)
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
    [address, chainId, contract, isReview, rebases, signature, streams, summedAmounts]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => setSignature(undefined),
    enabled: Boolean(isValid && !isValidating && isReview),
  })

  return (
    <Approve
      onSuccess={createNotification}
      className="!items-end"
      components={
        <Approve.Components>
          <Approve.Bentobox address={contract?.address} onSignature={setSignature} />
          {Object.values(summedAmounts).map((amount, index) => (
            <Approve.Token key={index} amount={amount} address={BENTOBOX_ADDRESS[chainId]} />
          ))}
        </Approve.Components>
      }
      render={({ approved }) => {
        return (
          <Button
            onClick={() => sendTransaction?.()}
            type="submit"
            disabled={isWritePending || !approved || !isValid || isValidating}
          >
            {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Streams'}
          </Button>
        )
      }}
    />
  )
}
