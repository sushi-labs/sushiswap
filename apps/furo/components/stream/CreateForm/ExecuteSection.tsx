import { isAddress } from '@ethersproject/address'
import { Signature } from '@ethersproject/bytes'
import { TransactionRequest } from '@ethersproject/providers'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Dots, Form } from '@sushiswap/ui'
import { getFuroStreamRouterContractConfig, useBentoBoxTotal, useFuroStreamRouterContract } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAccount } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { FuroStreamRouterChainId } from '@sushiswap/furo'

import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../../lib'
import { ZFundSourceToFundSource, ZTokenToToken } from '../../../lib/zod'
import { CreateStreamFormSchemaType } from './schema'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { Button } from '@sushiswap/ui/future/components/button'
import { useApproved, useSignature, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'

const APPROVE_TAG = 'createStreamSingle'

export const ExecuteSection: FC<{ chainId: FuroStreamRouterChainId }> = withCheckerRoot(({ chainId }) => {
  const { address } = useAccount()
  const { approved } = useApproved(APPROVE_TAG)
  const { signature, setSignature } = useSignature(APPROVE_TAG)
  const contract = useFuroStreamRouterContract(chainId)

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

      void createToast({
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

      // console.log([
      //   recipient,
      //   _amount.currency,
      //   new Date(dates.startDate),
      //   new Date(dates.endDate),
      //   _amount.quotient.toString(),
      //   _fundSource === FundSource.BENTOBOX,
      //   _amount.toShare(rebase).quotient.toString(),
      // ])

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
        isAddress(recipient) &&
        approved
    ),
  })

  const formValid = isValid && !isValidating && Object.keys(errors).length === 0

  return (
    <Form.Buttons className="flex flex-col items-end gap-3">
      <Checker.Connect type="button" size="xl">
        <Checker.Network type="button" size="xl" chainId={chainId}>
          <Checker.Amounts type="button" size="xl" chainId={chainId} amounts={[_amount]}>
            <Checker.ApproveBentobox
              tag={APPROVE_TAG}
              type="button"
              id="furo-create-single-stream-approve-bentobox"
              size="xl"
              chainId={chainId as BentoBoxV1ChainId}
              masterContract={getFuroStreamRouterContractConfig(chainId).address}
            >
              <Checker.ApproveERC20
                type="button"
                contract={bentoBoxV1Address[chainId]}
                id="furo-create-single-stream-approve-token"
                size="xl"
                amount={_amount}
              >
                <Checker.Success tag={APPROVE_TAG}>
                  <Button
                    size="xl"
                    name="execute"
                    type="button"
                    variant="filled"
                    disabled={isWritePending || !formValid}
                    onClick={() => sendTransaction?.()}
                  >
                    {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Stream'}
                  </Button>
                </Checker.Success>
              </Checker.ApproveERC20>
            </Checker.ApproveBentobox>
          </Checker.Amounts>
        </Checker.Network>
      </Checker.Connect>
    </Form.Buttons>
  )
})
