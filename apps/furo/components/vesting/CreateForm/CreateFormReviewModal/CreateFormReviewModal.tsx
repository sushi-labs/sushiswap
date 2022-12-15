import { isAddress } from '@ethersproject/address'
import { Signature } from '@ethersproject/bytes'
import { TransactionRequest } from '@ethersproject/providers'
import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId } from '@sushiswap/chain'
import { FundSource } from '@sushiswap/hooks'
import { Button, classNames, Dots, Typography } from '@sushiswap/ui'
import { Approve, useBentoBoxTotal, useFuroVestingRouterContract } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { Address } from '@wagmi/core'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { approveBentoBoxAction, batchAction, useDeepCompareMemoize, vestingCreationAction } from '../../../../lib'
import { useNotifications } from '../../../../lib/state/storage'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../../lib/zod'
import { calculateCliffDuration, calculateStepPercentage, calculateTotalAmount } from '../../utils'
import { CreateVestingFormSchemaType } from '../schema'
import CreateFormReviewModalBase from './CreateFormReviewModalBase'

interface Item {
  title: string
  value: ReactNode | Array<ReactNode>
  className?: string
}

const Item: FC<Item> = ({ title, value, className }) => {
  return (
    <div className="flex items-center justify-between w-full gap-1">
      <Typography variant="xs" className="whitespace-nowrap text-slate-500">
        {title}
      </Typography>
      <Typography variant="xs" weight={500} className={classNames(className, 'whitespace-nowrap text-slate-200')}>
        {value}
      </Typography>
    </div>
  )
}

const Table: FC<{
  title: string
  className?: string
  children: React.ReactElement<typeof Item> | React.ReactElement<typeof Item>[]
}> = ({ children, title, className }) => {
  return (
    <div className={classNames(className, 'flex flex-col pb-3 gap-2')}>
      <Typography variant="xxs" className="!leading-5 tracking-widest text-slate-50 font-medium uppercase">
        {title}
      </Typography>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

interface CreateFormReviewModal {
  chainId: ChainId
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

const CreateFormReviewModal: FC<CreateFormReviewModal> = ({ chainId, children }) => {
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const contract = useFuroVestingRouterContract(chainId)
  const {
    watch,
    formState: { isValid, isValidating },
  } = useFormContext<CreateVestingFormSchemaType>()

  const [open, setOpen] = useState(false)
  const [signature, setSignature] = useState<Signature>()

  const formData = watch()
  const _formData = useDeepCompareMemoize(formData)

  const { recipient, startDate, stepConfig, stepPayouts, fundSource, currency, cliff, stepAmount } = _formData
  const _fundSource = ZFundSourceToFundSource.parse(fundSource)
  const _currency = useTokenFromZToken(formData.currency)
  const _totalAmount = useMemo(
    () => calculateTotalAmount({ currency, cliff, stepAmount, stepPayouts }),
    [cliff, currency, stepAmount, stepPayouts]
  )
  const _cliffDuration = useMemo(() => calculateCliffDuration({ cliff, startDate }), [cliff, startDate])
  const _stepPercentage = useMemo(
    () => calculateStepPercentage({ currency, cliff, stepAmount, stepPayouts }),
    [cliff, currency, stepAmount, stepPayouts]
  )
  const rebase = useBentoBoxTotal(chainId, _currency)

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !_totalAmount) return

      const ts = new Date().getTime()

      createNotification({
        type: 'createVesting',
        chainId: chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Creating ${_totalAmount.toSignificant(6)} ${_totalAmount.currency.symbol} vesting`,
          completed: `Created ${_totalAmount.toSignificant(6)} ${_totalAmount.currency.symbol} vesting`,
          failed: 'Something went wrong trying to create a vesting',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [_totalAmount, chainId, createNotification]
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (
        !isValid ||
        isValidating ||
        !contract ||
        !address ||
        !chainId ||
        !recipient ||
        !isAddress(recipient) ||
        !_currency ||
        !startDate ||
        !_cliffDuration ||
        !stepConfig?.time ||
        !_stepPercentage ||
        !_totalAmount ||
        !stepPayouts ||
        !rebase
      ) {
        return
      }

      const actions: string[] = []
      if (signature) {
        actions.push(approveBentoBoxAction({ contract, user: address, signature }))
      }

      actions.push(
        vestingCreationAction({
          contract,
          recipient,
          currency: _currency,
          startDate,
          cliffDuration: _cliffDuration.toString(),
          stepDuration: stepConfig?.time.toString(),
          steps: stepPayouts.toString(),
          stepPercentage: _stepPercentage.toString(),
          amount: _totalAmount.quotient.toString(),
          fromBentobox: _fundSource === FundSource.BENTOBOX,
          minShare: _totalAmount.toShare(rebase),
        })
      )

      setRequest({
        from: address,
        to: contract.address,
        data: batchAction({ contract, actions }),
        value: _currency.isNative ? _totalAmount.quotient.toString() : '0',
      })
    },
    [
      isValid,
      isValidating,
      contract,
      address,
      chainId,
      recipient,
      _currency,
      startDate,
      _cliffDuration,
      stepConfig?.time,
      _stepPercentage,
      _totalAmount,
      stepPayouts,
      rebase,
      signature,
      _fundSource,
    ]
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
        !isValidating &&
        contract &&
        address &&
        chainId &&
        recipient &&
        isAddress(recipient) &&
        _currency &&
        startDate &&
        _cliffDuration &&
        stepConfig?.time &&
        _stepPercentage &&
        _totalAmount &&
        stepPayouts &&
        rebase
    ),
  })

  return useMemo(
    () => (
      <>
        {children({ setOpen, isWritePending })}
        <CreateFormReviewModalBase chainId={chainId} open={open} setOpen={setOpen}>
          <Approve
            onSuccess={createNotification}
            components={
              <Approve.Components>
                <Approve.Bentobox
                  id="furo-create-single-vest-approve-bentobox"
                  fullWidth
                  enabled={isValid && !isValidating}
                  address={contract ? (contract.address as Address) : undefined}
                  onSignature={setSignature}
                />
                <Approve.Token
                  id="furo-create-single-vest-approve-token"
                  fullWidth
                  enabled={isValid && !isValidating && !!_totalAmount}
                  amount={_totalAmount}
                  address={BENTOBOX_ADDRESS[chainId]}
                />
              </Approve.Components>
            }
            render={({ approved }) => {
              return (
                <Button
                  fullWidth
                  size="md"
                  variant="filled"
                  color="blue"
                  disabled={isWritePending || !approved || !isValid || isValidating}
                  onClick={() => sendTransaction?.()}
                >
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Vesting'}
                </Button>
              )
            }}
          />
        </CreateFormReviewModalBase>
      </>
    ),
    [
      _totalAmount,
      chainId,
      children,
      contract?.address,
      createNotification,
      isValid,
      isValidating,
      isWritePending,
      open,
      sendTransaction,
    ]
  )
}

export default CreateFormReviewModal
