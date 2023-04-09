import { isAddress } from '@ethersproject/address'
import { Signature } from '@ethersproject/bytes'
import { TransactionRequest } from '@ethersproject/providers'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, Dots, Form } from '@sushiswap/ui'
import { Approve, useBentoBoxTotal, useFuroStreamRouterContract } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { Address } from '@wagmi/core'
import { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAccount } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { FuroStreamRouterChainId } from '@sushiswap/furo'

import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../../lib'
import { ZFundSourceToFundSource, ZTokenToToken } from '../../../lib/zod'
import { CreateStreamFormSchemaType } from './schema'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { bentoBoxV1Address } from '@sushiswap/bentobox'

export const ExecuteSection: FC<{ chainId: FuroStreamRouterChainId }> = ({ chainId }) => {
  const { address } = useAccount()
  const contract = useFuroStreamRouterContract(chainId)
  const [signature, setSignature] = useState<Signature>()

  const {
    watch,
    formState: { isValid, isValidating, errors },
  } = useFormContext<CreateStreamFormSchemaType>()

  const [amount, currency, fundSource, recipient, dates] = watch([
    'amount',
    'currency',
    'fundSource',
    'recipient',
    'dates',
  ])
  const _amount = useMemo(
    () => (currency ? tryParseAmount(amount, ZTokenToToken.parse(currency)) : undefined),
    [amount, currency]
  )
  const _fundSource = ZFundSourceToFundSource.parse(fundSource)
  const rebase = useBentoBoxTotal(chainId, _amount?.currency)

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !_amount) return

      const ts = new Date().getTime()

      createToast({
        account: address,
        type: 'createStream',
        chainId: chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Creating ${_amount.toSignificant(6)} ${_amount.currency.symbol} stream`,
          completed: `Created ${_amount.toSignificant(6)} ${_amount.currency.symbol} stream`,
          failed: 'Something went wrong trying to create a stream',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [_amount, chainId, address]
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (
        !_amount ||
        !contract ||
        !address ||
        !chainId ||
        !rebase ||
        !dates?.startDate ||
        !dates?.endDate ||
        !recipient ||
        !isAddress(recipient)
      )
        return

      const actions: string[] = []
      if (signature) {
        actions.push(approveBentoBoxAction({ contract, user: address, signature }))
      }

      console.log([
        recipient,
        _amount.currency,
        new Date(dates.startDate),
        new Date(dates.endDate),
        _amount.quotient.toString(),
        _fundSource === FundSource.BENTOBOX,
        _amount.toShare(rebase).quotient.toString(),
      ])

      actions.push(
        streamCreationAction({
          contract,
          recipient,
          currency: _amount.currency,
          startDate: new Date(dates.startDate),
          endDate: new Date(dates.endDate),
          amount: _amount,
          fromBentobox: _fundSource === FundSource.BENTOBOX,
          minShare: _amount.toShare(rebase),
        })
      )

      setRequest({
        from: address,
        to: contract?.address,
        data: batchAction({ contract, actions }),
        value: _amount.currency.isNative ? _amount.quotient.toString() : '0',
      })
    },
    [_amount, _fundSource, address, chainId, contract, dates?.endDate, dates?.startDate, rebase, recipient, signature]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => {
      setSignature(undefined)
    },
    enabled: Boolean(
      isValid &&
        _amount &&
        contract &&
        address &&
        chainId &&
        rebase &&
        dates?.startDate &&
        dates?.endDate &&
        recipient &&
        isAddress(recipient)
    ),
  })

  const formValid = isValid && !isValidating && Object.keys(errors).length === 0

  return (
    <Form.Buttons className="flex flex-col items-end gap-3">
      <Approve
        className="!items-end"
        components={
          <Approve.Components>
            <Approve.Bentobox
              id="furo-create-single-stream-approve-bentobox"
              enabled={formValid}
              address={contract ? (contract.address as Address) : undefined}
              onSignature={setSignature}
            />
            <Approve.Token
              id="furo-create-single-stream-approve-token"
              enabled={formValid && _amount?.greaterThan(ZERO)}
              amount={_amount}
              address={bentoBoxV1Address[chainId]}
            />
          </Approve.Components>
        }
        render={({ approved }) => {
          return (
            <Button
              name="execute"
              type="button"
              variant="filled"
              disabled={isWritePending || !approved || !formValid}
              onClick={() => sendTransaction?.()}
            >
              {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Stream'}
            </Button>
          )
        }}
      />
    </Form.Buttons>
  )
}
